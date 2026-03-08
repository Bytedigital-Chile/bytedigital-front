import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { nextTick } from "vue";
import { useSearch } from "~/composables/useSearch";

// We need a reference to the mock api function so tests can control its behavior.
// The setup.ts file mocks $fetch.create to return a vi.fn(). We capture it here.
let mockApiFn: ReturnType<typeof vi.fn>;

beforeEach(() => {
  // Patch $fetch.create to capture the mock function each time useApi is invoked
  (globalThis as any).$fetch = {
    create: (opts: any) => {
      mockApiFn = vi.fn();
      (mockApiFn as any)._baseURL = opts.baseURL;
      return mockApiFn;
    },
  };
});

describe("useSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with empty query, results, and loading=false", () => {
    const { query, results, loading } = useSearch();

    expect(query.value).toBe("");
    expect(results.value).toEqual([]);
    expect(loading.value).toBe(false);
  });

  it("ignores queries shorter than 2 characters", async () => {
    const { query, results } = useSearch();

    query.value = "a";
    await nextTick();
    vi.advanceTimersByTime(500);

    expect(results.value).toEqual([]);
    expect(mockApiFn).not.toHaveBeenCalled();
  });

  it("clears results when query is emptied", async () => {
    const { query, results } = useSearch();

    // First set a valid query
    mockApiFn.mockResolvedValueOnce({ items: [{ id: 1, name: "Found" }] });
    query.value = "test";
    await nextTick();
    vi.advanceTimersByTime(300);
    await vi.runAllTimersAsync();
    await nextTick();

    // Now clear query
    query.value = "";
    await nextTick();

    expect(results.value).toEqual([]);
  });

  it("debounces API calls by 300ms", async () => {
    const { query } = useSearch();

    mockApiFn.mockResolvedValue({ items: [] });

    query.value = "te";
    await nextTick();

    // At 200ms -- should NOT have called api yet
    vi.advanceTimersByTime(200);
    expect(mockApiFn).not.toHaveBeenCalled();

    // At 300ms -- should fire
    vi.advanceTimersByTime(100);
    expect(mockApiFn).toHaveBeenCalledTimes(1);
  });

  it("sets loading=true while search is in progress", async () => {
    const { query, loading } = useSearch();

    // Make the api return a pending promise we can control
    let resolveApi!: (val: any) => void;
    mockApiFn.mockImplementation(
      () => new Promise((res) => { resolveApi = res; }),
    );

    query.value = "phone";
    await nextTick();

    // After query change, loading should be true immediately (before debounce fires)
    expect(loading.value).toBe(true);

    // Fire the debounced call
    vi.advanceTimersByTime(300);

    // Still loading because api hasn't resolved
    expect(loading.value).toBe(true);

    // Resolve the api call
    resolveApi({ items: [{ id: 1, name: "Phone" }] });
    await vi.runAllTimersAsync();
    await nextTick();

    expect(loading.value).toBe(false);
  });

  it("populates results from API response", async () => {
    const { query, results } = useSearch();
    const mockItems = [
      { id: 1, name: "Product A" },
      { id: 2, name: "Product B" },
    ];

    mockApiFn.mockResolvedValueOnce({ items: mockItems });

    query.value = "product";
    await nextTick();
    vi.advanceTimersByTime(300);
    await vi.runAllTimersAsync();
    await nextTick();

    expect(results.value).toEqual(mockItems);
  });

  it("calls API with the correct URL including encoded query", async () => {
    const { query } = useSearch();

    mockApiFn.mockResolvedValueOnce({ items: [] });

    query.value = "hello world";
    await nextTick();
    vi.advanceTimersByTime(300);

    expect(mockApiFn).toHaveBeenCalledWith(
      "/products/?search=hello%20world&page_size=8",
    );
  });

  it("clears results on API error", async () => {
    const { query, results } = useSearch();

    mockApiFn.mockRejectedValueOnce(new Error("Network error"));

    query.value = "fail";
    await nextTick();
    vi.advanceTimersByTime(300);
    await vi.runAllTimersAsync();
    await nextTick();

    expect(results.value).toEqual([]);
  });

  it("cancels previous debounced call on rapid typing", async () => {
    const { query } = useSearch();

    mockApiFn.mockResolvedValue({ items: [] });

    query.value = "ab";
    await nextTick();
    vi.advanceTimersByTime(150);

    query.value = "abc";
    await nextTick();
    vi.advanceTimersByTime(150);

    // 300ms total have passed but only 150ms since last change,
    // so api should NOT have been called yet
    expect(mockApiFn).not.toHaveBeenCalled();

    // Another 150ms to complete the debounce from "abc"
    vi.advanceTimersByTime(150);
    expect(mockApiFn).toHaveBeenCalledTimes(1);
    expect(mockApiFn).toHaveBeenCalledWith(
      "/products/?search=abc&page_size=8",
    );
  });
});

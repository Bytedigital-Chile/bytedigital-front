export function useApi() {
  const config = useRuntimeConfig();
  const token = useCookie("customer_token", { maxAge: 60 * 60 * 8 });

  const baseURL = import.meta.server
    ? (config.apiBase as string)
    : (config.public.apiBase as string);

  const api = $fetch.create({
    baseURL,
    onRequest({ options }) {
      const t = token.value;
      if (t) {
        const headers = new Headers(options.headers as HeadersInit | undefined);
        headers.set("Authorization", `Bearer ${t}`);
        options.headers = headers;
      }
    },
  });

  return { api };
}

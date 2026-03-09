export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

let _id = 0;

export function useToast() {
  const toasts = useState<Toast[]>("toasts", () => []);

  function show(message: string, type: Toast["type"] = "success", duration = 2500) {
    const id = ++_id;
    toasts.value.push({ id, message, type });
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, duration);
  }

  return { toasts, show };
}

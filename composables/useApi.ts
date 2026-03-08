export function useApi() {
  const config = useRuntimeConfig();
  const baseURL = import.meta.server
    ? (config.apiBase as string)
    : (config.public.apiBase as string);

  const api = $fetch.create({ baseURL });

  return { api };
}

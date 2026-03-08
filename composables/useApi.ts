export function useApi() {
  const config = useRuntimeConfig();

  const api = $fetch.create({
    baseURL: config.public.apiBase as string,
  });

  return { api };
}

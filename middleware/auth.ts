export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("customer_token");
  if (!token.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }
});

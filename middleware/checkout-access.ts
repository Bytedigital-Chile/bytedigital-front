// Checkout is reachable either by an authenticated customer OR by a visitor who
// explicitly chose "continuar como invitado" on the login gate.
export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("customer_token");
  const { active } = useGuestCheckout();
  if (token.value || active.value) return;
  return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
});

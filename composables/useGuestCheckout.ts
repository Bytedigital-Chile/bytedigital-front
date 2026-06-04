// Guest-checkout state is backed by cookies (NOT useState) so it is shared
// between SSR and the client. With useState the server rendered isGuest=false
// while the client had it true, producing a hydration mismatch that left the
// inline address form unrendered. Cookies also keep guest mode across reloads.
export function useGuestCheckout() {
  const opts = { maxAge: 60 * 60 * 6, sameSite: "lax" as const, path: "/" };
  const active = useCookie<boolean>("bd_guest_checkout", { default: () => false, ...opts });
  const email = useCookie<string>("bd_guest_email", { default: () => "", ...opts });

  function enable(initialEmail = "") {
    active.value = true;
    if (initialEmail) email.value = initialEmail;
  }

  function setEmail(value: string) {
    email.value = value;
    // Also persist synchronously: the Flow flow leaves the SPA via
    // window.location, and Nuxt's cookie write (async watcher) may not flush
    // before navigation. localStorage.setItem is synchronous and survives the
    // external redirect, so /pago/resultado can recover the email on return.
    if (import.meta.client && value) {
      localStorage.setItem("bd_guest_email", value);
    }
  }

  // Email persisted at checkout, recovered by the confirmation pages.
  function restoreEmail(): string {
    if (email.value) return email.value;
    if (import.meta.client) {
      const stored = localStorage.getItem("bd_guest_email") || "";
      if (stored) email.value = stored;
      return stored;
    }
    return "";
  }

  function reset() {
    active.value = false;
    email.value = "";
    if (import.meta.client) localStorage.removeItem("bd_guest_email");
  }

  return { active, email, enable, setEmail, restoreEmail, reset };
}

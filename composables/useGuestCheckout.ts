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
  }

  // Email persisted at checkout, recovered by the confirmation pages.
  function restoreEmail(): string {
    return email.value || "";
  }

  function reset() {
    active.value = false;
    email.value = "";
  }

  return { active, email, enable, setEmail, restoreEmail, reset };
}

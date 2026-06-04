const GUEST_EMAIL_KEY = "bytedigital_guest_email";

// Tracks whether the user chose "continuar como invitado" and remembers the
// guest email so the confirmation pages can fetch the order without an account.
export function useGuestCheckout() {
  const active = useState<boolean>("guest_checkout", () => false);
  const email = useState<string>("guest_email", () => "");

  function enable(initialEmail = "") {
    active.value = true;
    if (initialEmail) email.value = initialEmail;
  }

  function setEmail(value: string) {
    email.value = value;
    if (import.meta.client && value) {
      localStorage.setItem(GUEST_EMAIL_KEY, value);
    }
  }

  // Recover the email persisted at checkout (e.g. after a Flow redirect back).
  function restoreEmail(): string {
    if (email.value) return email.value;
    if (import.meta.client) {
      const stored = localStorage.getItem(GUEST_EMAIL_KEY) || "";
      email.value = stored;
      return stored;
    }
    return "";
  }

  function reset() {
    active.value = false;
    email.value = "";
    if (import.meta.client) localStorage.removeItem(GUEST_EMAIL_KEY);
  }

  return { active, email, enable, setEmail, restoreEmail, reset };
}

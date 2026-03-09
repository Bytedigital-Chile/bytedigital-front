import type { CustomerUser } from "~/types";

export function useAuth() {
  const token = useCookie("customer_token", { maxAge: 60 * 60 * 8 });
  const user = useState<CustomerUser | null>("customer_user", () => null);

  const { api } = useApi();

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  async function login(email: string, password: string) {
    const data = await api<{ access_token: string }>("/customer-auth/login", {
      method: "POST",
      body: { email, password },
    });
    token.value = data.access_token;
    await fetchUser();
  }

  async function register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone?: string,
  ) {
    const data = await api<{ message: string }>("/customer-auth/register", {
      method: "POST",
      body: {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
      },
    });
    return data.message;
  }

  async function resendVerification(email: string) {
    const data = await api<{ message: string }>("/customer-auth/resend-verification", {
      method: "POST",
      body: { email },
    });
    return data.message;
  }

  async function loginWithGoogle(credential: string) {
    const data = await api<{ access_token: string }>("/customer-auth/google", {
      method: "POST",
      body: { credential },
    });
    token.value = data.access_token;
    await fetchUser();
  }

  async function fetchUser() {
    if (!token.value) return;
    try {
      user.value = await api<CustomerUser>("/customer-auth/me", {
        headers: { Authorization: `Bearer ${token.value}` },
      });
    } catch {
      token.value = null;
      user.value = null;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    navigateTo("/");
  }

  // Restore session on SSR/mount
  if (token.value && !user.value) {
    fetchUser();
  }

  return { token, user, isAuthenticated, login, register, resendVerification, loginWithGoogle, fetchUser, logout };
}

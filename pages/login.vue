<template>
  <div class="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Bienvenido a ByteDigital</h1>
        <p class="text-gray-500 mt-2">Ingresa a tu cuenta o crea una nueva</p>
      </div>

      <!-- Verified success alert -->
      <div
        v-if="route.query.verified === 'true'"
        class="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
      >
        <CheckCircle2 class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
        <div>
          <p class="text-green-800 font-medium text-sm">Email verificado correctamente</p>
          <p class="text-green-600 text-sm">Ahora puedes iniciar sesión con tu cuenta.</p>
        </div>
      </div>

      <!-- Verify error alert -->
      <div
        v-if="route.query.verify_error === 'true'"
        class="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
      >
        <AlertCircle class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
        <div>
          <p class="text-red-800 font-medium text-sm">Error al verificar email</p>
          <p class="text-red-600 text-sm">El enlace es inválido o ha expirado. Intenta reenviar el correo de verificación.</p>
        </div>
      </div>

      <div class="bg-white border rounded-xl p-6 shadow-sm">
        <!-- Check email panel (after registration) -->
        <div v-if="showCheckEmail" class="text-center py-4">
          <Mail class="w-12 h-12 text-primary-600 mx-auto mb-4" />
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Revisa tu correo</h2>
          <p class="text-gray-500 text-sm mb-6">
            Hemos enviado un enlace de verificación a
            <span class="font-medium text-gray-700">{{ registeredEmail }}</span>.
            Revisa tu bandeja de entrada y haz click en el enlace para activar tu cuenta.
          </p>
          <button
            :disabled="resendLoading || resendCooldown > 0"
            class="text-primary-600 hover:text-primary-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleResend"
          >
            {{ resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : resendLoading ? "Enviando..." : "Reenviar correo de verificación" }}
          </button>
          <p v-if="resendMessage" class="text-green-600 text-sm mt-2">{{ resendMessage }}</p>
          <div class="mt-6 pt-4 border-t">
            <button
              class="text-sm text-gray-500 hover:text-gray-700"
              @click="showCheckEmail = false; activeTab = 'login'"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>

        <template v-else>
          <!-- Tabs -->
          <div class="flex border-b mb-6">
            <button
              class="flex-1 pb-3 text-sm font-semibold transition-colors"
              :class="activeTab === 'login' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-400'"
              @click="activeTab = 'login'"
            >
              Iniciar sesión
            </button>
            <button
              class="flex-1 pb-3 text-sm font-semibold transition-colors"
              :class="activeTab === 'register' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-400'"
              @click="activeTab = 'register'"
            >
              Crear cuenta
            </button>
          </div>

          <!-- Login form -->
          <form v-if="activeTab === 'login'" class="space-y-4" @submit.prevent="handleLogin">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="loginForm.email"
                type="email"
                required
                class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                v-model="loginForm.password"
                type="password"
                required
                class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            <p v-if="error && !needsVerification" class="text-red-500 text-sm">{{ error }}</p>

            <!-- Email not verified error with resend -->
            <div v-if="needsVerification" class="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p class="text-amber-800 text-sm font-medium">{{ error }}</p>
              <button
                type="button"
                class="text-amber-700 hover:text-amber-900 text-sm underline mt-1"
                @click="handleResendFromLogin"
              >
                Reenviar correo de verificación
              </button>
              <p v-if="resendMessage" class="text-green-600 text-sm mt-1">{{ resendMessage }}</p>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-primary-600 text-white rounded-lg py-2.5 font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {{ loading ? "Ingresando..." : "Iniciar sesión" }}
            </button>
          </form>

          <!-- Register form -->
          <form v-else class="space-y-4" @submit.prevent="handleRegister">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  v-model="registerForm.firstName"
                  type="text"
                  required
                  class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input
                  v-model="registerForm.lastName"
                  type="text"
                  required
                  class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="registerForm.email"
                type="email"
                required
                class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                v-model="registerForm.password"
                type="password"
                required
                minlength="8"
                class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
              <input
                v-model="registerForm.confirmPassword"
                type="password"
                required
                class="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-primary-600 text-white rounded-lg py-2.5 font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {{ loading ? "Creando cuenta..." : "Crear cuenta" }}
            </button>
          </form>

          <!-- Divider -->
          <div class="flex items-center gap-4 my-6">
            <div class="flex-1 border-t" />
            <span class="text-xs text-gray-400">o continuar con</span>
            <div class="flex-1 border-t" />
          </div>

          <!-- Google Sign-In -->
          <div id="google-signin-button" class="flex justify-center" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, AlertCircle, Mail } from "lucide-vue-next";

const route = useRoute();
const { login, register, resendVerification, loginWithGoogle, isAuthenticated } = useAuth();

const activeTab = ref<"login" | "register">(
  route.query.verified === "true" ? "login" : "login",
);
const loading = ref(false);
const error = ref("");
const needsVerification = ref(false);
const showCheckEmail = ref(false);
const registeredEmail = ref("");
const resendLoading = ref(false);
const resendMessage = ref("");
const resendCooldown = ref(0);

const loginForm = reactive({ email: "", password: "" });
const registerForm = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// Redirect if already authenticated
watch(isAuthenticated, (val) => {
  if (val) {
    const redirect = (route.query.redirect as string) || "/";
    navigateTo(redirect);
  }
}, { immediate: true });

function startCooldown() {
  resendCooldown.value = 60;
  const interval = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) clearInterval(interval);
  }, 1000);
}

async function handleLogin() {
  error.value = "";
  needsVerification.value = false;
  loading.value = true;
  try {
    await login(loginForm.email, loginForm.password);
  } catch (e: any) {
    const detail = e.data?.detail || "Error al iniciar sesión";
    error.value = detail;
    if (e.status === 403 && detail.includes("verificar")) {
      needsVerification.value = true;
    }
  } finally {
    loading.value = false;
  }
}

async function handleRegister() {
  error.value = "";
  if (registerForm.password !== registerForm.confirmPassword) {
    error.value = "Las contraseñas no coinciden";
    return;
  }
  loading.value = true;
  try {
    await register(
      registerForm.email,
      registerForm.password,
      registerForm.firstName,
      registerForm.lastName,
    );
    registeredEmail.value = registerForm.email;
    showCheckEmail.value = true;
  } catch (e: any) {
    error.value = e.data?.detail || "Error al crear cuenta";
  } finally {
    loading.value = false;
  }
}

async function handleResend() {
  resendLoading.value = true;
  resendMessage.value = "";
  try {
    await resendVerification(registeredEmail.value);
    resendMessage.value = "Correo enviado";
    startCooldown();
  } catch {
    resendMessage.value = "Error al reenviar";
  } finally {
    resendLoading.value = false;
  }
}

async function handleResendFromLogin() {
  resendLoading.value = true;
  resendMessage.value = "";
  try {
    await resendVerification(loginForm.email);
    resendMessage.value = "Correo de verificación enviado";
  } catch {
    resendMessage.value = "Error al reenviar";
  } finally {
    resendLoading.value = false;
  }
}

// Google Sign-In initialization
onMounted(() => {
  const config = useRuntimeConfig();
  const clientId = config.public.googleClientId as string;
  if (!clientId) return;

  const initGoogle = () => {
    if (!(window as any).google?.accounts) return;
    (window as any).google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: any) => {
        loading.value = true;
        error.value = "";
        try {
          await loginWithGoogle(response.credential);
        } catch (e: any) {
          error.value = e.data?.detail || "Error con Google";
        } finally {
          loading.value = false;
        }
      },
    });
    (window as any).google.accounts.id.renderButton(
      document.getElementById("google-signin-button"),
      { theme: "outline", size: "large", width: "100%", text: "continue_with", locale: "es" },
    );
  };

  // Wait for Google script to load
  if ((window as any).google?.accounts) {
    initGoogle();
  } else {
    const interval = setInterval(() => {
      if ((window as any).google?.accounts) {
        clearInterval(interval);
        initGoogle();
      }
    }, 100);
    setTimeout(() => clearInterval(interval), 5000);
  }
});

useHead({ title: "Ingresar - ByteDigital" });
</script>

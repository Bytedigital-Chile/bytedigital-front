<template>
  <div>
    <!-- Promotional bar -->
    <div class="bg-primary-600 text-white text-xs py-1.5">
      <div class="max-w-7xl mx-auto px-4 flex items-center justify-center gap-6 md:gap-8">
        <span class="flex items-center gap-1.5">
          <Truck class="w-3.5 h-3.5" />
          Envío gratis sobre $50.000
        </span>
        <span class="hidden sm:flex items-center gap-1.5">
          <ShieldCheck class="w-3.5 h-3.5" />
          Compra segura
        </span>
        <span class="hidden md:flex items-center gap-1.5">
          <Headphones class="w-3.5 h-3.5" />
          Soporte 24/7
        </span>
      </div>
    </div>

    <!-- Main header -->
    <header
      class="bg-white sticky top-0 z-50 transition-shadow duration-300"
      :class="scrolled ? 'shadow-md' : 'border-b'"
    >
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Zap class="w-5 h-5 text-white" />
            </div>
            <span class="text-xl md:text-2xl font-bold text-gray-900">
              Byte<span class="text-primary-600">Digital</span>
            </span>
          </NuxtLink>

          <!-- Search -->
          <div class="hidden md:block flex-1 max-w-xl mx-8">
            <LayoutSearchBar />
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-4">
            <!-- User menu -->
            <div v-if="isAuthenticated" class="relative" ref="userMenuRef">
              <button
                class="flex items-center gap-1.5 text-gray-700 hover:text-primary-600 transition-colors"
                @click="showUserMenu = !showUserMenu"
              >
                <User class="w-5 h-5" />
                <span class="hidden sm:inline text-sm font-medium">{{ user?.first_name }}</span>
                <ChevronDown class="w-3.5 h-3.5" />
              </button>
              <div
                v-if="showUserMenu"
                class="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg py-1 z-50"
              >
                <NuxtLink
                  to="/mi-cuenta/datos"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  @click="showUserMenu = false"
                >
                  Mi cuenta
                </NuxtLink>
                <NuxtLink
                  to="/mi-cuenta/compras"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  @click="showUserMenu = false"
                >
                  Mis compras
                </NuxtLink>
                <NuxtLink
                  to="/mi-cuenta/favoritos"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  @click="showUserMenu = false"
                >
                  Favoritos
                </NuxtLink>
                <div class="border-t my-1" />
                <button
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  @click="handleLogout"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
            <NuxtLink
              v-else
              to="/login"
              class="flex items-center gap-1.5 text-gray-500 hover:text-primary-600 transition-colors"
            >
              <User class="w-5 h-5" />
              <span class="hidden sm:inline text-sm">Ingresar</span>
            </NuxtLink>

            <!-- Cart -->
            <NuxtLink
              to="/carrito"
              class="relative flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart class="w-5 h-5" />
              <span class="hidden sm:inline text-sm font-medium">{{ formatCLP(cartTotal) }}</span>
              <span
                v-if="cartCount > 0"
                class="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center"
              >
                {{ cartCount }}
              </span>
            </NuxtLink>
          </div>
        </div>

        <!-- Mobile search -->
        <div class="md:hidden pb-3">
          <LayoutSearchBar />
        </div>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from "@vueuse/core";
import { Truck, ShieldCheck, Headphones, Zap, User, ShoppingCart, ChevronDown } from "lucide-vue-next";
import { formatCLP } from "~/utils/format";

const { cartTotal, cartCount } = useCart();
const { user, isAuthenticated, logout } = useAuth();

const scrolled = ref(false);
const showUserMenu = ref(false);
const userMenuRef = ref<HTMLElement | null>(null);

onClickOutside(userMenuRef, () => {
  showUserMenu.value = false;
});

function handleLogout() {
  showUserMenu.value = false;
  logout();
}

function onScroll() {
  scrolled.value = window.scrollY > 10;
}

onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener("scroll", onScroll));
</script>

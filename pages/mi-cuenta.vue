<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 flex-shrink-0">
        <nav class="bg-gray-50 rounded-xl p-2 space-y-1">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
            :class="isActive(item.to)
              ? 'bg-primary-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'"
          >
            <component :is="item.icon" class="w-4 h-4" />
            {{ item.label }}
          </NuxtLink>
        </nav>
      </aside>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShoppingBag, Heart, UserCog, MapPin, FileText, Lock } from "lucide-vue-next";

definePageMeta({ middleware: "auth" });

const route = useRoute();

const menuItems = [
  { to: "/mi-cuenta/compras", icon: ShoppingBag, label: "Compras" },
  { to: "/mi-cuenta/favoritos", icon: Heart, label: "Productos favoritos" },
  { to: "/mi-cuenta/datos", icon: UserCog, label: "Datos personales" },
  { to: "/mi-cuenta/direcciones", icon: MapPin, label: "Direcciones" },
  { to: "/mi-cuenta/facturacion", icon: FileText, label: "Datos de facturación" },
  { to: "/mi-cuenta/seguridad", icon: Lock, label: "Seguridad" },
];

function isActive(to: string) {
  return route.path === to || route.path.startsWith(to + "/");
}

useHead({ title: "Mi cuenta - ByteDigital" });
</script>

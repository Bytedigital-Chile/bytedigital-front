<template>
  <footer class="bg-gray-900 text-gray-400 mt-16">
    <!-- Trust badges -->
    <div class="border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
              <Truck class="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p class="text-white text-sm font-medium">Envío a todo Chile</p>
              <p class="text-xs">Despacho rápido y seguro</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck class="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p class="text-white text-sm font-medium">Compra segura</p>
              <p class="text-xs">Datos protegidos</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
              <RotateCcw class="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p class="text-white text-sm font-medium">Garantía</p>
              <p class="text-xs">Cambios y devoluciones</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
              <CreditCard class="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p class="text-white text-sm font-medium">Pago seguro</p>
              <p class="text-xs">Múltiples medios de pago</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main footer -->
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- About -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center">
              <Zap class="w-4 h-4 text-white" />
            </div>
            <span class="text-white text-lg font-bold">ByteDigital</span>
          </div>
          <p class="text-sm leading-relaxed">Tu tienda de tecnología y computación en Chile. Los mejores precios y las mejores marcas.</p>
          <!-- Social icons -->
          <div class="flex items-center gap-3 mt-4">
            <a href="#" class="w-8 h-8 rounded-full bg-gray-800 hover:bg-primary-500 transition-colors flex items-center justify-center">
              <Facebook class="w-4 h-4 text-gray-400 hover:text-white" />
            </a>
            <a href="#" class="w-8 h-8 rounded-full bg-gray-800 hover:bg-primary-500 transition-colors flex items-center justify-center">
              <Instagram class="w-4 h-4 text-gray-400 hover:text-white" />
            </a>
            <a href="#" class="w-8 h-8 rounded-full bg-gray-800 hover:bg-primary-500 transition-colors flex items-center justify-center">
              <Twitter class="w-4 h-4 text-gray-400 hover:text-white" />
            </a>
          </div>
        </div>

        <!-- Links -->
        <div>
          <h4 class="text-white font-semibold mb-4">Enlaces</h4>
          <ul class="space-y-2.5 text-sm">
            <li><NuxtLink to="/" class="hover:text-white transition-colors">Inicio</NuxtLink></li>
            <li><NuxtLink to="/buscar" class="hover:text-white transition-colors">Productos</NuxtLink></li>
            <li><NuxtLink to="/terminos-condiciones" class="hover:text-white transition-colors">Términos y condiciones</NuxtLink></li>
            <li><NuxtLink to="/politica-privacidad" class="hover:text-white transition-colors">Política de privacidad</NuxtLink></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="text-white font-semibold mb-4">Contacto</h4>
          <ul class="space-y-2.5 text-sm">
            <li class="flex items-center gap-2">
              <Mail class="w-4 h-4 text-gray-500" />
              contacto@bytedigital.cl
            </li>
            <li class="flex items-center gap-2">
              <Phone class="w-4 h-4 text-gray-500" />
              +56 2 2345 6789
            </li>
            <li class="flex items-center gap-2">
              <MapPin class="w-4 h-4 text-gray-500" />
              Santiago, Chile
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h4 class="text-white font-semibold mb-4">Newsletter</h4>
          <p class="text-sm mb-3">Recibe ofertas exclusivas en tu correo.</p>
          <form class="flex" @submit.prevent>
            <input
              type="email"
              placeholder="tu@email.com"
              class="flex-1 bg-gray-800 border border-gray-700 rounded-l-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
            <button
              type="submit"
              class="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-r-lg text-sm font-medium transition-colors"
            >
              <Send class="w-4 h-4" />
            </button>
          </form>
          <!-- Payment methods -->
          <div class="mt-6">
            <p class="text-xs text-gray-500 mb-2">Medios de pago</p>
            <div class="flex items-center gap-2">
              <div class="bg-gray-800 rounded px-2 py-1 text-[10px] font-bold text-gray-300">VISA</div>
              <div class="bg-gray-800 rounded px-2 py-1 text-[10px] font-bold text-gray-300">MC</div>
              <div class="bg-gray-800 rounded px-2 py-1 text-[10px] font-bold text-gray-300">AMEX</div>
              <div class="bg-gray-800 rounded px-2 py-1 text-[10px] font-bold text-gray-300">WEBPAY</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-gray-500">
        &copy; {{ new Date().getFullYear() }} ByteDigital. Todos los derechos reservados.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import {
  Truck, ShieldCheck, RotateCcw, CreditCard, Zap,
  Facebook, Instagram, Twitter, Mail, Phone, MapPin, Send,
} from "lucide-vue-next";
</script>

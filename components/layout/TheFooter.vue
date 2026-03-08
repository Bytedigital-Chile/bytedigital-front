<template>
  <footer class="bg-gray-900 text-gray-300 mt-16">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-white text-lg font-bold mb-4">ByteDigital</h3>
          <p class="text-sm">Tu tienda de tecnología y computación en Chile. Los mejores precios y las mejores marcas.</p>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-3">Enlaces</h4>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/" class="hover:text-white">Inicio</NuxtLink></li>
            <li><NuxtLink to="/buscar" class="hover:text-white">Productos</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-3">Contacto</h4>
          <ul class="space-y-2 text-sm">
            <li>contacto@bytedigital.cl</li>
            <li>Santiago, Chile</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
        &copy; {{ new Date().getFullYear() }} ByteDigital. Todos los derechos reservados.
      </div>
    </div>
  </footer>
</template>

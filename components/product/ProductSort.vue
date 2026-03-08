<template>
  <select
    :value="modelValue"
    class="border rounded-lg px-3 py-2 text-sm bg-white"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <option value="newest">Más recientes</option>
    <option value="price_asc">Precio: menor a mayor</option>
    <option value="price_desc">Precio: mayor a menor</option>
    <option value="name">Nombre A-Z</option>
  </select>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string }>();
defineEmits<{ "update:modelValue": [value: string] }>();
</script>

<template>
  <div v-if="specs && Object.keys(specs).length > 0">
    <h3 class="text-lg font-semibold mb-4">Especificaciones</h3>
    <table class="w-full">
      <tbody>
        <tr
          v-for="(value, key) in specs"
          :key="key"
          class="border-b last:border-0"
        >
          <td class="py-2 text-sm font-medium text-gray-600 w-1/3 capitalize">{{ key }}</td>
          <td class="py-2 text-sm text-gray-900">{{ value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{ specs: Record<string, string> | null | undefined }>();
</script>

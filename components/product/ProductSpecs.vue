<template>
  <div v-if="rows.length > 0">
    <h3 class="text-lg font-semibold mb-4">Especificaciones</h3>
    <table class="w-full">
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.label"
          class="border-b last:border-0"
        >
          <td class="py-2 text-sm font-medium text-gray-600 w-1/3">{{ row.label }}</td>
          <td class="py-2 text-sm text-gray-900">{{ row.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { ProductAttributeValue } from "~/types";

const props = defineProps<{
  specs?: Record<string, string> | null;
  attributeValues?: ProductAttributeValue[];
}>();

const rows = computed(() => {
  const result: { label: string; value: string }[] = [];

  // Primary source: structured attribute_values
  if (props.attributeValues && props.attributeValues.length > 0) {
    const sorted = [...props.attributeValues].sort(
      (a, b) => a.attribute.position - b.attribute.position
    );
    for (const av of sorted) {
      const attr = av.attribute;
      let value = "";
      if (attr.attribute_type === "boolean") {
        value = av.value_boolean ? "Sí" : "No";
      } else if (attr.attribute_type === "select" && av.option) {
        value = av.option.value;
      } else if (attr.attribute_type === "number" && av.value_number !== null) {
        value = attr.unit ? `${av.value_number} ${attr.unit}` : String(av.value_number);
      } else if (av.value_text) {
        value = attr.unit ? `${av.value_text} ${attr.unit}` : av.value_text;
      }
      if (value) {
        result.push({ label: attr.name, value });
      }
    }
  }

  // Fallback: JSONB specs for non-migrated products
  if (result.length === 0 && props.specs) {
    for (const [key, value] of Object.entries(props.specs)) {
      if (value) {
        result.push({ label: key, value: String(value) });
      }
    }
  }

  return result;
});
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      <TransitionGroup
        enter-active-class="transition-all duration-300 ease-out"
        leave-active-class="transition-all duration-200 ease-in"
        enter-from-class="opacity-0 -translate-y-3 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-2 scale-95"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium backdrop-blur-sm"
          :class="{
            'bg-green-600/95 text-white': toast.type === 'success',
            'bg-red-500/95 text-white': toast.type === 'error',
            'bg-gray-800/95 text-white': toast.type === 'info',
          }"
        >
          <CheckCircle v-if="toast.type === 'success'" class="w-5 h-5 shrink-0" />
          <AlertCircle v-else-if="toast.type === 'error'" class="w-5 h-5 shrink-0" />
          <Info v-else class="w-5 h-5 shrink-0" />
          <span>{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { CheckCircle, AlertCircle, Info } from "lucide-vue-next";

const { toasts } = useToast();
</script>

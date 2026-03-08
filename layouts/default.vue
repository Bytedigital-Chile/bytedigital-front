<template>
  <div class="min-h-screen flex flex-col">
    <LayoutTheHeader />
    <LayoutCategoryNav />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutTheFooter />
  </div>
</template>

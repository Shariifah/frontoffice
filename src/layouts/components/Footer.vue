<template>
  <div class="h-100 d-flex align-center justify-md-space-between justify-center">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center text-medium-emphasis">
      &copy;
      {{ new Date().getFullYear() }}
      <a
        href="#"
        class="text-primary ms-1"
      >Bourgeon</a>
      - Plateforme d'Apprentissage
    </span>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4 text-primary d-none">
      <a
        href="#"
        target="noopener noreferrer"
      >À propos</a>
      <a
        href="#"
        target="noopener noreferrer"
      >Contact</a>
      <a
        href="#"
        target="noopener noreferrer"
      >Aide</a>
    </span>
  </div>
</template>

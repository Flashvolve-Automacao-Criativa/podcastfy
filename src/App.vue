<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-layout-content class="main">
      <router-view />
    </n-layout-content>
  </n-config-provider>
</template>

<script setup>
import { ref } from 'vue';

const themeOverrides = ref({
  "common": {
    "primaryColor": "#9688f2",
    "primaryColorHover": "#9688f2",
    "primaryColorPressed": "#9688f2",
  }
});
</script>

<style scoped>
@font-face {
  font-family: 'Rubik';
  src: url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap');
}

* {
  font-family: 'Rubik', sans-serif;
}

body {
  background-color: #f0f2f5;
  max-height: 100vh;
}

.main {
  max-width: 900px;
  margin: 50px auto;
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-thumb {
  background-color: #9688f2;
  border-radius: 10px;
} 

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(150, 136, 242, 0.8);
}

@media screen and (max-width: 768px) {
  .main {
    margin: 10px;
  }
}
</style>

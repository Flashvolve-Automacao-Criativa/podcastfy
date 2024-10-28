<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-layout-content class="main">
      <router-view @updateLanguage="changeLanguage" />
    </n-layout-content>
  </n-config-provider>
</template>

<script setup>
import { onMounted, provide, ref } from 'vue';

const themeOverrides = ref({
  "common": {
    "primaryColor": "#9688f2",
    "primaryColorHover": "#9688f2",
    "primaryColorPressed": "#9688f2",
  }
});

const detectedLocale = navigator.language.split('-')[0];
const locale = ref(detectedLocale);

onMounted(() => {
  locale.value = detectedLocale || 'pt';
});

provide('player', {
  locale,
});

function changeLanguage(lang) {
  locale.value = lang;
}
</script>

<style scoped>
@font-face {
  font-family: 'Rubik';
  src: url('https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap');
}

* {
  font-family: 'Rubik', sans-serif;
  overflow: hidden;
}

body {
  height: 100vh;
}

.n-config-provider {
  height: 100vh;
}

.main {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 32px auto;
  max-width: 900px;
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
</style>

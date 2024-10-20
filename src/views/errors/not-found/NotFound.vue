<template>
  <div class="not-found-container">
      <n-result
      status="404"
      :title="t('not_found.title')"
      :description="t('not_found.description')"
      >      
      <template #footer>
          <n-button type="primary" @click="goHome" class="animated-button">
              {{ t('not_found.go_home') }}
          </n-button>
      </template>
  </n-result>
</div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { NButton } from 'naive-ui';

const { t } = useI18n();
const router = useRouter();

function goHome() {
  router.push('/');
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #001c7d;
}

.n-result {
  position: fixed;
  top: calc(45% - 100px);
  left: calc(50% - 200px);
}

.illustration {
  max-width: 200px;
  margin-bottom: 20px;
}

.animated-button {
  transition: all 0.3s ease;
}

.animated-button:hover {
  transform: scale(1.05);
}

.n-result {
  padding: 20px;
  text-align: center;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
</style>
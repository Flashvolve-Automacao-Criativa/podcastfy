<template>
  <div class="not-found-container">
    <n-result
      status="404"
      title="Página não encontrada"
      description="A página que você está procurando não existe."
    >      
      <template #footer>
        <n-button type="primary" @click="goHome" class="animated-button">
          Ir para a página inicial
        </n-button>
      </template>
    </n-result>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { NButton } from 'naive-ui';

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
  background-color: #f0f2f5;
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
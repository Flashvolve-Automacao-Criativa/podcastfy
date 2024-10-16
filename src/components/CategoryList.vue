<template>
  <n-card>
    <n-list bordered>
      <n-list-item
        v-for="(category, index) in categories"
        :key="index"
        @click="selectCategory(category)"
        class="category-item"
      >
        <div class="category-name">{{ category.name }}</div>
      </n-list-item>
    </n-list>
  </n-card>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { NList, NListItem, NCard } from 'naive-ui';

// Recebe as categorias como uma propriedade
const props = defineProps({
  categories: Array,
});

// Emite um evento ao selecionar uma categoria
const emit = defineEmits(['selectCategory']);

// Emite o evento para selecionar a categoria
const selectCategory = (category) => {
  emit('selectCategory', category);
};
</script>

<style scoped>
.category-item {
  cursor: pointer;
  padding: 1rem;
}

.category-name {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>

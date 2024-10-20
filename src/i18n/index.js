import { createI18n } from 'vue-i18n';

import loadLocaleMessages from './locales';

const { en, pt } = await loadLocaleMessages();

// Defina suas mensagens de tradução aqui
const messages = {
  en: en,
  pt: pt,
};

// Crie a instância do i18n com o modo legado desativado
const i18n = createI18n({
  legacy: false, // Desative o modo legado para usar a Composition API
  locale: navigator.language.split('-')[0], // Idioma padrão
  fallbackLocale: 'pt', // Idioma de fallback
  messages, // Mensagens de tradução
});

export default i18n;
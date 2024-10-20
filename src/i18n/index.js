import { createI18n } from 'vue-i18n';
import loadLocaleMessages from './locales';

const { en, pt } = await loadLocaleMessages();
const messages = { en: en, pt: pt };

const i18n = createI18n({
    legacy: false,
    locale: navigator.language.split('-')[0],
    fallbackLocale: 'pt',
    messages,
});

export default i18n;
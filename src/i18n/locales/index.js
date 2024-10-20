export default async function loadAllLocaleMessages() {
    const modules = import.meta.glob('./*/**/*.js'); 
    
    const messages = {};
    
    for (const path in modules) {
        const [, locale, moduleName] = path.match(/\.\/([a-z]{2})\/(.*)\.js$/);
        const module = await modules[path]();
        
        if (!messages[locale]) {
            messages[locale] = {};
        }
        
        messages[locale][moduleName] = module.default;
    }
    
    return messages;
}
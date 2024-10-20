const loadAllLocalesMessages = async () => {
    const modules = import.meta.blob('./*/**/*.js');
    const messages = {};

    for (const path in modules) {
        const [, locale, moduleName] = path.match(/\.\/([a-z]{2})\/(.*)\.js$/);

        if (!messages[locale]) messages[locale] = {};

        messages[locale][moduleName] = module.default;
    }

    return messages;
}

export default loadAllLocalesMessages;
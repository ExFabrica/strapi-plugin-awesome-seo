'use strict';

module.exports = ({ strapi }) => {
    const getPluginStore = () => {
        return strapi.store({
            environment: '',
            type: 'plugin',
            name: 'cms-analyzer',
        });
    };
    const createDefaultConfig = async () => {
        const pluginStore = getPluginStore();
        const value = {
            seo: {
                enabled: false,
                frontUrl: "",
                frontEnabled: false,
                frontUrl2: "",
                frontEnabled2: false,
                frontUrl3: "",
                frontEnabled3: false,
            }, 
            medias: {
                enabled: false,
            },
            greenCms: {
                enabled: false,
            }
        };
        await pluginStore.set({ key: 'settings', value });
        return pluginStore.get({ key: 'settings' });
    };
    const createConfigFromData = async (settings) => {
        const value = settings;
        const pluginStore = getPluginStore();
        await pluginStore.set({ key: 'settings', value });
        return pluginStore.get({ key: 'settings' });
    };
    const getSettings = async () => {
        const pluginStore = getPluginStore();
        let config = await pluginStore.get({ key: 'settings' });
        if (!config) {
            config = await createDefaultConfig();
        }
        return config;
    };
    const setSettings = async (data) => {
        return createConfigFromData(data);
    };
    const resetSettings = async () => {
        return createDefaultConfig();
    };
    return {
        getSettings,
        setSettings,
        resetSettings
    }
}
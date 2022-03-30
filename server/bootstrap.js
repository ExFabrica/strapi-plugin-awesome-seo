// Define here the plugins permissions.
module.exports = async ({ strapi }) => {
    // Add permissions
    const actions = [
        {
            section: 'plugins',
            displayName: 'Exfabrica access page',
            uid: 'read',
            pluginName: 'cms-analyzer',
        },
        {
            section: 'settings',
            category: 'Exfabrica',
            displayName: 'Exfabrica Access page',
            uid: 'settings.read',
            pluginName: 'cms-analyzer',
        },
    ];

    await strapi.admin.services.permission.actionProvider.registerMany(actions);
};
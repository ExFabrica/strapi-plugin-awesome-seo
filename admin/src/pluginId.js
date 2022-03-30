const pluginPkg = require('../../package.json');

// const pluginId = pluginPkg.name.replace(/^@strapi\/plugin-/i, '');
const pluginId = pluginPkg.name.replace(/^@exfabrica\/plugin-/i, '');

module.exports = pluginId;

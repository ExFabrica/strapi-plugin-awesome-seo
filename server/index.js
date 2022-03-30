"use strict"

const services = require("./services");
const routes = require("./routes");
const controllers = require("./controllers");
const bootstrap = require("./bootstrap");
const policies = require('./policies/policies');
const contentTypes = require('./content-types');

module.exports = {
  bootstrap,
  controllers,
  routes,
  services,
  policies,
  contentTypes
};

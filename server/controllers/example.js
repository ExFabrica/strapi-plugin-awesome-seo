'use strict';

module.exports = ({ strapi }) => {
    const exampleService = strapi.plugins["cms-analyzer"].services.example;
    const findMany = async (ctx) => {
        try {
            return exampleService.findMany();
        }
        catch (err) {
            cxt.throw(500, err);
        }
    };
    return {
        findMany
    }
}
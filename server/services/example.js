'use strict';
const { isDraft } = require('@strapi/utils').contentTypes;

module.exports = ({ strapi }) => {
    const findMany = async (params, populate) => {
        return Promise.resolve({
            key:"My example key",
            value:"My example value",
            data: [
                "val1",
                "val2",
                "val3",
                "val4",
            ]
        });
    };
    return {
        findMany
    }
}
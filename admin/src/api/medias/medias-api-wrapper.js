import { request } from '@strapi/helper-plugin';

const mediaAPIWrapper = {
    run: async (url) => {
        try {
            return request(`/cms-analyzer/medias-analyzer/run?url=${url}`, {
                method: 'GET'
            });
        }
        catch (ex) {
            console.log("Error: ", ex);
        }
    },
}

export default mediaAPIWrapper;
import { request } from '@strapi/helper-plugin';

const summaryAPIWrapper = {
    getLast: async () => {
        console.log("summaryAPIWrapper : getLast")
        try {
            return request(`/cms-analyzer/summaries/last`, {
                method: 'GET'
            });
        }
        catch (ex) {
            console.log("Error: ", ex);
        }
        return null;
    },
}

export default summaryAPIWrapper;
import { request } from '@strapi/helper-plugin';

const settingsAPI = {
    get: async () => {
        const data = await request(`/cms-analyzer/settings`, {
            method: 'GET'
        });
        return data;
    },
    set: async (data) => {
        return await request(`/cms-analyzer/settings`, {
            method: 'POST',
            body: data
        });
    },
    reset: async () => {
        return await request(`/cms-analyzer/settings`, {
            method: 'delete'
        });
    }
}
export default settingsAPI;
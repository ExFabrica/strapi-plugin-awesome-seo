
'use strict';
const analyzer = require('@exfabrica/cms-engine-analyzer');

module.exports = ({ strapi }) => {
    const mediasService = () => strapi.plugins["cms-analyzer"].services.media;
    const getImagesData = async () => {
        let images_datas = {
            images_names: [],
            images: []
        };
        let medias;
        medias = await strapi.plugin('upload').service('upload').findMany();
        //console.log(entities);

        Object.values(medias).map(media => {
            if (media.mime.indexOf("image") != -1) {
                if (!images_datas.images_names[media.name]) images_datas.images_names[media.name] = [];
                images_datas.images_names[media.name].push(media.id);
                images_datas.images.push({ 'id': media.id, 'name': media.name, 'atl-text': media.alternativeText, 'caption': media.caption, 'ext': media.ext });
            }
        });
        console.log(images_datas);
        return images_datas;
    };
    const run = async (url) => {
        const rs = await analyzer.terminator([url], ['Images']);
        if (rs && rs.Images) {
            for (const result of rs.Images) {
                pushMediaInCollection(result);
            }
        }
        return {
            success: true
        }
    };
    const pushMediaInCollection = async (analyse) => {
        const dbMedias = await mediasService().findMany({
            frontUrl: { $eq: analyse.url }
        });
        for (const image of analyse.result.images) {
            if (image.src) {
                const medias = dbMedias.filter(item => item.frontUrl === analyse.result.url && item.mediaUrl === image.src)
                if (medias.length === 0) {
                    await mediasService().create({
                        frontUrl: analyse.result.url,
                        mediaUrl: image.src,
                        alt: image.alt,
                        width: image.width,
                        height: image.height,
                        data: {
                            srcset: image.srcset
                        },
                        status: "active"
                    });
                }
                else {
                    await mediasService().update({
                        frontUrl: analyse.result.url,
                        mediaUrl: image.src
                    }, {
                        frontUrl: analyse.result.url,
                        mediaUrl: image.src,
                        alt: image.alt,
                        width: image.width,
                        height: image.height,
                        status: "active"
                    })
                }
            }
        }
    };
    return {
        getImagesData,
        run
    }
};

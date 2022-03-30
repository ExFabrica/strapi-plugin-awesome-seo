'use strict';

module.exports = ({ strapi }) => {
  const mediasService = strapi.plugins["cms-analyzer"].services.mediaAnalyzer;
  const getImages = async (ctx) => {
    // console.log (strapi.plugin('upload'));
    //  console.log ("contentTypes");
    //  console.log (strapi.plugin('upload').contentTypes);
    //  console.log ("controllers");
    //  console.log (strapi.plugin('upload').controllers);
    //  console.log ("services");
    //  console.log (strapi.plugin('upload').services);
    //  console.log (strapi.plugin('cms-analyzer').services["mediaAnalyzer"].msgTest());

    return mediasService.getImagesData();
  };
  const run = async (ctx) => {
    // remove url property from context
    const { url } = ctx.query;
    delete ctx.query['url'];
    try {
      return mediasService.run(url);
    }
    catch (err) {
      ctx.throw(500, err);
    }
  };
  return {
    getImages,
    run
  };
};

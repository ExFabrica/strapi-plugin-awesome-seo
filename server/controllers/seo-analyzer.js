'use strict';

module.exports = ({ strapi }) => {
  const analyserService = strapi.plugins["cms-analyzer"].services.seoAnalyzer;
  const run = async (ctx) => {
    // remove url property from context
    const { body } = ctx.request;
    body.user = ctx.state.user;
    delete ctx.query['url'];
    try {
      analyserService.run(body);
      // ctx.res.statusCode = 202 // TODO
      return { }
    }
    catch (err) {
      ctx.throw(500, err);
    }
  };
  const runRT= async (ctx) => {
    const { body } = ctx.request;
    try {
      return analyserService.runRT(body);
    }
    catch (err) {
      ctx.throw(500, err);
    }
  };
  const analysisState= async (ctx) => {
    try {
      return analyserService.analysisState();
    }
    catch (err) {
      ctx.throw(500, err);
    }
  };
  const cancel= async (ctx) => {
    try {
      return analyserService.cancel();
    }
    catch (err) {
      ctx.throw(500, err);
    }
  };
  return {
    run,
    runRT,
    analysisState,
    cancel
  };
};

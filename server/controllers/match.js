
'use strict';

module.exports = ({ strapi }) => {
  const matchService = strapi.plugins["cms-analyzer"].services.match;
  const matchContentType = strapi.plugins['cms-analyzer'].contentTypes.match;
  const findMany = async (ctx) => {
    let entities;
    if (ctx.query._q) {
      entities = await matchService.search(ctx.query);
    } else {
      entities = await matchService.findMany(ctx.query);
    }

    ctx.send(entities);
  };
  const findOne = async (ctx) => {
    const { id } = ctx.params;
    const entity = await matchService.findOne({ id });
    ctx.send(entity);
  };
  const findByUid = async (ctx) => {
    const { slug } = ctx.params;
    const entities = await matchService.findMany({
      where: {
        apiName: { $eq: slug },
        status: { $eq: "active" }
      }
    });
    ctx.send(entities);
  };
  const count = async (ctx) => {
    if (ctx.query._q) {
      ctx.send(matchService.countSearch(ctx.query));
    }
    ctx.send(matchService.count(ctx.query));
  };
  const create = async (ctx) => {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = matchService.create(data, { files });
    } else {
      entity = matchService.create(ctx.request.body);
    }
    ctx.send(entity);
  };
  const update = async (ctx) => {
    const { id } = ctx.params;

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await matchService.update({ id }, data, {
        files,
      });
    } else {
      entity = await matchService.update({ id }, ctx.request.body);
    }

    ctx.send(entity);
  };
  const deleteOne = async (ctx) => {
    const { id } = ctx.params;
    await matchService.delete({ id });
    ctx.send({ "success": true });
  }
  const deleteAll = async (ctx) => {
    await matchService.deleteAll();
    ctx.send({ "success": true });
  }
  return {
    findMany,
    findOne,
    findByUid,
    count,
    create,
    update,
    deleteOne,
    deleteAll
  };
}

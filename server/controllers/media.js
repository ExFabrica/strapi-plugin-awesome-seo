
'use strict';

module.exports = ({ strapi }) => {
  const mediaService = strapi.plugins["cms-analyzer"].services.media;
  const mediaContentType = strapi.plugins['cms-analyzer'].contentTypes.media;
  const findMany = async (ctx) => {
    let entities;
    if (ctx.query._q) {
      entities = await mediaService.search(ctx.query);
    } else {
      entities = await mediaService.findMany(ctx.query);
    }

    ctx.send(entities);
  };
  const findOne = async (ctx) => {
    const { id } = ctx.params;
    const entity = await mediaService.findOne({ id });
    ctx.send(entity);
  };
  const count = async (ctx) => {
    if (ctx.query._q) {
      ctx.send(mediaService.countSearch(ctx.query));
    }
    ctx.send(mediaService.count(ctx.query));
  };
  const create = async (ctx) => {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = mediaService.create(data, { files });
    } else {
      entity = mediaService.create(ctx.request.body);
    }
    ctx.send(entity);
  };
  const update = async (ctx) => {
    const { id } = ctx.params;

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await mediaService.update({ id }, data, {
        files,
      });
    } else {
      entity = await mediaService.update({ id }, ctx.request.body);
    }

    ctx.send(entity);
  };
  const deleteOne = async (ctx) => {
    const { id } = ctx.params;
    await mediaService.delete({ id });
    ctx.send({ "success": true });
  }
  const deleteAll = async (ctx) => {
    await mediaService.deleteAll();
    ctx.send({ "success": true });
  }
  return {
    findMany,
    findOne,
    count,
    create,
    update,
    deleteOne,
    deleteAll
  };
}

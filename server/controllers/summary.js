
'use strict';

module.exports = ({ strapi }) => {
  const summaryService = strapi.plugins["cms-analyzer"].services.summary;
  const summaryContentType = strapi.plugins['cms-analyzer'].contentTypes.summary;
  const findMany = async (ctx) => {
    let entities;
    if (ctx.query._q) {
      entities = await summaryService.search(ctx.query);
    } else {
      entities = await summaryService.findMany(ctx.query);
    }

    ctx.send(entities);
  };
  const findOne = async (ctx) => {
    const { id } = ctx.params;
    const entity = await summaryService.findOne({
      where: {
        id: id
      }
    });
    ctx.send(entity);
  };
  const getLast = async (ctx) => {
    const entities = await summaryService.findMany({
      orderBy: {updatedAt:'desc'},
    });
    if(entities.length>0){
      ctx.send(entities[0])
    }
    else{
      ctx.send()
    }
  };
  const count = async (ctx) => {
    if (ctx.query._q) {
      ctx.send(summaryService.countSearch(ctx.query));
    }
    ctx.send(summaryService.count(ctx.query));
  };
  const create = async (ctx) => {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = summaryService.create(data, { files });
    } else {
      entity = summaryService.create(ctx.request.body);
    }
    ctx.send(entity);
  };
  const update = async (ctx) => {
    const { id } = ctx.params;

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await summaryService.update({ id }, data, {
        files,
      });
    } else {
      entity = await summaryService.update({ id }, ctx.request.body);
    }

    ctx.send(entity);
  };
  const deleteOne = async (ctx) => {
    const { id } = ctx.params;
    await summaryService.delete({ id });
    ctx.send({ "success": true });
  }
  const deleteAll = async (ctx) => {
    await summaryService.deleteAll();
    ctx.send({ "success": true });
  }
  return {
    findMany,
    findOne,
    getLast,
    count,
    create,
    update,
    deleteOne,
    deleteAll
  };
}

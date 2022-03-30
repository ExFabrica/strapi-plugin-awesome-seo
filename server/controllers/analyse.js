
'use strict';
const { parseMultipartData } = require('@strapi/utils');

module.exports = ({ strapi }) => {
  const analyseService = strapi.plugins["cms-analyzer"].services.analyse;
  const analyseContentType = strapi.plugins['cms-analyzer'].contentTypes.analyse;
  const findMany = async (ctx) => {
    let entities;
    if (ctx.query._q) {
      entities = await analyseService.search(ctx.query);
    } else {
      entities = await analyseService.findMany(ctx.query);
    }

    ctx.send(entities);
  };
  const findOne = async (ctx) => {
    const { id } = ctx.params;

    const entity = await analyseService.findOne({
      where: {
        id: id
      }
    });
    ctx.send(entity);
  };
  const findByApiNameAndDocumentId = async (ctx) => {
    const { apiName, documentId } = ctx.params;
    const entity = await analyseService.findOne({
      where: {
        apiName: apiName,
        documentId: documentId
      }
    });
    ctx.send(entity);
  };
  const findManyWithDefaultSorting = async (ctx) => {
    const entities = await analyseService.findMany({
      orderBy: ['depth', 'frontUrl'],
    });
    ctx.send(entities);
  };
  const count = async (ctx) => {
    if (ctx.query._q) {
      ctx.send(analyseService.countSearch(ctx.query));
    }
    ctx.send(analyseService.count(ctx.query));
  };
  const create = async (ctx) => {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = analyseService.create(data, { files });
    } else {
      entity = analyseService.create(ctx.request.body);
    }
    ctx.send(entity);
  };
  const update = async (ctx) => {
    const { id } = ctx.params;
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await analyseService.update({
        where: {
          id: id
        }
      }, data, {
        files,
      });
    } else {
      entity = await analyseService.update({
        where: {
          id: id
        }
      }, ctx.request.body);
    }
    ctx.send(entity);
  };
  const deleteOne = async (ctx) => {
    const { id } = ctx.params;
    await analyseService.delete({
      where: {
        id: id
      }
    });
    ctx.send({ "success": true });
  };
  const deleteAll = async (ctx) => {
    await analyseService.deleteAll();
    ctx.send({ "success": true });
  };
  return {
    findMany,
    findOne,
    findByApiNameAndDocumentId,
    findManyWithDefaultSorting,
    count,
    create,
    update,
    deleteOne,
    deleteAll,
  };
}
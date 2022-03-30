module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/medias',
      handler: 'media.findMany',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/medias/:slug',
      handler: 'media.findOne',
      config: { policies: [] }
    },
    {
      method: 'POST',
      path: '/medias',
      handler: 'media.create',
      config: { policies: [] }
    },
    {
      method: 'PUT',
      path: '/medias/:id',
      handler: 'media.update',
      config: { policies: [] }
    },
    {
      method: 'DELETE',
      path: '/medias/:id',
      handler: 'media.deleteOne',
      config: { policies: [] }
    },
    {
      method: 'DELETE',
      path: '/media',
      handler: 'match.deleteAll',
      config: { policies: [] }
    }
  ]
}
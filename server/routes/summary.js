module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/summaries',
      handler: 'summary.findMany',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/summaries/find/:id',
      handler: 'summary.findOne',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/summaries/last',
      handler: 'summary.getLast',
      config: { policies: [] }
    },
    {
      method: 'POST',
      path: '/summaries',
      handler: 'summary.create',
      config: { policies: [] }
    },
    {
      method: 'PUT',
      path: '/summaries/:id',
      handler: 'summary.update',
      config: { policies: [] }
    },
    {
      method: 'DELETE',
      path: '/summaries/:id',
      handler: 'summary.deleteOne',
      config: { policies: [] }
    },
    {
      method: 'DELETE',
      path: '/summary',
      handler: 'summary.deleteAll',
      config: { policies: [] }
    }
  ]
}
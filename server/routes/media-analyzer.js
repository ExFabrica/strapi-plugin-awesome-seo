module.exports = {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/medias-analyzer',
      handler: 'media-analyzer.getImages',
      config: { policies: [] }
    },
    {
      method: 'GET',
      path: '/medias-analyzer/run',
      handler: 'media-analyzer.run',
      config: { policies: [] }
    }
  ]
}
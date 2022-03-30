module.exports = {
  // accessible from external endpoint (/api/cms-analyzer/***)
    type: 'content-api',
    routes: [
        {
            method: 'GET',
            path: '/example',
            handler: 'example.findMany',
            config: { policies: [] }
          }
    ]
}

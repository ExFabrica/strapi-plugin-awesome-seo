module.exports = {
    // accessible only from admin UI
    type: 'admin',
    routes: [
      {
        method: 'POST',
        path: '/seo-analyzer/run',
        handler: 'seo-analyzer.run',
        config: { policies: [] }
      },
      {
        method: 'POST',
        path: '/seo-analyzer/runRT',
        handler: 'seo-analyzer.runRT',
        config: { policies: [] }
      },
      {
        method: 'GET',
        path: '/seo-analyzer/analysisState',
        handler: 'seo-analyzer.analysisState',
        config: { policies: [] }
      },
      {
        method: 'POST',
        path: '/seo-analyzer/cancel',
        handler: 'seo-analyzer.cancel',
        config: { policies: [] }
      }
    ]
  }
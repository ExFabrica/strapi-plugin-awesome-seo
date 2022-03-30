module.exports = {
    // accessible only from admin UI
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/settings',
        handler: 'setting.getSettings',
        config: { policies: [] }
      },
      {
        method: 'POST',
        path: '/settings',
        handler: 'setting.setSettings',
        config: { policies: [] }
      },
      {
        method: 'DELETE',
        path: '/settings',
        handler: 'setting.resetSettings',
        config: { policies: [] }
      },
    ]
  }
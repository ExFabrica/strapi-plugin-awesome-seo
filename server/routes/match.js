module.exports = {
    // accessible from admin
    type: 'admin',
    routes: [
        {
            method: 'GET',
            path: '/matches',
            handler: 'match.findMany',
            config: { policies: [] }
        },
        {
            method: 'GET',
            path: '/matches/:slug',
            handler: 'match.findOne',
            config: { policies: [] }
        },
        {
            method: 'GET',
            path: '/matches/uid/:slug',
            handler: 'match.findByUid',
            config: { policies: [] }
        },
        {
            method: 'POST',
            path: '/matches',
            handler: 'match.create',
            config: { policies: [] }
        },
        {
            method: 'PUT',
            path: '/matches/:id',
            handler: 'match.update',
            config: { policies: [] }
        },
        {
            method: 'DELETE',
            path: '/matches/:id',
            handler: 'match.deleteOne',
            config: { policies: [] }
        },
        {
            method: 'DELETE',
            path: '/matches',
            handler: 'match.deleteAll',
            config: { policies: [] }
        }
    ]
}
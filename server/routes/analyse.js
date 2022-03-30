module.exports = {
    // accessible from admin
    type: 'admin',
    routes: [
        {
            method: 'GET',
            path: '/analyses',
            handler: 'analyse.findMany',
            config: { policies: [] }
        },
        {
            method: 'GET',
            path: '/analyses/:id',
            handler: 'analyse.findOne',
            config: { policies: [] }
        },
        {
            method: 'GET',
            path: '/analyses/api/:apiName/documents/:documentId',
            handler: 'analyse.findByApiNameAndDocumentId',
            config: { policies: [] }
        },
        {
            method: 'GET',
            path: '/analyses/sorted/rank',
            handler: 'analyse.findManyWithDefaultSorting',
            config: { policies: [] }
        },
        {
            method: 'POST',
            path: '/analyses',
            handler: 'analyse.create',
            config: { policies: [] }
        },
        {
            method: 'PUT',
            path: '/analyses/:id',
            handler: 'analyse.update',
            config: { policies: [] }
        },
        {
            method: 'DELETE',
            path: '/analyses/:id',
            handler: 'analyse.deleteOne',
            config: { policies: [] }
        },
        {
            method: 'DELETE',
            path: '/analyses',
            handler: 'analyse.deleteAll',
            config: { policies: [] }
        }
    ]
}
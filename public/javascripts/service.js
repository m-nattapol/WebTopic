app.factory('AuthService', ($resource) =>
    $resource('/auth', {}, {
        login: {
            url: '/auth/login',
            method: 'POST'
        },
        logout: {
            url: '/auth/logout',
            method: 'POST'
        }
    })
)
.factory('UserService', ($resource) =>
    $resource('/user', {}, {
        register: { method: 'POST' }
    })
)
.factory('TopicService', ($resource) =>
    $resource('/topic/api/:topicId', {}, {
        getContent: { method: 'GET' },
        addTopic: { method: 'POST' },
        editTopic: { method: 'PUT' },
        delTopic: { method: 'DELETE' }
    })
)
.factory('TopicsService', ($resource) =>
    $resource('/topics', {}, {
        getTopics: { method: 'POST' }
    })
)

app.factory('AuthService', ($resource) =>
    $resource('/auth', {}, {
        getUser: { method: 'GET' },
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
    $resource('/user/:userId', {}, {
        register: { method: 'POST' },
        editProfile: { method: 'PUT' },
        editPassword: {
            method: 'PUT',
            url: 'user/changepass/:userId'
        }
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
.factory('CommentService', ($resource) =>
    $resource('/comment/api/:topicId/:page/:skip/:back', {}, {
        loadComment: { method: 'GET' },
        addComment: { method: 'POST' },
        editComment: { method: 'PUT' }
    })
)
.factory('TopicsService', ($resource) =>
    $resource('/topics', {}, {
        getTopics: { method: 'POST' }
    })
)

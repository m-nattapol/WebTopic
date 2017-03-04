app.controller('authCtrl', ($rootScope, $scope, AuthService, $state) => {

        let userSession = JSON.parse(sessionStorage.getItem('user'))
        if (typeof userSession == 'object') {
            $rootScope.userAuth = userSession
        } else {
            sessionStorage.removeItem('user')
        }

        // login fn
        $scope.login = () => {
            AuthService.login($scope.auth, (res) => {
                if (!res.err) {
                    $rootScope.userAuth = res.user
                    sessionStorage.setItem('user', JSON.stringify(res.user))
                }
            })
        }

        // logout fn
        $scope.logout = () => {
            AuthService.logout((res) => {
                if (!res.user) {
                    $rootScope.userAuth = null
                    sessionStorage.removeItem('user')
                    $state.go('index.home')
                }
            })
        }

        // removeErr fn for authCtrl
        $scope.removeErr = () => {
            $scope.error = null
        }

    })

    // controller for index.home state
    .controller('jumbotronView', ($rootScope, $scope, UserService) => {
        // register new user
        $rootScope.resigter = () => {
            UserService.register($scope.user, (res) => {
                if (res.err) {
                    $rootScope.reportErr(res.err)
                } else {
                    $rootScope.userAuth = res.user
                    sessionStorage.setItem('user', JSON.stringify(res.user))
                }
            })
        }
    })
    .controller('contentView', ($rootScope, $scope, getTopics, TopicsService) => {
        $scope.title = "Recently Topics"
        $scope.topics = []
        $scope.loadMore = true
        $scope.page     = 0

        if (getTopics.err) {
            $rootScope.reportErr(getTopics.err)
        } else {
            $scope.topics = getTopics.topics
            $rootScope.removeLoadMore($scope.topics.length)
        }

        $scope.loadMore = () => {
            TopicsService.getTopics({ myTopics: false, page: ++$scope.page }, (res) => {
                if (res.err) {
                    console.log(res.err);
                } else {
                    res.topics.forEach((row) => { $scope.topics.push(row) })
                    $rootScope.removeLoadMore(res.topics.length)
                }
            })
        }
    })



    // topic controller
    .controller('topicCtrl', ($scope, $rootScope, topicContent, TopicService, $state) => {

        $scope.editTopic = false
        $scope.contetInit = {
            _id: topicContent.topic['_id'],
            title: topicContent.topic.title,
            detail: topicContent.topic.detail,
            date: topicContent.topic.date,
            author: topicContent.topic.author
        }

        // revert content
        $scope.revertContent = () => {
            $scope.topic = $scope.contetInit
        }

        // init topic content
        if (topicContent.err) {
            $rootScope.reportErr(topicContent.err)
        } else {
            $scope.topic = topicContent.topic
        }

        // toggle topic's form edit
        $scope.toggle = () => {
            $scope.editTopic = !$scope.editTopic
        }

        // function topic edit
        $scope.edit = () => {
            TopicService.editTopic({
                    topicId: $scope.topic['_id']
                }, {
                    title: $scope.topic.title,
                    detail: $scope.topic.detail
                }, (res) => {
                    if (res.err) {
                        $rootScope.reportErr(res.err);
                    } else {
                        $scope.toggle()
                    }
                })
        }

        // function topic delete
        $scope.delete = () => {
            TopicService.delTopic({ topicId: $scope.topic['_id'] }, (res) => {
                if (res.err) {
                    $rootScope.errAlert(res.err)
                } else {
                    $state.go('myTopic')
                }
            })
        }

    })


    // myTopic controller
    .controller('myTopic', ($rootScope, $scope, getTopics, TopicsService) => {
        $scope.title    = 'My Topics'
        $scope.topics   = []
        $scope.loadMore = true
        $scope.page     = 0

        if (getTopics.err) {
            $rootScope.reportErr(getTopics.err)
        } else {
            $scope.topics = getTopics.topics
            $rootScope.removeLoadMore($scope.topics.length)
        }

        $scope.loadMore = () => {
            TopicsService.getTopics({ myTopics: true, page: ++$scope.page }, (res) => {
                if (res.err) {
                    console.log(res.err);
                } else {
                    res.topics.forEach((row) => { $scope.topics.push(row) })
                    $rootScope.removeLoadMore(res.topics.length)
                }
            })
        }
    })

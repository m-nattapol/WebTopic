app.controller('authCtrl', ($rootScope, $scope, AuthService, $state) => {

        let userSession = JSON.parse(localStorage.getItem('user'))
        if (typeof userSession == 'object') {
            AuthService.getUser((res) => {
                if (res.err) {
                    localStorage.removeItem('user')
                } else {
                    $rootScope.userAuth = userSession
                }
            })
        } else {
            localStorage.removeItem('user')
        }

        // login fn
        $scope.login = () => {
            AuthService.login($scope.auth, (res) => {
                if (!res.err) {
                    $rootScope.userAuth = res.user
                    localStorage.setItem('user', JSON.stringify(res.user))
                }
            })
        }

        // logout fn
        $scope.logout = () => {
            AuthService.logout((res) => {
                if (!res.user) {
                    $rootScope.userAuth = null
                    localStorage.removeItem('user')
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
                    localStorage.setItem('user', JSON.stringify(res.user))
                }
            })
        }
    })
    .controller('contentView', ($rootScope, $scope, getTopics, TopicsService) => {
        $scope.title    = "Recently Topics"
        $scope.topics   = []
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
                    $rootScope.reportErr(res.err)
                } else {
                    res.topics.forEach((row) => { $scope.topics.push(row) })
                    $rootScope.removeLoadMore(res.topics.length)
                }
            })
        }
    })



    // topic controller
    .controller('topicCtrl', ($scope, $rootScope, topicContent, TopicService, CommentService, $state) => {

        $scope.editTopic    = false
        $scope.comments     = []
        $scope.page         = 0
        $scope.skip         = 0
        $rootScope.back     = 0

        // use when cancel edit topic content
        $scope.contentInit   = {
            _id: topicContent.topic._id,
            title: topicContent.topic.title,
            detail: topicContent.topic.detail,
            date: topicContent.topic.date,
            author: topicContent.topic.author
        }

        // revert content
        $scope.revertContent = () => {
            $scope.topic = $scope.contentInit
        }

        // init $scope.topic
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
                    topicId: $scope.topic._id
                }, {
                    title: $scope.topic.title,
                    detail: $scope.topic.detail
                }, (res) => {
                    if (res.err) {
                        $rootScope.reportErr(res.err, 'errAlert2');
                    } else {
                        $scope.toggle()
                    }
                })
        }

        // function topic delete
        $scope.delete = () => {
            TopicService.delTopic({ topicId: $scope.topic._id }, (res) => {
                if (res.err) {
                    $rootScope.errAlert(res.err)
                } else {
                    $state.go('myTopic')
                }
            })
        }

        // add comment function
        $scope.addComment = () => {
            CommentService.addComment({
                topicId: $scope.topic._id
            }, {
                newComment: $scope.newComment
            }, (res) => {
                if (res.err) {
                    $rootScope.reportErr(res.err)
                } else {
                    $scope.comments.unshift(res.comment.shift())
                    $scope.newComment = null
                    $scope.skip++
                }
            })
        }

        // load comment function
        $scope.loadComment = () => {
            CommentService.loadComment({
                topicId: $scope.topic._id,
                page: $scope.page,
                skip: $scope.skip,
                back: $rootScope.back
            }, (res) => {
                if (res.err) {
                    $rootScope.reportErr(res.err)
                } else {
                    res.comments.forEach((row) => $scope.comments.push(row))
                    $rootScope.removeLoadMore(res.comments.length)
                    $scope.newComment = null
                    $scope.page++
                }
            })
        }
        $scope.loadComment()


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
                    $rootScope.reportErr(res.err)
                } else {
                    res.topics.forEach((row) => { $scope.topics.push(row) })
                    $rootScope.removeLoadMore(res.topics.length)
                }
            })
        }
    })



    // comment field controller
    .controller('commentFieldCtrl', ($rootScope, $scope, CommentService, $http) => {
        $scope.userAuth = $rootScope.userAuth
        let initContent = $scope.comment.detail

        // toggle edit comment form
        // $scope.toggle = () => { $scope.editActive = !$scope.editActive }
        $scope.toggle = () => {
            $scope.editActive = !$scope.editActive
        }

        // reset comment content
        $scope.reset = () => { $scope.comment.detail = initContent }

        // edit comment function
        $scope.editComment = () => {
            CommentService.editComment({
                topicId: $scope.$parent.topic._id
            }, {
                id: $scope.comment._id,
                commentEdit: $scope.comment.detail
            }, (res) => {
                if (res.err) {
                    $rootScope.reportErr(res.err)
                } else {
                    $scope.toggle()
                }
            })
        }

        // delete comment function
        $scope.delComment = (key) => {
            $http({
                url: `comment/api/${$scope.$parent.topic._id}`,
                method: 'DELETE',
                data: {
                    id: $scope.comment._id
                },
                headers: { 'Content-Type': 'application/json' }
            }).then((res) => {
                if (res.data.err) {
                    $rootScope.reportErr(res.data.err)
                } else {
                    $scope.$parent.comments.splice(key, 1)
                    $rootScope.back++
                }
            })
        }

    })



    // profile controller
    .controller('profileCtrl', ($rootScope, $scope, UserService) => {

        $scope.user = $rootScope.userAuth

        // edit profile
        $scope.editProfile = () => {
            UserService.editProfile({
                userId: $rootScope.userAuth.id
            }, {
                name: $scope.user.name,
                lastname: $scope.user.lastname,
                email: $scope.user.email,
                tel: $scope.user.tel
            }, (res) => {
                if (res.err) {
                    $rootScope.reportErr(res.err, 'errAlertProfile')
                } else {
                    $(`#successAlertProfile`).html(`
                        <div class="alert alert-success alert-dismissible" role="alert">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <strong>Success !</strong> You have changed your profile already.
                        </div>
                    `)
                }
            })
        }

        $scope.editPassword = () => {
            if ($scope.newPass == $scope.cNewPass) {
                UserService.editPassword({
                    userId: $rootScope.userAuth.id
                }, {
                    newPass: $scope.newPass
                }, (res) => {
                    if (res.err) {
                        $rootScope.reportErr(res.err, 'errAlertPassword')
                    } else {
                        $(`#successAlertPassword`).html(`
                            <div class="alert alert-success alert-dismissible" role="alert">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                                <strong>Success !</strong> You have changed your password already.
                            </div>
                        `)
                    }
                })
            } else {
                $rootScope.reportErr({
                    name: 'Fail !',
                    message: "Your new password was't match."
                }, 'errAlertPassword')
            }
        }
    })

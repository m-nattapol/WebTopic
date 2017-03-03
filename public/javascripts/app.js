angular.module('app', ['ui.router', 'ngResource'])

    // config stateProvider, urlRouterProvider, locationProvider
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', ($stateProvider, $urlRouterProvider, $locationProvider) => {

        $locationProvider.html5Mode(true)

        $urlRouterProvider.otherwise('/')

        $stateProvider
            .state('index', {
                abstract: true,
                template: `<div ui-view="jumbotronView"></div><div ui-view="contentView"></div>`
            })
            .state('index.home', {
                url: '/',
                views: {
                    jumbotronView: {
                        controller: ($rootScope, $scope, UserService) => {
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
                        },
                        templateUrl: 'partials/jumbotron/home.html'
                    },
                    contentView: {
                        resolve: {
                            getTopics: (TopicsService) => {
                                return TopicsService.getTopics().$promise
                            }
                        },
                        controller: ($rootScope, $scope, getTopics, TopicsService) => {
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
                        },
                        templateUrl: 'partials/topics.html'
                    }
                }
            })
            .state('register', {
                url: '/register',
                templateUrl: 'partials/jumbotron/home.html'
            })
            .state('topic', {
                url: '/topic/add',
                controller: ($rootScope, $scope, TopicService, $state) => {
                    // add new topic
                    $scope.addTopic = () => {
                        TopicService.addTopic($scope.topic, (res) => {
                            if (res.err) {
                                $rootScope.reportErr(res.err)
                            } else {
                                $state.go('myTopic')
                            }
                        })
                    }
                },
                templateUrl: 'partials/topic.frm.html'
            })
            .state('myTopic', {
                url: '/mytopics',
                resolve: {
                    getTopics: (TopicsService) => {
                        return TopicsService.getTopics({ myTopics: true }).$promise
                    }
                },
                controller: ($rootScope, $scope, getTopics, TopicsService) => {
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
                },
                templateUrl: 'partials/topics.html'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'profile.html'
            })

    }])



    // setup rootScope function
    .run(['$rootScope', '$location', 'AuthService', ($rootScope, $location, AuthService, $scope) => {

        // return boolean result of path param and location.path()
        $rootScope.checkPath = (path) => $location.path() == path

        // clear error report
        // $rootScope.clearErr = () => { $rootScope.error = null }

        // remove loadMore button
        $rootScope.removeLoadMore = (length) => {
            if (length < 5) { $('.load-more').remove() }
        }

        // report error
        $rootScope.reportErr = (error) => {
            if ($('#errAlert').empty()) {

                // when add topic and title was duplicated
                if (error.code == 11000) {
                    error = {
                        name: 'Duplicated !',
                        message: "Topic's title was duplicated."
                    }
                }

                // error alert template
                $('#errAlert').append(`
                    <div class="alert alert-danger alert-dismissible" role="alert">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <strong>${error.name}</strong> ${error.message}
                    </div>
                `)
            }

        }

        // init userAuth
        $rootScope.userAuth = null

    }])



    // setup Service
    .factory('AuthService', ($resource) => {
        return $resource('/auth', {}, {
            login: {
                url: '/auth/login',
                method: 'POST'
            },
            logout: {
                url: '/auth/logout',
                method: 'POST'
            }
        })
    })
    .factory('UserService', ($resource) => {
        return $resource('/user', {}, {
            register: { method: 'POST' }
        })
    })
    .factory('TopicService', ($resource) => {
        return $resource('/topic', {}, {
            addTopic: { method: 'POST' }
        })
    })
    .factory('TopicsService', ($resource) => {
        return $resource('/topics', {}, {
            getTopics: { method: 'POST' }
        })
    })



    // setup directive
    // .directive('errorAlert', ($compile, $rootScope) => {
    //     return {
    //         restrict: 'E',
    //         link: (scope, elm) => {
    //             $rootScope.$watch('error', () => {
    //                 if ($rootScope.error) {
    //                     let tmp = `
    //                         <div class="alert alert-danger alert-dismissible" role="alert" ng-show="error">
    //                             <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    //                                 <span aria-hidden="true" ng-click="clearErr()">&times;</span>
    //                             </button>
    //                             <strong>{{error.name}}</strong> {{error.message}}
    //                         </div>
    //                     `
    //                     elm.html(tmp)
    //                     $compile(elm.contents())(scope)
    //                 }
    //             })
    //         }
    //     }
    // })



    // authentication controller
    .controller('authCtrl', ($rootScope, $scope, AuthService, $state) => {

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

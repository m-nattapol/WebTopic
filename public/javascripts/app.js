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
                                UserService.resigter($scope.user, (res) => {
                                    if (res.err) {
                                        $rootScope.error = res.err
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
                        controller: ($scope) => {
                            $scope.title = "Recently Topics";
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
                templateUrl: 'partials/topic.frm.html'
            })
            .state('myTopic', {
                url: '/mytopics',
                controller: ($scope) => {
                    $scope.title = 'My Topics'
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
        $rootScope.clearErr = () => { $rootScope.error = null }

        $rootScope.userAuth = null

    }])



    // setup Service
    .factory('AuthService', ($resource) => {
        return $resource('/auth', {}, {
            login: {
                url: '/auth/login',
                method: 'POST'
            }
        })
    })
    .factory('UserService', ($resource) => {
        return $resource('/user', {}, {
            addNew: { method: 'POST' }
        })
    })



    // setup directive
    .directive('errorAlert', ($compile, $rootScope) => {
        return {
            restrict: 'E',
            link: (scope, elm) => {
                $rootScope.$watch('error', () => {
                    if ($rootScope.error) {
                        let tmp = `
                            <div class="alert alert-danger alert-dismissible" role="alert" ng-show="error">
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true" ng-click="clearErr()">&times;</span>
                                </button>
                                <strong>{{error.name}}</strong> {{error.message}}
                            </div>
                        `
                        elm.html(tmp)
                        $compile(elm.contents())(scope)
                    }
                })
            }
        }
    })



    // authentication controller
    .controller('authCtrl', ($rootScope, $scope, AuthService) => {

        let userSession = sessionStorage.getItem('user')
        if (userSession) { $rootScope.userAuth = JSON.parse(userSession) }

        $scope.login = () => {
            AuthService.login($scope.auth, (res) => {
                if (res.err) {
                    $scope.error = res.err
                } else {
                    $rootScope.userAuth = res.user
                    sessionStorage.setItem('user', JSON.stringify(res.user))
                }
            })
        }
    })

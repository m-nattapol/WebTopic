let app = angular.module('app', ['ui.router', 'ngResource'])

    // config stateProvider, urlRouterProvider, locationProvider
    app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', ($stateProvider, $urlRouterProvider, $locationProvider) => {

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
                        controller: 'jumbotronView',
                        templateUrl: 'partials/jumbotron/home.html'
                    },
                    contentView: {
                        resolve: {
                            getTopics: (TopicsService) => {
                                return TopicsService.getTopics().$promise
                            }
                        },
                        controller: 'contentView',
                        templateUrl: 'partials/topics.html'
                    }
                }
            })
            .state('register', {
                url: '/register',
                controller: 'jumbotronView',
                templateUrl: 'partials/jumbotron/home.html'
            })
            // .state('addTopic', {
            //     url: '/topic/add',
            //     controller: 'topicCtrl',
            //     templateUrl: 'partials/topic.frm.html'
            // })
            // .state('topic', {
            //     url: '/topic/:id',
            //     resolve: {
            //         topicContent: ($stateParams, TopicService) =>
            //             TopicService.getContent({ topicId: $stateParams.id }).$promise
            //     },
            //     controller: 'topicCtrl',
            //     templateUrl: 'partials/topic.html',
            // })
            .state('topic', {
                url: '/topic',
                template: '<div ui-view></div>'
            })
            .state('topic.add', {
                url: '/add',
                controller: ($scope, $rootScope, TopicService) => {
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
                templateUrl: 'partials/topic.frm.html',
            })
            .state('topic.content', {
                url: '/:id',
                resolve: {
                    topicContent: ($stateParams, TopicService) => TopicService.getContent({ topicId: $stateParams.id }).$promise
                },
                controller: 'topicCtrl',
                templateUrl: 'partials/topic.html',
            })
            .state('myTopic', {
                url: '/mytopics',
                resolve: {
                    getTopics: (TopicsService) => TopicsService.getTopics({ myTopics: true }).$promise
                },
                controller: 'myTopic',
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
            console.log('in reportErr');
            if ($('#errAlert').empty()) {
                console.log('is empty');

                // when add topic and title was duplicated
                if (error.code == 11000) {
                    error = {
                        name: 'Duplicated !',
                        message: "Topic's title was duplicated."
                    }
                }

                $('.btn-default').css('coloe', 'red')
alert('ok')
                console.log(error);
                // error alert template
                $('#errAlert').html(`
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

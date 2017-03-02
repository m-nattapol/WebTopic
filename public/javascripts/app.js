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
    .run(['$rootScope', '$location', ($rootScope, $location) => {

        // return boolean result of path param and location.path()
        $rootScope.checkPath = (path) => $location.path() == path

    }])

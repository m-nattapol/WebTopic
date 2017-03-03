"use strict";angular.module("app",["ui.router","ngResource"]).config(["$stateProvider","$urlRouterProvider","$locationProvider",function($stateProvider,$urlRouterProvider,$locationProvider){$locationProvider.html5Mode(!0),$urlRouterProvider.otherwise("/"),$stateProvider.state("index",{abstract:!0,template:'<div ui-view="jumbotronView"></div><div ui-view="contentView"></div>'}).state("index.home",{url:"/",views:{jumbotronView:{controller:function($rootScope,$scope,UserService){$rootScope.resigter=function(){UserService.register($scope.user,function(res){res.err?$rootScope.error=res.err:($rootScope.userAuth=res.user,sessionStorage.setItem("user",JSON.stringify(res.user)))})}},templateUrl:"partials/jumbotron/home.html"},contentView:{controller:function($scope){$scope.title="Recently Topics"},templateUrl:"partials/topics.html"}}}).state("register",{url:"/register",templateUrl:"partials/jumbotron/home.html"}).state("topic",{url:"/topic/add",templateUrl:"partials/topic.frm.html"}).state("myTopic",{url:"/mytopics",controller:function($scope){$scope.title="My Topics"},templateUrl:"partials/topics.html"}).state("profile",{url:"/profile",templateUrl:"profile.html"})}]).run(["$rootScope","$location","AuthService",function($rootScope,$location,AuthService,$scope){$rootScope.checkPath=function(path){return $location.path()==path},$rootScope.clearErr=function(){$rootScope.error=null},$rootScope.userAuth=null}]).factory("AuthService",function($resource){return $resource("/auth",{},{login:{url:"/auth/login",method:"POST"}})}).factory("UserService",function($resource){return $resource("/user",{},{register:{method:"POST"}})}).directive("errorAlert",function($compile,$rootScope){return{restrict:"E",link:function(scope,elm){$rootScope.$watch("error",function(){if($rootScope.error){var tmp='\n                            <div class="alert alert-danger alert-dismissible" role="alert" ng-show="error">\n                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">\n                                    <span aria-hidden="true" ng-click="clearErr()">&times;</span>\n                                </button>\n                                <strong>{{error.name}}</strong> {{error.message}}\n                            </div>\n                        ';elm.html(tmp),$compile(elm.contents())(scope)}})}}}).controller("authCtrl",function($rootScope,$scope,AuthService){var userSession=sessionStorage.getItem("user");userSession&&($rootScope.userAuth=JSON.parse(userSession)),$scope.login=function(){AuthService.login($scope.auth,function(res){res.err?$scope.error=res.err:($rootScope.userAuth=res.user,sessionStorage.setItem("user",JSON.stringify))})}});
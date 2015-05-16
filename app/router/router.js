var router=angular.module("Router",["ui.router","ui.bootstrap","ngTable","GeneralConfig","ModuleHeader","FormApp","HarborApp"]);

router.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){

	$urlRouterProvider.otherwise("/header/form");

	$stateProvider.state('header',{
		url:'/header',
		templateUrl:'app/moduleHeader/templates/headerTmpl.html',
		controller:'HeaderCtrl',
		abstract: true,
	}).state('header.form',{
		url:'/form',
		templateUrl:'app/moduleForm/templates/formTmpl.html',
		controller:'FormCtrl'
	}).state('header.form.harbor',{
		url:'/harbor',
		templateUrl:'app/moduleHarbor/templates/harborTmpl.html',
		controller:'HarborCtrl'
	});
}]);
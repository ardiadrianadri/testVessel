var router=angular.module("Router",["ui.router","ui.bootstrap","ngTable","GeneralConfig","ModuleHeader","FormApp","HarborApp","MessageApp","ResultApp"]);

router.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){

	$urlRouterProvider.otherwise("/header/form/result");

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
		onEnter:['$stateParams','$state','$modal','HarborService',function($stateParams,$state,$modal,HarborService){
			$modal.open({
				templateUrl:'app/moduleHarbor/templates/harborTmpl.html',
				controller:'HarborCtrl',
				size:'lg'
			}).result.then(function(result){
				$state.go(result)
			},function(error){
				$state.go("header.form.message",{code:error});
			});
		}]
	}).state('header.form.message',{
		url:'/msg/:code',
		onEnter:['$stateParams','$state','$modal',function($stateParams,$state,$modal){
			$modal.open({
				templateUrl:"app/moduleUtils/templates/messageTmpl.html",
				controller:"MessageCtrl"
			}).result.then(function(result){
				$state.go(result);
			},function(error){
				$state.go("header.form.message",{code:error});
			});
		}]
	}).state('header.form.result',{
		url:'/result',
		templateUrl:'app/moduleResults/templates/resultsTmp.html',
		controller:'ResultCtrl'
	});
}]);
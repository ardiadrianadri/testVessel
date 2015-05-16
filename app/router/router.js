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
		onEnter:['$stateParams','$state','$modal','HarborService',function($stateParams,$state,$modal,HarborService){
			$modal.open({
				templateUrl:'app/moduleHarbor/templates/harborTmpl.html',
				controller:'HarborCtrl',
				size:'lg'
			}).result.then(function(result){
				if ((!result) || (result === "")){
					$state.go(result);
				} else {
					$state.go(result)
				}
			},function(error){
				//TODO Aqui ira el tratamiento de error cuando ponga la modal de mensajes
			});
		}]
	});
}]);
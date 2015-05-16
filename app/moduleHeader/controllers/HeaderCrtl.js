var moduleHeader=angular.module('ModuleHeader',[]);

moduleHeader.controller('HeaderCtrl',['$scope','$translate','$injector','profile','$filter','$rootScope',
	function($scope,$translate,$injector,profile,$filter,$rootScope){
	$scope.clickedSearch=true;
	$scope.clickedNew=false;
	$scope.langs=[
		{code:"es",field:$filter('translate')("SPN")},
		{code:"en",field:$filter('translate')("ENG")}
	];
	$scope.lng=$scope.langs[1];
	var config = $injector.get(profile);
	$scope.clickSearch=function (){
		//TODO Hay que añadir la navegación al estado de búsqueda siempre y cuando el estado actual
		//sea diferente de Result
		$scope.clickedSearch=true;
		$scope.clickedNew=false;
	};
	$scope.clickNew=function (){
		//TODO Hay que añadir la navegacion al estado de details siempre y cuando el estado acutal
		//sea diferente de Detail
		$scope.clickedNew=true;
		$scope.clickedSearch=false;
	};

	$scope.changeLang=function(){
		$translate.use($scope.lng.code);
	}

	$rootScope.$on('$translateChangeSuccess',function(){
		$translate(['SPN','ENG']).then(function(trans){
			$scope.langs[0].field=trans.SPN;
			$scope.langs[1].field=trans.ENG;
			$scope.lng.field = ($scope.lng.code === "es")? trans.SPN : trans.ENG;
		},function(error){
			//TODO Cuando tenga programado el estado de la ventana de aviso, aqui, debe de ir 
			//una navegación a dicho estado con el mensaje de error
			console.error(JSON.stringify(error));
		});
	});
}]);

var moduleHeader=angular.module('ModuleHeader',[]);

moduleHeader.controller('HeaderCtrl',['$scope','$translate','$injector','profile','$filter','$rootScope','$state',
	function($scope,$translate,$injector,profile,$filter,$rootScope,$state){

    $scope.cache={};
	if ($state.current.name === "header.form.result"){
		$scope.clickedSearch=true;
		$scope.clickedNew=false;	
	} else {
		$scope.clickedSearch=false;
		$scope.clickedNew=true;
	}	
	
	$scope.langs=[
		{code:"es",field:$filter('translate')("SPN")},
		{code:"en",field:$filter('translate')("ENG")}
	];
	$scope.lng=$scope.langs[1];
	var config = $injector.get(profile);
	$scope.clickSearch=function (){
		if (!$scope.clickedSearch){
			$scope.clickedSearch=true;
			$scope.clickedNew=false;
			$state.go('header.form.result');
		}
	};
	$scope.clickNew=function (){
		if ($scope.clickedSearch){
			$scope.clickedNew=true;
			$scope.clickedSearch=false;
			$state.go('header.new');
		}
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

	$scope.saveVesselForm = function (vesselForm){
		$scope.cache.vesselForm=vesselForm;
	}

	// $scope.saveSearchResult = function(searchResult){
	// 	$scope.cache.vesselResult=searchResult;
	// }
}]);

angular.module('HarborApp',[]).controller('HarborCtrl',['$scope','$state','HarborService','ngTableParams','$rootScope','$translate',
	function($scope,$state,HarborService,ngTableParams,$rootScope,$translate){
	
	$scope.data=[];
	$scope.service = new HarborService();
	$scope.validate=false;
	$scope.name="Name";
	$scope.latitude="latitude";
	$scope.longitude="longitude";


	$scope.goOut = function(){
		$state.go('^');
	};

	$scope.search = function (){
		if ((!$scope.hardBoardName) || ($scope.hardBoardName.length < 3)){
			$scope.validateError="CHAR_MIN";
			$scope.validate=true;
		} else {
			$scope.validate=false;
		}
		$scope.tableParams.reload();
	};


	$scope.tableParams = new ngTableParams({
		page:1,
		count:5
	},{
		total: $scope.data.length,
		getData: function ($defer,params){
			$scope.service.getHarborData($scope.hardBoardName,$defer,params);
		}
	});

	$rootScope.$on('$translateChangeSuccess',function(){
		$translate(['ONLY_NAME','LATITUDE','LONGITUDE']).then(function(trans){
			$scope.name=trans.ONLY_NAME;
			$scope.latitude=trans.LATITUDE;
			$scope.longitude=trans.LONGITUDE
		},function(error){
			//TODO Aqui hay que poner el tratamiento de errores cuando tengamos la modal de avisos
		})
	});

}]);
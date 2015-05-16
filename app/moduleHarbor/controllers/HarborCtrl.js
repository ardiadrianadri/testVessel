angular.module('HarborApp',[]).controller('HarborCtrl',['$scope','HarborService','ngTableParams','$rootScope','$translate',
	function($scope,HarborService,ngTableParams,$rootScope,$translate){
	
	$scope.data=[];
	$scope.service = new HarborService();
	$scope.validate=false;
	$scope.name="Name";
	$scope.latitude="latitude";
	$scope.longitude="longitude";
	$scope.gotData=true;
	$scope.loading=false;


	$scope.goOut = function(){
		$scope.$close('^');
	};

	$scope.search = function (){
		if ((!$scope.hardBoardName) || ($scope.hardBoardName.length < 3)){
			$scope.validateError="CHAR_MIN";
			$scope.validate=true;
		} else {
			$scope.validate=false;
			$scope.gotData=false;
			$scope.loading=true;
			$scope.tableParams.reload();
		}
	};


	$scope.tableParams = new ngTableParams({
		page:1,
		count:5
	},{
		total: $scope.data.length,
		getData: function ($defer,params){
			$scope.service.getHarborData($scope.hardBoardName,$defer,params).then(function(){
				$scope.gotData=true;
				$scope.loading=false;
			},function(){
				//TODO Aqui habra que poner la logica de fallo cuando tengamos la ventana de mensajes
			});

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

	$scope.select=function(harbor){
		$rootScope.$emit('POINT_SELECTED',harbor.point);
		$scope.$close('^');
	}

}]);
angular.module('HarborApp',[]).controller('HarborCtrl',['$scope','HarborService','ngTableParams','$rootScope','$translate','$filter',
	function($scope,HarborService,ngTableParams,$rootScope,$translate,$filter){
	
	$scope.data=[];
	$scope.service = new HarborService();
	$scope.validate=false;
	$scope.name=$filter("translate")("ONLY_NAME");
	$scope.latitude=$filter("translate")("LATITUDE");
	$scope.longitude=$filter("translate")("LONGITUDE");
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

	$scope.select=function(harbor){
		$rootScope.$emit('POINT_SELECTED',harbor.point);
		$scope.$close('^');
	}

}]);
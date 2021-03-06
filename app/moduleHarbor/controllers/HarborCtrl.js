angular.module('HarborApp',[]).controller('HarborCtrl',['$scope','HarborService','ngTableParams','$rootScope','$translate','$filter','$injector','profile',
	function($scope,HarborService,ngTableParams,$rootScope,$translate,$filter,$injector,profile){
	
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
		count:5,
		sorting:{
			name:'asc'
		}
	},{
		total: $scope.data.length,
		getData: function ($defer,params){
			$scope.service.getHarborData($scope.hardBoardName,$defer,params).then(function(){
				$scope.gotData=true;
				$scope.loading=false;
			},function(error,status){
				var config=$injector.get(profile);
				console.error($filter("translate")(error));
				if (config.httpError[status]){
					$scope.$dismiss(config.httpError[status]);
				} else if (error === config.httpError.noResults){
					$scope.$dismiss(config.httpError.noResults);
				} else {
					$scope.$dismiss(config.httpError.default);
				}
				$scope.gotData=true;
				$scope.loading=false;
			});

		}
	});

	$scope.select=function(harbor){
		$rootScope.$emit('POINT_SELECTED',harbor.point);
		$scope.$close('^');
	}

}]);
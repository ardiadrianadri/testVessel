angular.module('ResultApp',[]).controller('ResultCtrl',['$scope','$rootScope','$translate','$filter','$injector','profile','$state',
	function($scope, $rootScope, $translate,$filter,$injector,profile,$state){
		$scope.vesselName=$filter('translate')('ONLY_NAME');
		$scope.vesselWidth=$filter('translate')('WIDTH');
		$scope.vesselLength=$filter('translate')('LENGTH');
		$scope.vesselDraft=$filter('translate')('DRAFT');
		$scope.vesselLatitude=$filter('translate')('LATITUDE');
		$scope.vesselLongitude=$filter('translate')('LONGITUDE');

		$rootScope.$on('$translateChangeSuccess',function(){
			$translate(['ONLY_NAME','WIDTH','LENGTH','DRAFT','LATITUDE','LONGITUDE']).then(function(trans){
				$scope.vesselName=trans.ONLY_NAME;
				$scope.vesselWidth=trans.WIDTH;
				$scope.vesselLength=trans.LENGTH;
				$scope.vesselDraft=trans.DRAFT;
				$scope.vesselLatitude=trans.LATITUDE;
				$scope.vesselLongitude=trans.LONGITUDE;
			},function(error){
				var config = $injector.get(profile);
				if (config.error){
					$state.go('header.form.result.message',{code:config.error});
				} else {
					$state.go('header.form.result.message',{code:config.default});
				}
			})
		});
	}]);
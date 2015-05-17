angular.module('MessageApp',[]).controller('MessageCtrl',['$scope','$state','$stateParams',function($scope,$state,$stateParams){
	$scope.message=$stateParams.code;

	$scope.goOut = function (){
		$scope.$close('^');
	}
}]);
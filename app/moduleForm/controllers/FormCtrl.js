angular.module("FormApp",[]).controller("FormCtrl",['$scope','$state',function($scope,$state){
	$scope.showDetail=true;
	$scope.showBetweenDetails = {
		width:false,
		length:false,
		draft:false
	};

	$scope.selectWidth="gte";
	$scope.selectLength="gte";
	$scope.selectDraft="gte";

	$scope.compareWidth = function(){
		if ($scope.selectWidth === "btw"){
			$scope.showBetweenDetails.width=true;
		} else {
			$scope.showBetweenDetails.width=false;
		}
	}

	$scope.compareLength = function(){
		if ($scope.selectLength === "btw"){
			$scope.showBetweenDetails.length=true;
		} else {
			$scope.showBetweenDetails.length=false;
		}
	}

	$scope.compareDraft=function(){
		if ($scope.selectDraft === "btw"){
			$scope.showBetweenDetails.draft=true;
		} else {
			$scope.showBetweenDetails.draft=false;
		}
	}

	$scope.setPoint=function(point){
		$scope.point=point;
	}

	$scope.harborModal=function(){
		$state.go("header.form.harbor");
	}

}]);
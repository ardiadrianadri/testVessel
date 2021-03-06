angular.module('DetailsApp',[]).controller('DetailsCtrl',['$scope','$state','SearchVesselService',
function($scope,$state,SearchVesselService){
		
		$scope.service = new SearchVesselService();
		$scope.validations={
			name:null,
			width:null,
			length:null,
			draft:null,
			latitude:null,
			longitude:null
		}

		if ($scope.cache.vesselSelected){
			$scope.title="UPDATE_VESSEL";
			$scope.vessel=$scope.cache.vesselSelected;
		} else {
			$scope.title="NEW_VESSEL";
			$scope.vessel={
				name:null,
				width:null,
				length:null,
				draft:null,
				point:{
					x:null,
					y:null
				}
			};
		}

		$scope.cleanForm=function(){
			$scope.vessel=null;
			$scope.disableSearch=buttonEnable();
		}

		$scope.validateName=function(name){
			if (name && (name.length<3)){
				$scope.validations.name="CHAR_MIN"
			} else {
				$scope.validations.name=null;
			}
			$scope.disableSearch=buttonEnable();
		}

		 $scope.validatePositiveNumber=function(value,field){
		 	
		 	if (value && (!value.match(/^[0-9]{1,9}(?:\.[0-9]{1,9})?$/))){
 				$scope.validations[field]="ONLY_NUMBERS_POSITIVE";
 			} else {
 				$scope.validations[field]=null;
 			}

 			$scope.disableSearch=buttonEnable();
		 }

		 $scope.validateNumber = function(value,field){
		 	
		 	if (value && (!value.match(/^[+-]?[0-9]{1,9}(?:\.[0-9]{1,9})?$/))){
		 		$scope.validations[field]="ONLY_NUMBERS";
		 	} else {
		 		$scope.validations[field]=null;
		 	}

		 	$scope.disableSearch=buttonEnable();
		 }

		var checkForErrors = function (){
			return $scope.validations.name || 
			       $scope.validations.width || 
			       $scope.validations.length ||
			       $scope.validations.draft ||
			       $scope.validations.latitude ||
			       $scope.validations.longitude;
		}

		var isVesselEmpty = function (){
			return !($scope.vessel && $scope.vessel.name)

		}

		var buttonEnable = function(){
			return (checkForErrors() !== null) || isVesselEmpty();
		}

		$scope.disableSearch=buttonEnable();

		$scope.save=function (){
			if (checkForErrors() !== null){
				$state.go('header.new.message',{code:'10002'});
			} else if (isVesselEmpty()){
				$state.go('header.new.message',{code:'10004'});
			} else {
				// $scope.service.newVessel($scope.vessel).finally(function(data){
				// 	$state.go('header.new.message',{code:data});
				// });

				$scope.service.newVessel($scope.vessel).then(function(data){
					$state.go('header.new.message',{code:data});
				},function(error){
					$state.go('header.new.message',{code:error});
				});
			}
		}

}]);
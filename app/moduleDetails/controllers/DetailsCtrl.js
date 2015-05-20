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

		$scope.cleanForm=function(){
			$scope.vessel=null;
		}

		$scope.validateName=function(name){
			if (name && (name.length<=3)){
				$scope.validations.name="CHAR_MIN"
			} else {
				$scope.validations.name=null;
			}
			$scope.disableSearch=buttonEnable();
		}

		 $scope.validatePositiveNumber=function(value,field){
		 	if (value && (!value.match(/^[0-9]{1,9}(?:\.[0-9]{1,2})?$/))){
 				$scope.validations[field]="ONLY_NUMBERS_POSITIVE";
 			} else {
 				$scope.validations[field]=null;
 			}

 			$scope.disableSearch=buttonEnable();
		 }

		 $scope.validateNumber = function(value,field){
		 	if (value && (!value.match(/^[+-]?[0-9]{1,9}(?:\.[0-9]{1,2})?$/))){
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

}]);
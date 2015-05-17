angular.module("FormApp",[]).controller("FormCtrl",['$scope','$state','$stateParams','$rootScope',function($scope,$state,$stateParams,$rootScope){
	$scope.showDetail=true;
	$scope.showBetweenDetails = {
		width:false,
		length:false,
		draft:false
	};

	$scope.disableSearch=true;
	$scope.vesselForm={
		name:null,
		area:{
			point:{
				latitude:null,
				longitude:null
			},
			radius:null
		},
		width:{
			field1:null,
			operator:"gte",
			field2:null
		},
		length:{
			field1:null,
			operator:"gte",
			field2:null
		},
		draft:{
			field1:null,
			operator:"gte",
			field2:null
		}
	}

	$scope.launchSearch = function(){
		if (!$scope.disableSearch){
			alert("Start the search");
		}
	}

	$scope.compareWidth = function(){
		if ($scope.vesselForm.width.operator === "btw"){
			$scope.showBetweenDetails.width=true;
		} else {
			$scope.showBetweenDetails.width=false;
			$scope.vesselForm.width.field2=null;
		}
	}

	$scope.compareLength = function(){
		if ($scope.vesselForm.length.operator === "btw"){
			$scope.showBetweenDetails.length=true;
		} else {
			$scope.showBetweenDetails.length=false;
			$scope.vesselForm.length.field2=null;
		}
	}

	$scope.compareDraft=function(){
		if ($scope.vesselForm.draft.operator === "btw"){
			$scope.showBetweenDetails.draft=true;
		} else {
			$scope.showBetweenDetails.draft=false;
			$scope.vesselForm.length.field2=null;
		}
	}

	$scope.harborModal=function(){
		$state.go("header.form.harbor");
	}

	$rootScope.$on('POINT_SELECTED',function(evt,point){
		$scope.vesselForm.area.point=point;
	});

	$scope.clean = function (){
		$scope.vesselForm={
			name:null,
			area:{
				point:{
					latitude:null,
					longitude:null
				},
				radius:null
			},
			width:{
				field1:null,
				operator:"gte",
				field2:null
			},
			length:{
				field1:null,
				operator:"gte",
				field2:null
			},
			draft:{
				field1:null,
				operator:"gte",
				field2:null
			}
		}
	}

	$scope.validationNameError=false;
	$scope.validateName = function () {
		if (($scope.vesselForm.name.length) && ($scope.vesselForm.name.length>=3)){
			$scope.validationNameError=false;
		} else {
			$scope.validationNameError=true;
			$scope.validationNameMessage="CHAR_MIN"
		}

		$scope.disableSearch = !enableSearch();
	}

	$scope.validationRadiosError=false;
	$scope.validateRadios = function (){
		if (((!$scope.vesselForm.area.point.latitude) || (!$scope.vesselForm.area.point.longitude)) && ($scope.vesselForm.area.radius)){
			$scope.validationRadiosError=true;
			$scope.validationRadiosMessage="POINT_NULL";
		} else if (($scope.vesselForm.area.radius)&&(!$scope.vesselForm.area.radius.match(/^[0-9]{1,9}(?:\.[0-9]{1,2})?$/))){
			$scope.validationRadiosError=true;
			$scope.validationRadiosMessage="ONLY_NUMBERS_POSITIVE";
		} else {
			$scope.validationRadiosError=false;
		}
		$scope.disableSearch = !enableSearch();
	}

	$scope.validationLatitudeError=false;
	$scope.validateLatitude = function (){
		if (($scope.vesselForm.area.point.latitude) && (!$scope.vesselForm.area.point.latitude.match(/^[+-]?[0-9]{1,9}(?:\.[0-9]{1,2})?$/))){
			$scope.validationLatitudeError=true;
			$scope.validationLatitudeMessage="ONLY_NUMBERS"
		} else {
			$scope.validationLatitudeError=false;
		}

		$scope.validateRadios();
	}

	$scope.validationLongitudeError=false;
	$scope.validateLongitude = function (){
		if (($scope.vesselForm.area.longitude) && (!$scope.vesselForm.area.point.longitude.match(/^[+-]?[0-9]{1,9}(?:\.[0-9]{1,2})?$/))) {
			$scope.validationLongitudeError=true;
			$scope.validationLongitudeMessage="ONLY_NUMBERS";
		} else {
			$scope.validationLongitudeError=false;
		}

		$scope.validateRadios();
	}

	$scope.validationWidth1Error=false;
	$scope.validationWidth2Error=false;
	$scope.validationlength1Error=false;
	$scope.validationlength2Error=false;
	$scope.validationDraft1Error=false;
	$scope.validationDraft2Error=false;

	$scope.validateDetails = function (detail) {
		var validateMessage="";
		var validateError="";

		switch(detail.name){
			case "width":
				validateMessage="validationWidth"+detail.field+"Message";
				validateError="validationWidth"+detail.field+"Error";
			break;
			case "length":
				validateMessage="validationLength"+detail.field+"Message";
				validateError="validationLength"+detail.field+"Error";
			break;
			case "draft":
				validateMessage="validationDraft"+detail.field+"Message";
				validateError="validationDraft"+detail.field+"Error";
		}

		if (($scope.vesselForm[detail.name]["field"+detail.field]) && (!$scope.vesselForm[detail.name]["field"+detail.field].match(/^[0-9]{1,9}(?:\.[0-9]{1,2})?$/))) {
			$scope[validateError]=true;
			$scope[validateMessage]="ONLY_NUMBERS_POSITIVE"
		} else {
			$scope[validateError]=false;
		}
		$scope.disableSearch = !enableSearch();
	}

	var enableSearch = function(){
		return ((($scope.vesselForm.name) || 
			   (($scope.vesselForm.area.radios) && ($scope.vesselForm.area.point.latitude) && ($scope.vesselForm.area.point.longitude))) &&
		       (!$scope.validationNameError) && (!$scope.validationLatitudeError) && (!$scope.validationLongitudeError) && (!$scope.validationRadiosError)
		       && (!$scope.validationWidth1Error) && (!$scope.validationWidth2Error) && (!$scope.validationlength1Error) && (!$scope.validationlength2Error)
		       && (!$scope.validationDraft1Error) && (!$scope.validationDraft2Error));
	}
}]);
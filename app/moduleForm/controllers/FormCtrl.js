angular.module("FormApp",[]).controller("FormCtrl",['$scope','$state','$stateParams','$rootScope','ngTableParams','SearchVesselService','$injector','profile',
	function($scope,$state,$stateParams,$rootScope,ngTableParams,SearchVesselService,$injector,profile){
	$scope.showDetail=true;
	$scope.showBetweenDetails = {
		width:false,
		length:false,
		draft:false
	};

	$scope.service = new SearchVesselService();

	if ($scope.cache.vesselForm){
		$scope.vesselForm=$scope.cache.vesselForm;
	} else {
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
		};
	}

	$scope.results=[];
	$scope.tableResult=true;
	$scope.loadingResult=false;

	$scope.launchSearch = function(){
		if (!$scope.disableSearch){
			$scope.tableResult=false;
			$scope.loadingResult=true;
			$scope.tableGrid.reload();
			$state.go('header.form.result');
		} else {
			if (!fieldsFilled()){
				$state.go('header.form.result.message',{code:'10001'});	
			} else if (!validationErrors()){
				$state.go('header.form.result.message',{code:'10002'});
			}
			
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
		$state.go("header.form.result.harbor");
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

	var fieldsFilled = function () {
		return (($scope.vesselForm.name) || 
			   (($scope.vesselForm.area.radius) && ($scope.vesselForm.area.point.latitude) && ($scope.vesselForm.area.point.longitude)));
	}

	var validationErrors = function () {
		return  (!$scope.validationNameError) && (!$scope.validationLatitudeError) && (!$scope.validationLongitudeError) && (!$scope.validationRadiosError)
		       && (!$scope.validationWidth1Error) && (!$scope.validationWidth2Error) && (!$scope.validationlength1Error) && (!$scope.validationlength2Error)
		       && (!$scope.validationDraft1Error) && (!$scope.validationDraft2Error);
	}
	var enableSearch = function(){
		return fieldsFilled() && validationErrors();
	}

	$scope.tableGrid = new ngTableParams({
		page:1,
		count:10
	},{
		total:$scope.results.length,
		getData: function ($defer,params){
			$scope.service.getVessels($scope.vesselForm,$defer,params).then(function(data){
				$scope.tableResult=true;
				$scope.loadingResult=false;
			},function(error,status){
				var config = $injector.get(profile);
				var code="";
				if (config.httpError[status]){
					$state.go('header.form.result.message',{code:config.httpError[status]});
				} else {
					$state.go('header.form.result.message',{code:config.httpError.default});
				}
			});
		}
	});

	$scope.disableSearch = !enableSearch();
	
	$scope.$on('$destroy',function(){
		$scope.saveVesselForm($scope.vesselForm);
	});
}]);
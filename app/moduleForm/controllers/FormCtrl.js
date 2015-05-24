angular.module("FormApp",[]).controller("FormCtrl",['$scope','$state','$stateParams','$rootScope','ngTableParams','SearchVesselService','$injector','profile','$filter','$timeout',
	function($scope,$state,$stateParams,$rootScope,ngTableParams,SearchVesselService,$injector,profile,$filter,$timeout){
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
					y:null,
					x:null
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
			$timeout(function() {
				$scope.tableGrid.reload();
			}, 0);
			
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
					y:null,
					x:null
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
		if ((($scope.vesselForm.name) && ($scope.vesselForm.name.length>=3)) || (($scope.vesselForm.area.point.x) && ($scope.vesselForm.area.point.y) && ($scope.vesselForm.area.radius))){
			$scope.validationNameError=false;
		} else {
			$scope.validationNameError=true;
			$scope.validationNameMessage="CHAR_MIN"
		}

		$scope.disableSearch = !enableSearch();
	}

	$scope.validationRadiosError=false;
	$scope.validateRadios = function (){
		if (((!$scope.vesselForm.area.point.y) || (!$scope.vesselForm.area.point.x)) && ($scope.vesselForm.area.radius)){
			$scope.validationRadiosError=true;
			$scope.validationRadiosMessage="POINT_NULL";
		} else if (($scope.vesselForm.area.radius)&&(!$scope.vesselForm.area.radius.match(/^[0-9]{1,9}(?:\.[0-9]{1,9})?$/))){
			$scope.validationRadiosError=true;
			$scope.validationRadiosMessage="ONLY_NUMBERS_POSITIVE";
		} else {
			$scope.validationRadiosError=false;
		}
		$scope.disableSearch = !enableSearch();
	}

	$scope.validationLatitudeError=false;
	$scope.validateLatitude = function (){
		if (($scope.vesselForm.area.point.y) && (!$scope.vesselForm.area.point.y.match(/^[+-]?[0-9]{1,9}(?:\.[0-9]{1,9})?$/))){
			$scope.validationLatitudeError=true;
			$scope.validationLatitudeMessage="ONLY_NUMBERS"
		} else {
			$scope.validationLatitudeError=false;
		}

		$scope.validateRadios();
	}

	$scope.validationLongitudeError=false;
	$scope.validateLongitude = function (){
		if (($scope.vesselForm.area.x) && (!$scope.vesselForm.area.point.x.match(/^[+-]?[0-9]{1,9}(?:\.[0-9]{1,9})?$/))) {
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
			   (($scope.vesselForm.area.radius) && ($scope.vesselForm.area.point.y) && ($scope.vesselForm.area.point.x)));
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
				} else if (error === config.httpError.noResults){
					$state.go('header.form.result.message',{code:config.httpError.noResults});
				}else{
					$state.go('header.form.result.message',{code:config.httpError.default});
				}

				$scope.tableResult=true;
				$scope.loadingResult=false;
			});
		}
	});

	$scope.disableSearch = !enableSearch();
	
	$scope.$on('$destroy',function(){
		$scope.saveVesselForm($scope.vesselForm);
	});
}]);
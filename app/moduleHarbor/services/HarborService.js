angular.module('HarborApp').factory('HarborService',['$http','$q','$injector','profile',function($http,$q,$injector,profile){

	function HarborServiceClass () {


		this.getHarborData = function (name,$defer,params){
			if ((name) && (name !== "")){
				var config = $injector.get(profile);
				//TODO descomentar esto para cuando se quiera salir del estado mocks
				//var finalUrl = config.harborRest.url+((config.harborRest.url.indexOf('?')<0)?'?':'&')+config.harborRest.params[0]+name;
				var finalUrl = config.harborRest.url
	
				$http.get(finalUrl).success(function(data){
					//TODO Esta lógica esta bien para la version mock pero, cuando tengamos nuestra versión con back, la paginacion la lleva
					//el back
					params.total(data.length);
					$defer.resolve(data.slice((params.page()-1)*params.count(),params.page()*params.count()));
				}).error(function (error,status){
					defer.reject(error,status);
				});
			}else{
				params.total(0);
				$defer.resolve([]);
			}

			return $defer.promise;
		};


	}

	return HarborServiceClass;
}]);
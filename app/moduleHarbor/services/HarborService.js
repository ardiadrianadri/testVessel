angular.module('HarborApp').factory('HarborService',['$http','$q','$injector','profile',function($http,$q,$injector,profile){

	function HarborServiceClass () {


		this.getHarborData = function (name,$defer,params){
			if ((name) && (name !== "")){
				var config = $injector.get(profile);
				var sortObject = params.sorting();
				var sortQuery = null;
				if (sortObject){
					for (var k in sortObject){
						sortQuery=config.harborRest.params.sort+k+","+sortObject[k];
					}
				}
				var finalUrl = config.harborRest.url+
				               ((config.harborRest.url.indexOf('?')<0)?'?':'&')+
				               config.harborRest.params.name+name+'&'+
				               config.harborRest.params.page+(params.page()-1)+'&'+
				               config.harborRest.params.size+params.count();
	
				if (sortQuery !== null){
					finalUrl = finalUrl+"&"+sortQuery;
				}
				$http.get(finalUrl).success(function(data){
					params.total(data.page.totalElements);
					if (data._embedded){
						$defer.resolve(data._embedded.harbors);	
					} else {
						$defer.reject(config.httpError.noResults)
					}
					
				}).error(function (error,status){
					$defer.reject(error,status);
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
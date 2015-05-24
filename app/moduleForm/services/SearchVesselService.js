angular.module('FormApp').factory('SearchVesselService',['$http','$injector','profile','$q',function($http,$injector,profile,$q){

	function SearchVesselClass (){
		var generateUrl = function (vessel,config){
			var finalUrl=config.vesselRest.url
			var params="?";

			if ((vessel.name) && (vessel.name !== "") && (vessel.name !== "   ")){
				finalUrl=finalUrl+config.vesselRest.name+config.vesselRest.and;
				params=params+config.vesselRest.params.name+vessel.name+"&";
			}

			if ((vessel.area.point.y) && (vessel.area.point.y !== "") && (vessel.area.point.x) && (vessel.area.point.x !=="") && (vessel.area.radius) && (vessel.area.radius !== "")){
				finalUrl=finalUrl+config.vesselRest.point+config.vesselRest.and;
				params=params+config.vesselRest.params.point+vessel.area.point.x+","+vessel.area.point.y+"&"+config.vesselRest.params.distance+vessel.area.radius+"km&";
			}

			if ((vessel.width.field1) && (vessel.width.field1 !=="")){
				finalUrl=finalUrl+config.vesselRest.width+config.vesselRest[vessel.width.operator]+config.vesselRest.and;
				if ((vessel.width.operator === "btw") && (vessel.width.field2) && (vessel.width.field2 !=="")){
					params=params+config.vesselRest.params.widthFrom+vessel.width.field1+"&"+config.vesselRest.params.widthTo+vessel.width.field2+'&';
				} else {
					params=params+config.vesselRest.params.width+vessel.width.field1+"&";
				}
			}

			if ((vessel.length.field1) && (vessel.length.field1 !== "")){
				finalUrl=finalUrl+config.vesselRest.length+config.vesselRest[vessel.length.operator]+config.vesselRest.and;
				if ((vessel.length.operator === "btw") && (vessel.length.field2) && (vessel.length.field2 !== "")){
					params=params+config.vesselRest.params.lengthFrom+vessel.length.field1+"&"+config.vesselRest.params.lengthTo+vessel.length.field2+"&";
				} else {
					params=params+config.vesselRest.params.length+vessel.length.field1+"&";
				}
			}

			if ((vessel.draft.field1) && (vessel.draft.field1 !== "")){
				finalUrl=finalUrl+config.vesselRest.draft+config.vesselRest[vessel.draft.operator]+config.vesselRest.and;
				if ((vessel.draft.operator === "btw") && (vessel.draft.field2) && (vessel.draft.field2 !== "")){
					params=params+config.vesselRest.params.draftFrom+vessel.draft.field1+"&"+config.vesselRest.params.draftTo+vessel.draft.field2+"&";
				} else {
					params=params+config.vesselRest.params.draft+vessel.draft.field1+"&";
				}
			}

			var index = finalUrl.lastIndexOf(config.vesselRest.and);
			finalUrl = finalUrl.substr(0,index);
			finalUrl = finalUrl+params;


			return finalUrl;

		};

		var isVesselEmpty = function (vessel) {
			return ((!vessel.name) &&
				   ((!vessel.area.radius) || 
				   	(!vessel.area.point.x) || 
				   	(!vessel.area.point.y)));
		};

		this.getVessels = function (vessel,$defer,params){
			if ((vessel) && (!isVesselEmpty(vessel))) {
				var config = $injector.get(profile);
				
				var url = generateUrl(vessel,config)
				url=url+config.vesselRest.params.page+(params.page()-1)+"&"+config.vesselRest.params.size+params.count();

				$http.get(url).success(function(data){
					params.total(data.page.totalElements);
					if (data._embedded){
						$defer.resolve(data._embedded.vessels);	
					} else {
						$defer.reject(config.httpError.noResults);
					}
					
				}).error(function (error,status){
					$defer.reject(error,status);
				});
			} else {
				params.total(0);
				$defer.resolve([]);
			}

			return $defer.promise;
		}

		this.newVessel = function (vessel){
			var config = $injector.get(profile);
			var defer = $q.defer();

			if (vessel.name){
				var vesselEntity = {
					name: vessel.name,
					width: vessel.width,
					length: vessel.length,
					draft: vessel.draft,
					point:{
						x:vessel.point.x,
						y:vessel.point.y,
						coordinates:[vessel.point.x,vessel.point.y],
						type:"Point"
					}
				};

				$http.post(config.vesselRestNew.url,vesselEntity).success(function(){
					defer.resolve(config.httpError.OK);
				},function(error,status){
					if (config.httpError[status]){
						defer.reject(status);	
					} else {
						defer.reject(config.httpError.default);
					}
					
				})
			} else {
				defer.reject(config.httpError.vesselEmpty);
			}

			return defer.promise;
		}
	}

	return 	SearchVesselClass;
}]);
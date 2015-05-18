angular.module('FormApp').factory('SearchVesselService',['$http','$injector','profile',function($http,$injector,profile){

	function SearchVesselClass (){
		var generateUrl = function (vessel,config){
			var finalUrl = config.vesselRest.url

			if (vessel.width.field1){
				finalUrl=finalUrl+config.width[vessel.width.operator];
			}

			if (vessel.length.field1){
				finalUrl=finalUrl+config.length[vessel.length.operator];
			}

			if (vessel.draft.field1){
				finalUrl=finalUrl+config.draft[vessel.draft.operator];
			}

			finalUrl = finalUrl + ((finalUrl.indexOf('?')<0)?'?':'&');

			if (vessel.name){
				finalUrl = finalUrl+config.vesselRest.params.name+vessel.name+"&";
			}

			if (vessel.width.field1){
				finalUrl = finalUrl+config.vesselRest.params.width+vessel.width.field1+"&";
			}

			if (vessel.length.field1){
				finalUrl=finalUrl+config.vesselRest.params.length+vessel.length.field1+"&";
			}

			if (vessel.draft.field1){
				finalUrl=finalUrl+config.vesselRest.params.draft+vessel.draft.field1+"&";
			}

			if (vessel.area.point.latitude){
				finalUrl=finalUrl+config.vesselRest.params.latitude+vessel.area.point.latitude+"&";
			}

			if (vessel.area.point.longitude){
				finalUrl=finalUrl+config.vesselRest.params.longitude+vessel.area.point.longitude+"&";
			}

			if (vessel.area.radius){
				finalUrl=finalUrl+config.vesselRest.params.radius+vessel.area.radius+"&";
			}

			if (vessel.width.field2){
				finalUrl=finalUrl+config.vesselRest.params.width2+vessel.width.field2+"&";
			}

			if (vessel.length.field2){
				finalUrl=finalUrl+config.vesselRest.params.length2+vessel.length.field2+"&";
			}

			if (vessel.draft.field2){
				finalUrl=finalUrl+config.vesselRest.params.draft2+vessel.draft.field2+"&";
			}

			finalUrl = finalUrl.substr(0,(finalUrl.length - 1));

			return finalUrl;

		};

		var isVesselEmpty = function (vessel) {
			return ((!vessel.name) && 
				   ((!vessel.area.radius) || 
				   	(!vessel.area.point.latitude) || 
				   	(!vessel.area.point.longitude)));
		};

		this.getVessels = function (vessel,$defer,params){
			if ((vessel) && (!isVesselEmpty(vessel))) {
				var config = $injector.get(profile);
				//TODO Esto lo activaremos cuando tengamos un back
				//var url = generateUrl(vessel,config)
				var url=config.vesselRest.url;

				$http.get(url).success(function(data){
					//Esta lógica esta bien ahora pero, la paginación, cuando tengamos un back, la llevara el servidor
					params.total(data.length);
					$defer.resolve(data.slice((params.page()-1)*params.count(),params.page()*params.count()));
				}).error(function (error,status){
					$defer.resolve(error,status);
				});
			} else {
				params.total(0);
				$defer.resolve([]);
			}

			return $defer.promise;
		}
	}

	return 	SearchVesselClass;
}]);
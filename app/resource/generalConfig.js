var generalConfig = angular.module('GeneralConfig',['pascalprecht.translate']);

generalConfig.config(["$translateProvider","$translatePartialLoaderProvider","$injector","profile",
	function($translateProvider,$translatePartialLoaderProvider,$injector,profile){
		var config = $injector.get(profile);
		$translatePartialLoaderProvider.addPart('main');
		$translateProvider.useLoader('$translatePartialLoader', {
		  urlTemplate: './app/i18n/{part}/translate-{lang}.json'
		});
		$translateProvider.preferredLanguage(config.languageDefault);
		$translateProvider.useSanitizeValueStrategy('escaped');
}]);

generalConfig.constant("profile","generalDEV");

generalConfig.constant("generalDEV",{
	"languageDefault":"en",
	"harborRest":{
		"url":"app/moduleHarbor/mocks/harbor.json",
		"params":["name="]
	},
	"vesselRest":{
		"url":"app/moduleResults/mocks/vessel.json",
		"params":{
				"name":"name=",
				"width":"width=",
				"length":"length=",
				"draft":"draft=",
				"latitutde":"latitutde=",
				"longitude":"longitude=",
				"radius":"radius=",
				"width2":"width2=",
				"length2":"length2=",
				"draft2":"draft2="},
		"width":{
			"gte":"",
			"gt":"",
			"lt":"",
			"lte":""
		},
		"length":{
			"gte":"",
			"gt":"",
			"lt":"",
			"lte":""
		},
		"draft":{
			"gte":"",
			"gt":"",
			"lt":"",
			"lte":""
		}
	},
	"httpError":{
		"404":"10404",
		"default":"10003"
	}
});
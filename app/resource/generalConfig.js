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
	}
});
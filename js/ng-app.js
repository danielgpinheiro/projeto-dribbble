let app = angular.module("app", [
    "ngMask",
    "ngSanitize",
    "ngRoute",
]);

app.config(($interpolateProvider, $httpProvider) => {
	//Enable cross domain calls
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];

  $httpProvider.defaults.headers.common['Authorization'] = 'Bearer 8b2d2c66f47b06f46ef3b10fb074e0a41233c35fc91c3fb89985f59d47102bbf'
});

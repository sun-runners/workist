'use strict';

angular.module('workingHoursTrello')
	.directive('monthlyDir', function ($rootScope) {
		return {
			link : function(scope, element, attrs){

				// Initialize Function Section
				var initialize = function(){
          console.log('monthlyDir');
				};
				initialize();

			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../../templates/statistics/directives/monthlyDir.html"
		}
	});

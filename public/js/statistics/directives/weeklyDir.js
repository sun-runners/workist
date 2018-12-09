'use strict';

angular.module('workingHoursTrello')
	.directive('weeklyDir', function ($rootScope) {
		return {
			link : function(scope, element, attrs){

				// Initialize Function Section
				var initialize = function(){
          console.log('weeklyDir');
				};
				initialize();

			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../../template/statistics/directives/weeklyDir.html"
		}
	});

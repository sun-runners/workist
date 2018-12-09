'use strict';

angular.module('workingHoursTrello')
	.directive('yearlyDir', function ($rootScope) {
		return {
			link : function(scope, element, attrs){

				// Initialize Function Section
				var initialize = function(){
          console.log('yearlyDir');
				};
				initialize();

			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../../template/statistics/directives/yearlyDir.html"
		}
	});

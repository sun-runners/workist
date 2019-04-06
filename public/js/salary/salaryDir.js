'use strict';

angular.module('workingHoursTrello')
	.directive('salaryDir', function ($rootScope, apiS) {
		return {
			link : function(scope, element, attrs){
                scope.test = "success";
                console.log(scope.test);
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/salary/directives/salaryDir.html",
		}
	});

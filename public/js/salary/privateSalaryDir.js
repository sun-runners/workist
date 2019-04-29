'use strict';

angular.module('workingHoursTrello')
	.directive('privateDir', function ($rootScope) {
		return {
			link : function(scope, element, attrs){
          		function initialize() {
					scope.menuItem = ['month', 'months', 'basic salary', 'percentage', 'bonus', 'total salary'];
					scope.test = "success";
				}
				initialize();
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/salary/directives/privateSalaryDir.html",
		}
	});

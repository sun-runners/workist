'use strict';

angular.module('workingHoursTrello')
	.directive('thirteenDir', function ($rootScope) {
		return {
			link : function(scope, element, attrs){
          		function initialize() {
					scope.menuItem = ['month', 'months', 'basic salary', 'percentage', 'bonus', 'total salary'];
					scope.memberId = "5c32e94ce49690729ecd0794";
                    
	
				}
				initialize();
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/salary/directives/thirteenDir.html",
		}
	});

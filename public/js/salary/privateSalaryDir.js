'use strict';

angular.module('workingHoursTrello')
	.directive('privateDir', function ($rootScope, privateSalaryS, totalSalaryS, nationalityS) {
		return {
			link : function(scope, element, attrs){
          		function initialize() {
					scope.menuItem = ['month', 'months', 'basic salary', 'percentage', 'bonus', 'total salary'];
					scope.memberId = "5c32e94ce49690729ecd0794";
					scope.monthWorked = () => {
						return privateSalaryS.workedMonths($rootScope.calendarLists);
					}
	
				}
				initialize();
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/salary/directives/privateSalaryDir.html",
		}
	});

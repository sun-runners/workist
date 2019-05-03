'use strict';

angular.module('workingHoursTrello')
	.directive('thirteenDir', function ($rootScope, totalSalaryS) {
		return {
			link : function(scope, element, attrs){
          		function initialize() {
					scope.menuItem = ['Name', 'months', 'basic salary', 'total'];
					scope.memberId = "5c32e94ce49690729ecd0794";
					scope.getMonthDuration = (memberId) => totalSalaryS.monthDuration($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', $rootScope.dt.Date, memberId);
					// scope.getMonthDuration = (memberId) => totalSalaryS.monthDuration($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', new Date('2019/12/7'), memberId);
					scope.getCurrentSalary = (memberId, monthNumber) => totalSalaryS.salary($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', memberId, monthNumber);
					// scope.getCurrentSalary = (memberId, monthNumber) => totalSalaryS.salary($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', memberId, monthNumber);
					scope.formatSalary = (salary) => {
						try {
							return salary.toLocaleString() + " PHP"
						} catch (error) {}
					}
                    scope.totalThirteen = (salary, monthDuration) => {
						return Math.ceil((salary * monthDuration)/12)
					}
				}
				initialize();
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/salary/directives/thirteenDir.html",
		}
	});

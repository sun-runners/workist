'use strict';

angular.module('workingHoursTrello')
	.directive('salaryDir', function ($rootScope, totalSalaryS, nationalityS, holidayS, weekS, monthS) {
		return {
			link : function(scope, element, attrs){
          		function initialize() {
					scope.menuItem = ['months', 'salary', 'percentage', 'bonuse', 'total salary'];
					scope.getMonthDuration = (memberId) => totalSalaryS.monthDuration($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', $rootScope.dt.Date, memberId);
					scope.getCurrentSalary = (memberId, monthNumber) => totalSalaryS.salary($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', memberId, monthNumber);
					scope.getPercentage = (memberId) => {
						let country = nationalityS.membersNationality(memberId, $rootScope.calendarCards, $rootScope.calendarLists); /** get members nationality */
						let possibleWork = totalSalaryS.prevMonthsToWorkDates($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', $rootScope.dt.Date, memberId); /** all working days holidays not considered */
						let totalToWork = holidayS.datesHoliday(country, $rootScope.dt.year, $rootScope.calendarLists, $rootScope.calendarCards, possibleWork); /** all the working days with holidays remove */
						let allDates =  totalSalaryS.betweenDates(new Date(`${$rootScope.dt.Date.getFullYear()}/01/1`), $rootScope.dt.Date, true); /** we get all the Dates */
						let prevMonthsDates = totalSalaryS.prevMonthsDate(allDates); /** we get all the dates from jan 1 to last Day of last month */
						let prevMonthsWork = weekS.getDaysTotalOutput(prevMonthsDates, memberId, $rootScope.boardLists, $rootScope.boardCards); /** all the days members have worked */
						let annualLeave = totalToWork - prevMonthsWork; /** annual Leave used */

						let currentMonthsDate = monthS.monthsNeedtoWork($rootScope.dt.year, $rootScope.dt.month); /** dates of current Month */
						let currentToWork = holidayS.datesHoliday(country, $rootScope.dt.year, $rootScope.calendarLists, $rootScope.calendarCards, currentMonthsDate);
						let currentWorked = monthS.getMonthsValue($rootScope.dt.year, $rootScope.dt.month, $rootScope.boardLists, memberId, $rootScope.boardCards);
													
						return currentWorked + '/'+ currentToWork + '  annualLeave:  ' + annualLeave
					}
					scope.getBonuse = () => '(the Bonuse)';
					scope.getTotalSalary = () => 'the total www';
				}
				initialize();
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/salary/directives/totalSalaryDir.html",
		}
	});

'use strict';

angular.module('workingHoursTrello')
	.directive('salaryDir', function ($rootScope, apiS, totalSalaryS, nationalityS, holidayS, weekS) {
		return {
			link : function(scope, element, attrs){
          		function initialize() {
					apiS.getBoardLists().then((response) => scope.boardLists = response.data /**  Get Boards Lists */);
					apiS.getBoardCards().then((response) => scope.boardCards = response.data /** Get Boards Cards */);
					apiS.getBoardMembers().then((response) => scope.boardMembers = response.data /** Get Boards Members */);
					
					apiS.calendarBoardLists().then((response) => scope.calendarLists = response.data /**  Get Boards Lists */);
					apiS.calendarBoardCards().then((response) => scope.calendarCards = response.data /** Get Boards Cards */);
					scope.menuItem = ['months', 'salary', 'percentage', 'bonuse', 'total salary'];
					scope.getMonthDuration = (memberId) => totalSalaryS.monthDuration(scope.calendarLists, scope.calendarCards, 'ENTERING DATE', $rootScope.dt.Date, memberId);
					scope.getCurrentSalary = (memberId, monthNumber) => totalSalaryS.salary(scope.calendarLists, scope.calendarCards, 'ENTERING DATE', memberId, monthNumber);
					scope.getPercentage = (memberId) => {
						let country = nationalityS.membersNationality(memberId, scope.calendarCards, scope.calendarLists); /** get members nationality */
						let possibleWork = totalSalaryS.possibleWorkingDates(scope.calendarLists, scope.calendarCards, 'ENTERING DATE', $rootScope.dt.Date, memberId) /** all working days holidays not considered */
						let datesHoliday = holidayS.datesHoliday(country, $rootScope.dt.year, scope.calendarLists, scope.calendarCards, possibleWork); /** all the working days holidays remove */
						let allDates =  totalSalaryS.betweenDates(new Date(`${$rootScope.dt.Date.getFullYear()}/01/1`), $rootScope.dt.Date, true)
						let workedCards = weekS.getDaysTotalOutput(allDates, memberId, scope.boardLists, scope.boardCards);
						return datesHoliday + '-' + workedCards
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

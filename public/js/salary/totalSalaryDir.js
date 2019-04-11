'use strict';

angular.module('workingHoursTrello')
	.directive('salaryDir', function ($rootScope, apiS, totalSalaryS) {
		return {
			link : function(scope, element, attrs){
          		function initialize() {
					apiS.getBoardMembers().then((response) => scope.boardMembers = response.data /** Get Boards Members */);
					apiS.calendarBoardLists().then((response) => scope.calendarLists = response.data /**  Get Boards Lists */);
					apiS.calendarBoardCards().then((response) => scope.calendarCards = response.data /** Get Boards Cards */);
					scope.menuItem = ['months', 'salary', 'percentage', 'bonuse', 'total salary'];
					scope.getMonthDuration = (memberId) => totalSalaryS.monthDuration(scope.calendarLists, scope.calendarCards, 'ENTERING DATE', $rootScope.dt.Date, memberId);
					// scope.getMonthDuration = (memberId) => totalSalaryS.monthDuration(scope.calendarLists, scope.calendarCards, 'ENTERING DATE', new Date('2020/11/14'), memberId );
					scope.getCurrentSalary = (memberId, monthNumber) => totalSalaryS.salary(scope.calendarLists, scope.calendarCards, 'ENTERING DATE', memberId, monthNumber);
					scope.getPercentage = () => '100%';
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

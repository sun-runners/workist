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
					scope.getMonthDuration = (memberId) => totalSalaryS.monthDuration(scope.calendarLists, scope.calendarCards ,memberId , $rootScope.dt.Date, 'ENTERING DATE');
					scope.getCurrentSalary = () => '$13,000';
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

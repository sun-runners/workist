'use strict';

angular.module('workingHoursTrello')
	.directive('thirteenDir', function ($rootScope, totalSalaryS, taskS, timeS, bonuseS) {
		return {
			link : function(scope){
          		function initialize() {
					scope.menuItem = ['Name', 'months', 'basic salary', 'total'];
					scope.getMonthDuration = (memberId) => {
						try {
							const listId = totalSalaryS.getListByName($rootScope.calendarLists, 'ENTERING DATE');
							const entryDate = totalSalaryS.getEntryDate($rootScope.calendarCards, listId, memberId);
							let dateDuration;
							if (entryDate.getFullYear() == $rootScope.dt.year) {
								dateDuration = totalSalaryS.diffInMonths(entryDate, $rootScope.dt.Date);
								// dateDuration = totalSalaryS.diffInMonths(entryDate, new Date("2019/12/15"));
							}else{
								const year = $rootScope.dt.year;
								dateDuration = totalSalaryS.diffInMonths(new Date(+year+'/01/01'), $rootScope.dt.Date) 
								// dateDuration = totalSalaryS.diffInMonths(new Date(+year+'/01/01'), new Date("2019/12/15"))
							}
							return dateDuration
						} catch (error) {}
					}
					scope.getCurrentSalary = (memberId) => {
						const monthNumber = totalSalaryS.monthDuration($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', $rootScope.dt.Date, memberId);
						return totalSalaryS.salary($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', memberId, monthNumber);}
					scope.formatSalary = (salary) => {
						try {
							return salary.toLocaleString() + " PHP";
						} catch (error) {}
					}
					scope.getBonuse = (memberId) => {
						const monthlyTask = taskS.monthlyTasks($rootScope.dt.year, $rootScope.dt.month, $rootScope.boardLists, memberId, $rootScope.boardCards);				
						const monthlyTime = timeS.monthlyTime($rootScope.dt.year, $rootScope.dt.month, $rootScope.boardLists, memberId, $rootScope.boardCards);
						const bonuse = bonuseS.bonuseTime($rootScope.dt.year, $rootScope.dt.month, $rootScope.boardMembers, $rootScope.boardLists, $rootScope.boardCards, $rootScope.calendarCards);
						try {
							if (memberId == bonuse.leader) {
								return {bonuse:"LEADER", value:10000}
							}else if (monthlyTask == bonuse.winTask) {
								return {bonuse:"TASKS", value:5000}
							}else if (monthlyTime == bonuse.winTime) {
								return {bonuse:'TIME', value:5000}
							}else{
								return {bonuse:'', value:0}
							}
						} catch (error) {}
					};
                    scope.totalThirteen = (salary, monthDuration, memberId) => {
						try {
							const bonuse = scope.getBonuse(memberId)
							return Math.ceil(((salary * monthDuration)/12) + bonuse.value).toLocaleString() + " PHP";
						} catch (error) {}
					}
				}
				initialize();
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../template/salary/directives/thirteenDir.html",
		}
	});

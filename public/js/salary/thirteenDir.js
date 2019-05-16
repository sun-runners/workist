'use strict';

angular.module('workingHoursTrello')
	.directive('thirteenDir', function ($rootScope, totalSalaryS, taskS, timeS, bonuseS) {
		return {
			link : function(scope, element, attrs){
          		function initialize() {
					scope.menuItem = ['Name', 'months', 'basic salary', 'total'];
					scope.memberId = "5c32e94ce49690729ecd0794";
					scope.getMonthDuration = (memberId) => {
						let listId = totalSalaryS.getListByName($rootScope.calendarLists, 'ENTERING DATE');
						let entryDate = totalSalaryS.getEntryDate($rootScope.calendarCards, listId, memberId);
						let dateDuration;
						if (entryDate.getFullYear() == $rootScope.dt.year) {
							return dateDuration = totalSalaryS.diffInMonths(entryDate, $rootScope.dt.Date);
						}else{
							return dateDuration = totalSalaryS.diffInMonths(new Date('2019/01/01'), $rootScope.dt.Date)
						}

						// return $rootScope.dt.year
					}
						// totalSalaryS.monthDuration($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', $rootScope.dt.Date, memberId);}
					// scope.getMonthDuration = (memberId) => totalSalaryS.monthDuration($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', new Date('2019/12/7'), memberId);
					scope.getCurrentSalary = (memberId) => {
						let  monthNumber = totalSalaryS.monthDuration($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', $rootScope.dt.Date, memberId);
						return totalSalaryS.salary($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', memberId, monthNumber);}
					scope.formatSalary = (salary) => {
						try {
							return salary.toLocaleString() + " PHP";
						} catch (error) {}
					}
					scope.getBonuse = (memberId) => {
						let monthlyTask = taskS.monthlyTasks($rootScope.dt.year, $rootScope.dt.month, $rootScope.boardLists, memberId, $rootScope.boardCards);				
						let monthlyTime = timeS.monthlyTime($rootScope.dt.year, $rootScope.dt.month, $rootScope.boardLists, memberId, $rootScope.boardCards);
						let bonuse = bonuseS.bonuseTime($rootScope.dt.year, $rootScope.dt.month, $rootScope.boardMembers, $rootScope.boardLists, $rootScope.boardCards, $rootScope.calendarCards);
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
							let bonuse = scope.getBonuse(memberId)
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

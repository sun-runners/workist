'use strict';

angular.module('workingHoursTrello')
	.directive('salaryDir', function ($rootScope, totalSalaryS, nationalityS, holidayS, weekS, monthS, taskS, timeS, bonuseS) {
		return {
			link : function(scope, element, attrs){
          		function initialize() {
					scope.notEmployees = ['53ca58ad2018034bbeb54e29', '5a2de2c831a41435d465e564'];
					scope.menuItem = ['months', 'salary', 'percentage', 'bonuse', 'total salary'];
					scope.getMonthDuration = (memberId) => totalSalaryS.monthDuration($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', $rootScope.dt.Date, memberId);
					// scope.getMonthDuration = (memberId) => totalSalaryS.monthDuration($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', new Date('2019/05/30'), memberId);
					scope.getCurrentSalary = (memberId, monthNumber) => totalSalaryS.salary($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', memberId, monthNumber);
					scope.getPercentage = (memberId) => {
						// We get the number of annual leave currently used
						let country = nationalityS.membersNationality(memberId, $rootScope.calendarCards, $rootScope.calendarLists); /** get members nationality */
						let possibleWork = totalSalaryS.prevMonthsToWorkDates($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', $rootScope.dt.Date, memberId); /** all working days holidays not considered */
						let prevMonthToWork = holidayS.datesWithoutHoliday(country, $rootScope.dt.year, $rootScope.calendarLists, $rootScope.calendarCards, possibleWork); /** all the working days with holidays remove */
						let allDatesToNow =  totalSalaryS.betweenDates(new Date(`${$rootScope.dt.Date.getFullYear()}/01/1`), $rootScope.dt.Date, true); /** we get all the Dates */
						let prevMonthsDates = totalSalaryS.prevMonthsDate(allDatesToNow); /** we get all the dates from jan 1 to last Day of last month */
						let prevMonthsWork = weekS.getDaysTotalOutput(prevMonthsDates, memberId, $rootScope.boardLists, $rootScope.boardCards); /** all the days members have worked */
						let usedLeave = prevMonthToWork - prevMonthsWork; /** annual Leave used */
						// We get the annual Leave members have
						let myAnnualLeave = totalSalaryS.annualLeaves($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', $rootScope.dt.Date, memberId) /** annual leave up to now */
						// We get the available annual Leave
						let availableLeave = myAnnualLeave - usedLeave /** available annual Leave */
						// We get the number of days to work for this month
						let currentMonthsDate = monthS.monthsNeedtoWork($rootScope.dt.year, $rootScope.dt.month); /** dates of current Month */
						let monthToWork = holidayS.datesWithoutHoliday(country, $rootScope.dt.year, $rootScope.calendarLists, $rootScope.calendarCards, currentMonthsDate);  /** this month current month to Work */
						// We get the number of days to work until now
						let monthStarted = new Date($rootScope.dt.year + '/' + $rootScope.dt.month + '/1');
						let monthToNow = totalSalaryS.betweenDates(monthStarted, $rootScope.dt.Date);
						let daysToWork = holidayS.datesWithoutHoliday(country, $rootScope.dt.year, $rootScope.calendarLists, $rootScope.calendarCards, monthToNow);
						// We get the number of days have worked 
						let currentWorked = monthS.getMonthsValue($rootScope.dt.year, $rootScope.dt.month, $rootScope.boardLists, memberId, $rootScope.boardCards);
						while (daysToWork > currentWorked) {
							if (availableLeave > 0) {
								currentWorked = currentWorked + 0.5;
								availableLeave = availableLeave - 0.5;
							}else{ break;}
						}
						return totalSalaryS.percentage(currentWorked, monthToWork);
						// return "annual Leave: "+ myAnnualLeave + " Used Leave: " + usedLeave + " Available Leave: " + availableLeave;
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
					scope.formatBonuse = (bonuse) => {
						try {
							if (bonuse.value != 0) {
								return parseInt(bonuse.value).toLocaleString() + " PHP ( " + bonuse.bonuse + " )";
							}else{
								return "-";
							}
						} catch (error) {}
					}
					scope.formatSalary = (salary) => {
						try {
							return salary.toLocaleString() + " PHP"
						} catch (error) {}
					}
					scope.getTotalSalary = (monthNumber, salary, percentage, bonuse, memberId) => {
						try {
							let oldSalary = totalSalaryS.salary($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', memberId, monthNumber - 1);
							let totalSalary = totalSalaryS.totalSalary(monthNumber, salary, oldSalary,  $rootScope.calendarLists, $rootScope.calendarCards, memberId, 'ENTERING DATE');
							if (percentage < 100 && percentage > 0) {
								return (totalSalary * parseFloat("0."+percentage)) + bonuse;
							}else if(percentage == 0){
								return 0
							}else{
								return totalSalary + bonuse;
							}
						} catch (error) {}
					}
				}
				initialize();
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/salary/directives/totalSalaryDir.html",
		}
	});

'use strict';

angular.module('workingHoursTrello')
	.directive('privateDir', function ($rootScope,  totalSalaryS, birthdayS, holidayS, weekS, monthS, taskS, timeS, bonuseS) {
		return {
			link : function(scope, element, attrs){
          		function initialize() {
					scope.menuItem = ['month', 'months', 'basic salary', 'percentage', 'bonus', 'total salary'];

					scope.getCurrentSalary = (memberId, monthDate) => {
						const lastDateOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth()+1, 0)
						const thisMonthNumber = totalSalaryS.monthDuration($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', lastDateOfMonth, memberId);
						const salary = totalSalaryS.salary($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', memberId, thisMonthNumber);
						return salary;
					}
					scope.formatSalary = (salary) => {
						try {
							return salary.toLocaleString() + " PHP"
						} catch (error) {}
					}
					scope.getPercentage = (memberId, nationality, workedDate, workedYear, workedMonth) => {
						// We get the number of annual leave currently used
						const possibleWork = totalSalaryS.prevMonthsToWorkDates($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', workedDate, memberId); /** for this month all working days holidays not considered */
						const filterPrevBirthday = birthdayS.removeBirthdate(memberId, $rootScope.calendarLists, $rootScope.calendarCards, "BIRTHDAY", possibleWork); /** remove birthday from array dates */
						const prevMonthToWork = holidayS.datesWithoutHoliday(nationality, workedYear, $rootScope.calendarLists, $rootScope.calendarCards, filterPrevBirthday); /** all the working days with holidays remove */	
						const allDatesToNow =  totalSalaryS.betweenDates(new Date(`${workedDate.getFullYear()}/01/1`), new Date(workedYear, workedMonth, 0), true); /** we get all the Dates */
						const prevDates = totalSalaryS.prevDate(allDatesToNow, workedDate); /** we get all the previous dates */
						const prevMonthsWork = weekS.getDaysTotalOutput(prevDates, memberId, $rootScope.boardLists, $rootScope.boardCards); /** all the days members have worked */
						const usedLeave = prevMonthToWork - prevMonthsWork; /** annual Leave used */
						// We get the annual Leave members have
						const myAnnualLeave = totalSalaryS.annualLeaves($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', workedDate, memberId) /** annual leave up to now */
						// We get the available annual Leave
						let availableLeave = myAnnualLeave - usedLeave /** available annual Leave */
						// We get the number of days to work for this month
						const currentMonthsDate = monthS.monthsNeedtoWork(workedYear, workedMonth); /** dates of current Month */
						const filterBirthMonthly = birthdayS.removeBirthdate(memberId, $rootScope.calendarLists, $rootScope.calendarCards, "BIRTHDAY", currentMonthsDate); /** remove birthday from array dates */
						const monthToWork = holidayS.datesWithoutHoliday(nationality, workedYear, $rootScope.calendarLists, $rootScope.calendarCards, filterBirthMonthly);  /** this month current month to Work */
						// We get the number of days to work until now
						let monthStarted = new Date(workedYear + '/' + workedMonth + '/1');
						let monthToNow;
						if (workedMonth == new Date().getMonth() + 1) {
							monthToNow = totalSalaryS.betweenDates(monthStarted, new Date());
						}else{
							monthToNow = totalSalaryS.betweenDates(monthStarted, workedDate);
						}
						let filterBirthToNow = birthdayS.removeBirthdate(memberId, $rootScope.calendarLists, $rootScope.calendarCards, "BIRTHDAY", monthToNow);
						let daysToWork = holidayS.datesWithoutHoliday(nationality, workedYear, $rootScope.calendarLists, $rootScope.calendarCards, filterBirthToNow);
						// We get the number of days have worked 
						let currentWorked = monthS.getMonthsValue(workedYear, workedMonth, $rootScope.boardLists, memberId, $rootScope.boardCards);
						let datesToWork = null;
						if (workedDate.getMonth() == new Date().getMonth() && workedYear == new Date().getFullYear()) {
							datesToWork = daysToWork;
						}else{
							datesToWork = monthToWork;
						}
						while (datesToWork > currentWorked) {
							if (availableLeave > 0) {
								currentWorked = currentWorked + 0.5;
								availableLeave = availableLeave - 0.5;
							}else{ break;}
						}
						let percentage =  totalSalaryS.percentage(currentWorked, monthToWork);
						return percentage
						// return "annual Leave: "+ myAnnualLeave + " Used Leave: " + usedLeave + " Available Leave: " + availableLeave + " --- " +  monthToWork + " Worked :" + currentWorked;
						// return daysToWork + " - " + currentWorked + " available leave " + availableLeave
					}
					scope.getBonuse = (memberId, workYear, workMonth) => {
						let monthlyTask = taskS.monthlyTasks(workYear, workMonth, $rootScope.boardLists, memberId, $rootScope.boardCards);				
						const monthlyTime = timeS.monthlyTime(workYear, workMonth, $rootScope.boardLists, memberId, $rootScope.boardCards);
						const bonuse = bonuseS.bonuseWinners(workYear, workMonth, $rootScope.boardMembers, $rootScope.boardLists, $rootScope.boardCards, $rootScope.calendarCards);
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
								return "0 PHP";
							}
						} catch (error) {}
						return bonuse
					}
					scope.getTotalSalary = (salary, percentage = 0, bonuse = 0, monthDuration, enterDate) => {
						let mySalary = salary;
						const enterDay = new Date(enterDate).getDate();
						const remainingDay = 30 - enterDay;
						if (monthDuration < 12) {
							if (monthDuration == 6 || monthDuration == 12) {
								const currentSalary = salary - 5000;
								mySalary =  Math.ceil(((currentSalary * enterDay) + (salary * remainingDay))/30);
							}
						}else{
							if (monthDuration % 12 === 0) {
								const currentSalary = salary - 5000;
								mySalary =  Math.ceil(((currentSalary * enterDay) + (salary * remainingDay))/30);
							}
						}
						if (percentage < 100 && percentage > 0) {
							return (mySalary * parseFloat(percentage/100)) + bonuse;
						}else if(percentage == 0){
							return 0
						}else{
							return mySalary + bonuse;
						}
					}
				}
				initialize();
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../template/salary/directives/privateSalaryDir.html",
		}
	});

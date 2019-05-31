'use strict';

angular.module('workingHoursTrello')
	.directive('privateDir', function ($rootScope,  totalSalaryS, nationalityS, birthdayS, holidayS, weekS, monthS, taskS, timeS, bonuseS) {
		return {
			link : function(scope, element, attrs){
          		function initialize() {
					scope.menuItem = ['month', 'months', 'basic salary', 'percentage', 'bonus', 'total salary'];

					scope.getCurrentSalary = (memberId, monthNumber) => totalSalaryS.salary($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', memberId, monthNumber);
					scope.formatSalary = (salary) => {
						try {
							return salary.toLocaleString() + " PHP"
						} catch (error) {}
					}
					scope.getPercentage = (memberId, nationality, date, year, month) => {
						// We get the number of annual leave currently used
						let country = nationalityS.membersNationality(memberId, $rootScope.calendarCards, $rootScope.calendarLists); /** get members nationality */
						let possibleWork = totalSalaryS.prevMonthsToWorkDates($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', date, memberId); /** for this month all working days holidays not considered */
						let filterPrevBirthday = birthdayS.removeBirthdate(memberId, $rootScope.calendarLists, $rootScope.calendarCards, "BIRTHDAY", possibleWork); /** remove birthday from array dates */
						let prevMonthToWork = holidayS.datesWithoutHoliday(country, year, $rootScope.calendarLists, $rootScope.calendarCards, filterPrevBirthday); /** all the working days with holidays remove */	
						let allDatesToNow =  totalSalaryS.betweenDates(new Date(`${date.getFullYear()}/01/1`), date, true); /** we get all the Dates */
						let prevDates = totalSalaryS.prevDate(allDatesToNow, date); /** we get all the previous dates */
						let prevMonthsWork = weekS.getDaysTotalOutput(prevDates, memberId, $rootScope.boardLists, $rootScope.boardCards); /** all the days members have worked */
						let usedLeave = prevMonthToWork - prevMonthsWork; /** annual Leave used */
						// We get the annual Leave members have
						let myAnnualLeave = totalSalaryS.annualLeaves($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', date, memberId) /** annual leave up to now */
						// We get the available annual Leave
						let availableLeave = myAnnualLeave - usedLeave /** available annual Leave */
						// We get the number of days to work for this month
						let currentMonthsDate = monthS.monthsNeedtoWork(year, month); /** dates of current Month */
						let filterBirthMonthly = birthdayS.removeBirthdate(memberId, $rootScope.calendarLists, $rootScope.calendarCards, "BIRTHDAY", currentMonthsDate); /** remove birthday from array dates */
						let monthToWork = holidayS.datesWithoutHoliday(country, year, $rootScope.calendarLists, $rootScope.calendarCards, filterBirthMonthly);  /** this month current month to Work */
						// We get the number of days to work until now
						let monthStarted = new Date(year + '/' + month + '/1');
						let monthToNow;
						if (month == new Date().getMonth() + 1) {
							monthToNow = totalSalaryS.betweenDates(monthStarted, new Date());
						}else{
							monthToNow = totalSalaryS.betweenDates(monthStarted, date);
						}
						
						let filterBirthToNow = birthdayS.removeBirthdate(memberId, $rootScope.calendarLists, $rootScope.calendarCards, "BIRTHDAY", monthToNow);
						let daysToWork = holidayS.datesWithoutHoliday(country, year, $rootScope.calendarLists, $rootScope.calendarCards, filterBirthToNow);
						// We get the number of days have worked 
						let currentWorked = monthS.getMonthsValue(year, month, $rootScope.boardLists, memberId, $rootScope.boardCards);
						let datesToWork = null;
						if (date.getMonth() == new Date().getMonth() && year == new Date().getFullYear()) {
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
						// return monthToNow + "   = = =  " + date;
						// return "annual Leave: "+ myAnnualLeave + " Used Leave: " + usedLeave + " Available Leave: " + availableLeave + " --- " +  monthToWork + " Worked :" + currentWorked;
						// return daysToWork + " - " + currentWorked + " available leave " + availableLeave
					}
					// console.log($rootScope.myMonths);
					scope.monthWorked = () => {
						console.log(1)
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

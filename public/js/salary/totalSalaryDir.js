'use strict';

angular.module('workingHoursTrello')
	.directive('salaryDir', function ($rootScope, totalSalaryS, nationalityS, birthdayS, holidayS, weekS, monthS, taskS, timeS, bonuseS) {
		return {
			link : function(scope, element, attrs){
          		function initialize() {
					scope.notEmployees = ['53ca58ad2018034bbeb54e29', '5a2de2c831a41435d465e564'];
					scope.menuItem = ['months', 'basic salary', 'percentage', 'bonus', 'total salary'];
					scope.getMonthDuration = (memberId) => totalSalaryS.monthDuration($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', $rootScope.dt.Date, memberId);
					// scope.getMonthDuration = (memberId) => totalSalaryS.monthDuration($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', new Date('2019/05/30'), memberId);
					scope.getCurrentSalary = (memberId, monthNumber) => totalSalaryS.salary($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', memberId, monthNumber);
					scope.getPercentage = (memberId, nationality) => {
						// We get the number of annual leave currently used
						let possible_work = totalSalaryS.prevMonthsToWorkDates($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', $rootScope.dt.Date, memberId); /** for this month all working days holidays not considered */
						let filter_prev_birthday = birthdayS.removeBirthdate(memberId, $rootScope.calendarLists, $rootScope.calendarCards, "BIRTHDAY", possible_work); /** remove birthday from array dates */
						let prev_month_to_work = holidayS.datesWithoutHoliday(nationality, $rootScope.dt.year, $rootScope.calendarLists, $rootScope.calendarCards, filter_prev_birthday); /** all the working days with holidays remove */	
						let all_dates_to_now =  totalSalaryS.betweenDates(new Date(`${$rootScope.dt.Date.getFullYear()}/01/1`), $rootScope.dt.Date, true); /** we get all the Dates */
						let prev_dates = totalSalaryS.prevDate(all_dates_to_now, $rootScope.dt.Date); /** we get all the previous dates */
						let prev_monthsWork = weekS.getDaysTotalOutput(prev_dates, memberId, $rootScope.boardLists, $rootScope.boardCards); /** all the days members have worked */
						let used_leave = prev_month_to_work - prev_monthsWork; /** annual Leave used */
						// We get the annual Leave members have
						let my_annual_leave = totalSalaryS.annualLeaves($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', $rootScope.dt.Date, memberId) /** annual leave up to now */
						// We get the available annual Leave
						let available_leave = my_annual_leave - used_leave /** available annual Leave */
						// We get the number of days to work for this month
						let current_months_date = monthS.monthsNeedtoWork($rootScope.dt.year, $rootScope.dt.month); /** dates of current Month */
						let filter_birth_monthly = birthdayS.removeBirthdate(memberId, $rootScope.calendarLists, $rootScope.calendarCards, "BIRTHDAY", current_months_date); /** remove birthday from array dates */
						let month_to_work = holidayS.datesWithoutHoliday(nationality, $rootScope.dt.year, $rootScope.calendarLists, $rootScope.calendarCards, filter_birth_monthly);  /** this month current month to Work */
						// We get the number of days to work until now
						let month_started = new Date($rootScope.dt.year + '/' + $rootScope.dt.month + '/1');
						let month_to_now = totalSalaryS.betweenDates(month_started, $rootScope.dt.Date);
						let filter_birth_to_now = birthdayS.removeBirthdate(memberId, $rootScope.calendarLists, $rootScope.calendarCards, "BIRTHDAY", month_to_now);
						let days_to_work = holidayS.datesWithoutHoliday(nationality, $rootScope.dt.year, $rootScope.calendarLists, $rootScope.calendarCards, filter_birth_to_now);
						// We get the number of days have worked 
						let current_worked = monthS.getMonthsValue($rootScope.dt.year, $rootScope.dt.month, $rootScope.boardLists, memberId, $rootScope.boardCards);
						let dates_to_work = null;
						if ($rootScope.dt.Date.getMonth() == new Date().getMonth() && $rootScope.dt.year == new Date().getFullYear()) {
							dates_to_work = days_to_work;
						}else{
							dates_to_work = month_to_work;
						}
						while (dates_to_work > current_worked) {
							if (available_leave > 0) {
								current_worked = current_worked + 0.5;
								available_leave = available_leave - 0.5;
							}else{ break;}
						}
						let percentage =  totalSalaryS.percentage(current_worked, month_to_work);
						return percentage
						// return "annual Leave: "+ my_annual_leave + " Used Leave: " + used_leave + " Available Leave: " + available_leave + " --- " +  month_to_work + " Worked :" + current_worked;
						// return daysToWork + " - " + current_worked + " available leave " + available_leave
					}
					scope.getBonuse = (memberId) => {
						let monthly_task = taskS.monthlyTasks($rootScope.dt.year, $rootScope.dt.month, $rootScope.boardLists, memberId, $rootScope.boardCards);				
						let monthly_time = timeS.monthlyTime($rootScope.dt.year, $rootScope.dt.month, $rootScope.boardLists, memberId, $rootScope.boardCards);
						let bonuse = bonuseS.bonuseWinners($rootScope.dt.year, $rootScope.dt.month, $rootScope.boardMembers, $rootScope.boardLists, $rootScope.boardCards, $rootScope.calendarCards);
						try {
							if (memberId == bonuse.leader) {
								return {bonuse:"LEADER", value:10000}
							}else if (monthly_task == bonuse.winTask) {
								return {bonuse:"TASKS", value:5000}
							}else if (monthly_time == bonuse.winTime) {
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
						return bonuse
					}
					scope.formatSalary = (salary) => {
						try {
							return salary.toLocaleString() + " PHP"
						} catch (error) {}
					}
					scope.getTotalSalary = (monthNumber, salary, percentage, bonuse = 0, memberId) => {
						try {
							let old_salary = totalSalaryS.salary($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', memberId, monthNumber - 1);
							let total_salary = totalSalaryS.totalSalary(monthNumber, salary, old_salary,  $rootScope.calendarLists, $rootScope.calendarCards, memberId, 'ENTERING DATE');
							if (percentage < 100 && percentage > 0) {
								return (total_salary * parseFloat(percentage/100)) + bonuse;
							}else if(percentage == 0){
								return 0
							}else{
								return total_salary + bonuse;
							}
						} catch (error) {}
					}
				}
				initialize();
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../template/salary/directives/totalSalaryDir.html", /** if initialize from workTimist */
			// templateUrl: "../../template/salary/directives/totalSalaryDir.html", 
		}
	});

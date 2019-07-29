'use strict';

angular.module('workingHoursTrello')
	.directive('salaryDir', function ($rootScope, totalSalaryS, nationalityS, birthdayS, holidayS, weekS, monthS, taskS, timeS, bonuseS) {
		return {
			link : function(scope, element, attrs){
          		function initialize() {
					scope.notEmployees = ['53ca58ad2018034bbeb54e29', '5a2de2c831a41435d465e564'];
					scope.menuItem = ['months', 'basic salary', 'percentage', 'bonus', 'total salary'];
					let moment_original = $rootScope.moment.clone();
					let thisDate = moment_original;
					scope.getMonthDuration = (memberId) => totalSalaryS.monthDuration($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', $rootScope.dt.Date, memberId);
					// scope.getMonthDuration = (memberId) => totalSalaryS.monthDuration($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', new Date('2019/05/30'), memberId);
					scope.getCurrentSalary = (memberId, monthNumber) => totalSalaryS.salary($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', memberId, monthNumber);
					const getMonthlyToWork = (memberId, month, nationality, entry) => {
						const entered_date = new Date(entry);
						const started_full_date =  `${entered_date.getFullYear()}/${entered_date.getMonth()+1}/${entered_date.getDate()}`;
						const end_date = new Date($rootScope.dt.year, month, 0).getDate();
						const end_full_date = `${$rootScope.dt.year}/${month}/${end_date}`;
	
						let toWork;
						if (entered_date.getFullYear() == $rootScope.dt.year && entered_date.getMonth()+1 == month) {
							const month_to_work = monthS.monthsNeedtoWork(thisDate.year(), month);
							toWork = monthS.getInBetweenDates(month_to_work, started_full_date, end_full_date) 
	
						}else{
							toWork = monthS.monthsNeedtoWork(thisDate.year(), month); /** get the total days to work whith holiday not a factor  */
						}
						let filterPrevBirthday = birthdayS.removeBirthdate(memberId, $rootScope.calendarLists, $rootScope.calendarCards, "BIRTHDAY", toWork);
						return holidayS.datesWithoutHoliday(nationality, $rootScope.dt.year, $rootScope.calendarLists, $rootScope.calendarCards, filterPrevBirthday);
					}
					scope.getPercentage = (memberId, nationality, entry, workedData) => {
						// this will hold all the months woth annual leave available
						let monthly_annual = [];
						//  we will now get the annual leave of the previous months
						for (let y = 0; y < workedData.length; y++) {
							const month_data = workedData[y];
						
							if (month_data.month == $rootScope.dt.month) {
								break;
							};
							// we get the total days of the month members must work
							const monthToWork = getMonthlyToWork(memberId, month_data.month, nationality, entry);
							const worked = (month_data.monthWorked + 1) - monthToWork;
							const score = worked < 0 ? worked : worked > 1 ? 1 : worked;
							monthly_annual.push(score);
						}
						let annual_leave;
						for (let i = 0; i < monthly_annual.length; i++) {
							const value = monthly_annual[i];
							if (annual_leave == undefined) {
								annual_leave = value;
							}else{
								if (annual_leave > 0) {
									annual_leave = value + annual_leave;
								}else{
									annual_leave = value;
								}
							}
						}
						// we add 1, every month annual leave will increase
						let available_leave = annual_leave + 1
						// return available_leave
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

'use strict';

angular.module('workingHoursTrello')
	.directive('yearlyDir', function ($rootScope, monthS, yearS, holidayS, totalSalaryS, birthdayS) {
		return {
			link : function(scope, element, attrs){

				// Initialize Function Section
				var initialize = function(){
					let moment_original = $rootScope.moment.clone();
					scope.thisDate = moment_original;
					scope.months = [
						{month: "Jan", value: 1},{month: "Feb",value:2},
						{month:"Mar", value: 3},{month:"Apr", value: 4},{month:"May", value: 5},{month:"Jun", value: 6},
						{month: "Jul", value: 7},{month:"Aug", value:8},{month:"Sep", value: 9},{month:"Oct",value:10}, {month:"Nov",value:11},{month:"Dec", value:12}
						];	
				};
				initialize();

				scope.getMonthlyToWork = (memberId, month, nationality) => {
					let toWork = monthS.monthsNeedtoWork(scope.thisDate.year(), month); /** get the total days to work whith holiday not a factor  */
					let filterPrevBirthday = birthdayS.removeBirthdate(memberId, $rootScope.calendarLists, $rootScope.calendarCards, "BIRTHDAY", toWork);
					return holidayS.datesWithoutHoliday(nationality, $rootScope.dt.year, $rootScope.calendarLists, $rootScope.calendarCards, filterPrevBirthday);
				}
				scope.getAnnualLeave = (memberId, nationality, entry, workedData) => {
					const entry_date = new Date(entry);
					if (entry == undefined) {
						return "";
					}
					// this will hold all the months woth annual leave available
					let monthly_annual = [];
					//  we will now get the annual leave with months
					for (let y = 0; y < workedData.length; y++) {
						const month_data = workedData[y];
					
						if (month_data.month == new Date().getMonth() + 1) {
							const currently_worked = month_data.monthWorked;
							const dates_to_now = totalSalaryS.betweenDates(	new Date(`${$rootScope.dt.year}/${$rootScope.dt.month}/01`), 
																			new Date(`${$rootScope.dt.year}/${$rootScope.dt.month}/${new Date().getDate()}`
																			));
							const filter_prev_birthday = birthdayS.removeBirthdate(memberId, $rootScope.calendarLists, $rootScope.calendarCards, "BIRTHDAY", dates_to_now);
							const days_to_work_till_now = holidayS.datesWithoutHoliday(nationality, $rootScope.dt.year, $rootScope.calendarLists, $rootScope.calendarCards, filter_prev_birthday)
							const worked = currently_worked - days_to_work_till_now;
							monthly_annual.push(worked + 1);
							break;
						};
						// we get the total days of the month members must work
						const monthToWork = scope.getMonthlyToWork(memberId, month_data.month, nationality);
						const worked = (month_data.monthWorked + 1) - monthToWork;
						const score = worked < 0 ? worked : worked > 1 ? 1 : worked;
						monthly_annual.push(score);
					}
					let prev_value;
					for (let i = 0; i < monthly_annual.length; i++) {
						const value = monthly_annual[i];
						if (prev_value == undefined) {
							prev_value = value;
						}else{
							if (prev_value > 0) {
								prev_value = value + prev_value;
							}else{
								prev_value = value;
							}
						}
					}
					return prev_value;
					// we add + 1 to available annual leave to include annual leave of theis
				}
				scope.getYearlyToWork = (nationality) => {
					let toWork = yearS.yearsNeedToWork($rootScope.dt.year, scope.months); /** get the total days to work whith holiday not a factor  */
					return holidayS.datesWithoutHoliday(nationality, $rootScope.dt.year, $rootScope.calendarLists, $rootScope.calendarCards, toWork);
				}
				scope.showMonthly = (work, toWork) => (work != 0) ? work+' / '+toWork : '-';
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../template/statistics/directives/yearlyDir.html" /** if Initialize from workTimist.html */
			// templateUrl: "../../template/statistics/directives/yearlyDir.html"
		}
	});

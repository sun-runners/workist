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
					scope.months.forEach(month => {
						let date = new Date(scope.thisDate.year(), month.value - 1, 1);
						let result = [];
						while (date.getMonth() == month.value - 1) {
							result.push({
								Date: new Date(date.getFullYear()+ "/" + (date.getMonth() + 1) +"/"+ date.getDate())
							});
							date.setDate(date.getDate() + 1);
						}
						month.dates = result;
					})
				};
				initialize();

				scope.getMonthlyWork = (month, member) =>  member.workedData[month.value-1].monthWorked;

				scope.getMonthlyNeedWork = (month, member) => {
					
					const monthWeeksDates = month.dates.map(item => item).flat(Infinity);
					const foundCurrentHolidays = $rootScope.holidays.find(holiday => {
						if (member.nationality) {
							return holiday.country.toLowerCase() == member.nationality.toLowerCase() && holiday.year == $rootScope.dt.year;
						}
					});
					return monthS.monthNeedToWork(member, monthWeeksDates, foundCurrentHolidays);
				}

				scope.getMonthlyToWork = (memberId, month, nationality, entry) => {
					const entered_date = new Date(entry);
					const started_full_date =  `${entered_date.getFullYear()}/${entered_date.getMonth()+1}/${entered_date.getDate()}`;
					const end_date = new Date($rootScope.dt.year, month, 0).getDate();
					const end_full_date = `${$rootScope.dt.year}/${month}/${end_date}`;

					let toWork;
					if (entered_date.getFullYear() == $rootScope.dt.year && entered_date.getMonth()+1 == month) {
						const month_to_work = monthS.monthsNeedtoWork(scope.thisDate.year(), month);
						toWork = monthS.getInBetweenDates(month_to_work, started_full_date, end_full_date) 

					}else{
						toWork = monthS.monthsNeedtoWork(scope.thisDate.year(), month); /** get the total days to work whith holiday not a factor  */
					}
					let filterPrevBirthday = birthdayS.removeBirthdate(memberId, $rootScope.calendarLists, $rootScope.calendarCards, "BIRTHDAY", toWork);
					return holidayS.datesWithoutHoliday(nationality, $rootScope.dt.year, $rootScope.calendarLists, $rootScope.calendarCards, filterPrevBirthday);
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

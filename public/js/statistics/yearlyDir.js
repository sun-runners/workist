'use strict';

angular.module('workingHoursTrello')
	.directive('yearlyDir', function ($rootScope, monthS) {
		return {
			link : function(scope, element, attrs){

				// Initialize Function Section
				let initialize = function(){
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
					return monthS.datesNeedToWork(member, monthWeeksDates, foundCurrentHolidays);
				}

				scope.getYearlyToWork = (member) => {
					let yearsMonthDates = scope.months.map(month => month.dates).flat(Infinity);
					const foundCurrentHolidays = $rootScope.holidays.find(holiday => {
						if (member.nationality) {
							return holiday.country.toLowerCase() == member.nationality.toLowerCase() && holiday.year == $rootScope.dt.year;
						}
					});
					return monthS.datesNeedToWork(member, yearsMonthDates, foundCurrentHolidays);
				}
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../template/statistics/directives/yearlyDir.html" /** if Initialize from workTimist.html */
			// templateUrl: "../../template/statistics/directives/yearlyDir.html"
		}
	});

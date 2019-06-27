'use strict';

angular.module('workingHoursTrello')
	.directive('yearlyDir', function ($rootScope, monthS, yearS, nationalityS, holidayS, totalSalaryS, birthdayS) {
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
				scope.getAnnualLeave = (memberId, allWorked, nationality, entry) => {
					if (entry == undefined) {
						return "";
					}
					try {
						let entryDate = new Date(entry)
						let myAnnualLeave = totalSalaryS.annualLeaves($rootScope.calendarLists, $rootScope.calendarCards, 'ENTERING DATE', $rootScope.dt.Date, memberId); /** annual leave up to now */
						let datesToNow;
						if (entryDate.getFullYear() == $rootScope.dt.year) {
							datesToNow =  totalSalaryS.betweenDates(new Date(`${entryDate.getFullYear()}/${entryDate.getMonth() + 1}/${entryDate.getDate()}`), $rootScope.dt.Date);
						}else{
							datesToNow = totalSalaryS.betweenDates(new Date(`${$rootScope.dt.year}/01/01`), $rootScope.dt.Date);
						}
						let filterPrevBirthday = birthdayS.removeBirthdate(memberId, $rootScope.calendarLists, $rootScope.calendarCards, "BIRTHDAY", datesToNow);
						let allDatesToWork = holidayS.datesWithoutHoliday(nationality, $rootScope.dt.year, $rootScope.calendarLists, $rootScope.calendarCards, filterPrevBirthday)
						let haveWork = allDatesToWork - allWorked;
						let availableLeave = (haveWork < 0) ? 0 : haveWork;
						let usedLeave = myAnnualLeave - availableLeave;
					return ((new Date().getFullYear() !== $rootScope.dt.year) ? ((usedLeave < 0)? 0:usedLeave) : usedLeave) + "/" + ((new Date().getFullYear() !== $rootScope.dt.year) ? 12 : myAnnualLeave);
					} catch (error) {}
				}
				scope.getYearlyToWork = (memberId, nationality) => {
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

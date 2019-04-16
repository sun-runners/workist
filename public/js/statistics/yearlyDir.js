'use strict';

angular.module('workingHoursTrello')
	.directive('yearlyDir', function ($rootScope, apiS, monthS, yearS, nationalityS, holidayS) {
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
						]									
				};
				initialize();

				apiS.getBoardMembers().then((response) => scope.boardMembers = response.data /** Get Boards Members */);
				apiS.getBoardLists().then((response) => scope.boardLists = response.data /**  Get Boards Lists */);
				apiS.getBoardCards().then((response) => scope.boardCards = response.data /** Get Boards Cards */);
				apiS.calendarBoardLists().then((response) => scope.calendarLists = response.data /**  Get Boards Lists */);
				apiS.calendarBoardCards().then((response) => scope.calendarCards = response.data /** Get Boards Cards */);
				
				scope.getMonthlyCard = (month, memberId) => { /** To calculate the total working days of the member per month*/
					return monthS.getMonthsValue($rootScope.dt.year, month, scope.boardLists, memberId, scope.boardCards); /** year , month, boardLists, memberId, boardCards */
				}
				scope.getYearlyCard = (memberId) => { /** To calculate the total working days of the member per month*/
					return yearS.getYearsValue($rootScope.dt.year, scope.months, memberId, scope.boardLists, scope.boardCards);	/** year , month, boardLists, memberId, boardCards */	
				}
				scope.getYearlyNeedWork = () => { /** Get the total days members should work per year */
					return yearS.yearsNeedToWork($rootScope.dt.year, scope.months); /** year , month */
				}
				scope.getMonthlyToWork = (memberId, month) => {
					let country = nationalityS.membersNationality(memberId, scope.calendarCards, scope.calendarLists);
					let toWork = monthS.monthsNeedtoWork(scope.thisDate.year(), month); /** get the total days to work whith holiday not a factor  */
					return holidayS.datesWithoutHoliday(country, $rootScope.dt.year, scope.calendarLists, scope.calendarCards, toWork);
				}
				scope.getYearlyToWork = (memberId) => {
					let country = nationalityS.membersNationality(memberId, scope.calendarCards, scope.calendarLists);
					let toWork = yearS.yearsNeedToWork($rootScope.dt.year, scope.months); /** get the total days to work whith holiday not a factor  */
					return holidayS.datesWithoutHoliday(country, $rootScope.dt.year, scope.calendarLists, scope.calendarCards, toWork);
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

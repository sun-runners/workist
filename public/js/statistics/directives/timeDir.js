'use strict';

angular.module('workingHoursTrello')
	.directive('timeDir', function ($rootScope, apiS, timeS, winS) {
		return {
			link : function(scope, element, attrs){

				// Initialize Function Section
				var initialize = function(){
					let moment_original = $rootScope.moment.clone();
					scope.thisDate = moment_original;

					scope.months = [
							{month: "Jan", value: 1},
							{month: "Feb",value:2},
							{month:"Mar", value: 3},
							{month:"Apr", value: 4},{month:"May", value: 5},{month:"Jun", value: 6},
							{month: "Jul", value: 7},{month:"Aug", value:8},{month:"Sep", value: 9},{month:"Oct",value:10}, {month:"Nov",value:11},{month:"Dec", value:12}
						];									
				};
				initialize();

				apiS.getBoardMembers().then((response) => scope.boardMembers = response.data /** Get Boards Members */);
				apiS.getBoardLists().then((response) => scope.boardLists = response.data /**  Get Boards Lists */);
				apiS.getBoardCards().then((response) => scope.boardCards = response.data /** Get Boards Cards */);
				
				scope.getMonthlyTime = (month, memberId) => { /** To calculate the total time of the member per month */
					return timeS.monthlyTime($rootScope.dt.year, month, scope.boardLists, memberId, scope.boardCards); /** year , month, boardLists, memberId, boardCards */
				};
				scope.getYearlyTime = (memberId) => { /** To calculate the total time of the member per year */
					return timeS.yearlyTime($rootScope.dt.year, scope.months, scope.boardLists, memberId, scope.boardCards);
				};
				scope.getWinMonth = (month) => {
					return winS.monthWinner($rootScope.dt.year, month, scope.boardMembers, scope.boardLists, scope.boardCards);
				}
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/rewards/directives/timeDir.html"
		}
	});

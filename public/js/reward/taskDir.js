'use strict';

angular.module('workingHoursTrello')
	.directive('taskDir', function ($rootScope, apiS, taskS, winS) {
		return {
			link : function(scope, element, attrs){

				// Initialize Function Section
				var initialize = function(){
					let moment_original = $rootScope.moment.clone();
					scope.thisDate = moment_original;

					scope.months = [
							{month: "Jan", value: 1},{month: "Feb",value:2},{month:"Mar", value: 3},
							{month:"Apr", value: 4},{month:"May", value: 5},{month:"Jun", value: 6},
							{month: "Jul", value: 7},{month:"Aug", value:8},{month:"Sep", value: 9},
							{month:"Oct",value:10}, {month:"Nov",value:11},{month:"Dec", value:12}
						];
				};
				initialize();
				
				scope.getMonthlyTask = (month, memberId) => { /** To calculate the total time of the member per month */
					return taskS.monthlyTasks($rootScope.dt.year ,month, $rootScope.boardLists, memberId, $rootScope.boardCards); /** year , month, Lists, memberId, Cards */
				}
				scope.getYearlyTask = (memberId) => {   
					return taskS.yearlyTasks($rootScope.dt.year, scope.months, $rootScope.boardLists, memberId, $rootScope.boardCards);
				}
				scope.getWinMonth = (month) => {
					return winS.monthWinner($rootScope.dt.year, month, $rootScope.boardMembers, $rootScope.boardLists, $rootScope.boardCards,'task');
				}
			},
			restrict: "EA",
			replace: true,
			scope: {},
			// templateUrl: "../template/rewards/directives/taskDir.html" /** if Initialize from workTimist.html */
			templateUrl: "../../template/rewards/directives/taskDir.html" 
		}
	});

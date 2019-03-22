angular.module('workingHoursTrello')
	.directive('weeklyDir',  function ($rootScope, apiS, dayS, weekS) {
		return {
			link : function(scope, element, attrs){
				// Initialize Function Section
				var initialize = function(){
          		var moment_original = $rootScope.moment.clone();
					var dt_original = $rootScope.getDtOfMoment(moment_original);
					scope.dts = [];
					for(var i=1; i<=7; i++){
						// Set new moment
						var moment_in_week = moment_original.clone();
						moment_in_week = moment_in_week.date((dt_original.week-1)*7+i);
						// Set new dt
						var dt_in_week = $rootScope.getDtOfMoment(moment_in_week);
						// Compare same week
						if(dt_in_week.week!=dt_original.week) continue;
						// Push dt
						scope.dts.push(dt_in_week);
					}
				};
				// Watch Function Section
				$rootScope.$watch('moment', function( $scope){
					initialize();
			  	}, true);   
				apiS.getBoardMembers().then((response) => scope.boardMembers = response.data /** Get Boards Members */);
				apiS.getBoardLists().then((response) => scope.boardLists = response.data /**  Get Boards Lists */);
				apiS.getBoardCards().then((response) => scope.boardCards = response.data /** Get Boards Cards */);
				apiS.calendarBoardLists().then((response) => scope.calendarLists = response.data /**  Get Boards Lists */);
				apiS.calendarBoardCards().then((response) => scope.calendarCards = response.data /** Get Boards Cards */);
				
				scope.getDailyCard = (dateOfDay, memberId) => { /** Get daily card output */
					return dayS.getDailyCardValue(dateOfDay, memberId, scope.boardLists, scope.boardCards)
				}
				scope.getWeeklyCard = (dateWeeks, memberId) => { /** To calculate the total working days of the member */
					let datesOfTheWeek = weekS.weekDatesArray(dateWeeks);					
					return weekS.getDaysTotalOutput(datesOfTheWeek, memberId, scope.boardLists, scope.boardCards);
				}
				scope.getWeeklyNeedWork = (dates) => { /** To calculate the total days the member should work on the week */
					return weekS.weeklyNeedToWork(dates);
				}
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/statistics/directives/weeklyDir.html",
	  	}
	});

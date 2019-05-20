angular.module('workingHoursTrello')
	.directive('weeklyDir',  function ($rootScope, apiS, dayS, weekS, nationalityS, holidayS, birthdayS) {
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
				$rootScope.$watch('moment', function(){
					initialize();
			  	}, true);   
				scope.getDailyCard = (dateOfDay, memberId) => { /** Get daily card output */
					return dayS.getDailyCardValue(dateOfDay, memberId, $rootScope.boardLists, $rootScope.boardCards)
				}
				scope.getWeeklyCard = (dateWeeks, memberId) => { /** To calculate the total working days of the member */
					let datesOfTheWeek = weekS.weekDatesArray(dateWeeks);					
					return weekS.getDaysTotalOutput(datesOfTheWeek, memberId, $rootScope.boardLists, $rootScope.boardCards);
				}
				scope.getHolidays = (memberId, dates) => { /** we get the holidays base on nationality */
					let country = nationalityS.membersNationality(memberId, $rootScope.calendarCards, $rootScope.calendarLists);
					let weeklyToWork = weekS.weeklyNeedToWork(dates);
					let filterTheBirthday = birthdayS.removeBirthdate(memberId, $rootScope.calendarLists, $rootScope.calendarCards, "BIRTHDAY", weeklyToWork);
					return holidayS.datesWithoutHoliday(country, $rootScope.dt.year, $rootScope.calendarLists, $rootScope.calendarCards, filterTheBirthday);
				}
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../template/statistics/directives/weeklyDir.html", /** if Initialize from workTimist.html */
			// templateUrl: "../../template/statistics/directives/weeklyDir.html", 
	  	}
	});

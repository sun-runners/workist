angular.module('workingHoursTrello')
	.directive('weeklyDir',  function ($rootScope, apiS, dayS, weekS, nationalityS, holidayS, birthdayS) {
		return {
			link : function(scope, element, attrs){
				// Initialize Function Section
				scope.moment = moment();

				// Increase Function Section
				scope.increaseWeek = function(){
				  	scope.moment.add(7, 'days');
				};
				scope.decreaseWeek = function(){
					scope.moment.subtract(7, 'days');
				};
				scope.getDtOfMoment = function(moment){
					var dt = {};
					dt.Date = moment.toDate();
					dt.year = moment.year();
					dt.month = moment.month()+1;
					dt.date = moment.date();
					dt.week = Math.ceil(moment.date()/7);
					return dt;
				}
				var initialize = function(){
          		var moment_original = scope.moment.clone();
					var dt_original = scope.getDtOfMoment(moment_original);
					scope.dts = [];
					for(var i=1; i<=7; i++){
						// Set new moment
						var moment_in_week = moment_original.clone();
						moment_in_week = moment_in_week.date((dt_original.week-1)*7+i);
						// Set new dt
						var dt_in_week = scope.getDtOfMoment(moment_in_week);
						// Compare same week
						if(dt_in_week.week!=dt_original.week) continue;
						// Push dt
						scope.dts.push(dt_in_week);
					}
				};
				// Watch Function Section
				scope.$watch('moment', function(){
					scope.dt = scope.getDtOfMoment(scope.moment);
					initialize();
			  	}, true);   
				scope.getDailyCard = (dateOfDay, memberId) => { /** Get daily card output */
					return dayS.getDailyCardValue(dateOfDay, memberId, $rootScope.boardLists, $rootScope.boardCards)
				}
				scope.getWeeklyCard = (dateWeeks, memberId) => { /** To calculate the total working days of the member */
					let datesOfTheWeek = weekS.weekDatesArray(dateWeeks);					
					return weekS.getDaysTotalOutput(datesOfTheWeek, memberId, $rootScope.boardLists, $rootScope.boardCards);
				}
				scope.getHolidays = (memberId, dates, nationality) => { /** we get the holidays base on nationality */
					let weeklyToWork = weekS.weeklyNeedToWork(dates);
					let filterTheBirthday = birthdayS.removeBirthdate(memberId, $rootScope.calendarLists, $rootScope.calendarCards, "BIRTHDAY", weeklyToWork);
					return holidayS.datesWithoutHoliday(nationality, $rootScope.dt.year, $rootScope.calendarLists, $rootScope.calendarCards, filterTheBirthday);
				}
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../template/statistics/directives/weeklyDir.html", /** if Initialize from workTimist.html */
			// templateUrl: "../../template/statistics/directives/weeklyDir.html", 
	  	}
	});

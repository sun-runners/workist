'use strict';

angular.module('workingHoursTrello')
	.directive('monthlyDir',  function ($rootScope, apiS, monthS, nationalityS, holidayS, birthdayS) {
		return {
			link : function(scope, element, attrs){

				// Initialize Function Section
				let initialize = function(){
					let moment_original = $rootScope.moment.clone();
					let dt_original = $rootScope.getDtOfMoment(moment_original);
					scope.thisDate = moment_original;
				
				let getWeeklyMonth = function (month, year){
				    let weeks=[],
				        // firstDate=new Date(year, month, 1),
				        lastDate=new Date(year, month+1, 0), 
				        numDays= lastDate.getDate();
				    let start=1;
				    let end=7;
				    let weekNumber = 1;
				    let monthMonthly = month+1;
				    if (monthMonthly <= 9) { monthMonthly = "0"+ monthMonthly}
				    while(start<=numDays){
				        weeks.push({year: year, month: monthMonthly, week:weekNumber, start:start, end:end, startFull: year + "/" + monthMonthly + "/" + start, endFull: year + "/" + monthMonthly + "/" + end,});
				        weekNumber = weekNumber + 1;
				        start = end + 1;
				        end = end + 7;
				        if(end>numDays)
				            end=numDays;    
				    }        
				    	return weeks;
				 	};
				 scope.monthlyWeeks =  getWeeklyMonth(scope.thisDate.month(), scope.thisDate.year())  
				};
				// Watch Function Section
				$rootScope.$watch('moment', function(){
					initialize();
				  }, true);	
				scope.getWeeklyCard = (theDates, memberId) => { /** To calculate the total working days of the member per week */
					// year, month, dateStart, dateEnd, memberId, boardLists, boardCards
					return monthS.getWeeksValue(theDates.year, theDates.month, theDates.startFull, theDates.endFull, memberId, $rootScope.boardLists, $rootScope.boardCards);
				}
				scope.getMonthlyCard = (memberId) => { /** To calculate the total working days of the member per month*/
					return monthS.getMonthsValue(scope.thisDate.year(), scope.thisDate.month()+1, $rootScope.boardLists, memberId, $rootScope.boardCards);
				}
				scope.getWeeklyTotal = (memberId, theDates) => { /** we get the holidays base on nationality */
					let country = nationalityS.membersNationality(memberId, $rootScope.calendarCards, $rootScope.calendarLists);
					let weeklyToWork = monthS.weeklyNeedToWork(theDates.year, theDates.month, theDates.startFull, theDates.endFull);
					let filterTheBirthday = birthdayS.removeBirthdate(memberId, $rootScope.calendarLists, $rootScope.calendarCards, "BIRTHDAY", weeklyToWork);
					return holidayS.datesWithoutHoliday(country, $rootScope.dt.year, $rootScope.calendarLists, $rootScope.calendarCards, filterTheBirthday);
				}
				scope.getMonthlyTotal = (memberId, nationality) => { /** we get the holidays base on nationality */
					let monthlyToWork = monthS.monthsNeedtoWork(scope.thisDate.year(), scope.thisDate.month()+1);
					let filterTheBirthday = birthdayS.removeBirthdate(memberId, $rootScope.calendarLists, $rootScope.calendarCards, "BIRTHDAY", monthlyToWork);
					return holidayS.datesWithoutHoliday(nationality, $rootScope.dt.year, $rootScope.calendarLists, $rootScope.calendarCards, filterTheBirthday); 
				}
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../template/statistics/directives/monthlyDir.html" /** if Initialize from workTimist.html */
			// templateUrl: "../../template/statistics/directives/monthlyDir.html"
		}
	});

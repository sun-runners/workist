'use strict';

angular.module('workingHoursTrello')
	.directive('monthlyDir',  function ($rootScope, apiS, monthS, nationalityS, holidayS) {
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
				    if (monthMonthly <= 9) {
				    	monthMonthly = "0"+ monthMonthly
				    }
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
				$rootScope.$watch('moment', function($scope){
					initialize();
				  }, true);	
				apiS.getBoardMembers().then((response) => scope.boardMembers = response.data /** Get Boards Members */);
				apiS.getBoardLists().then((response) => scope.boardLists = response.data /**  Get Boards Lists */);
				apiS.getBoardCards().then((response) => scope.boardCards = response.data /** Get Boards Cards */);
				apiS.calendarBoardLists().then((response) => scope.calendarLists = response.data /**  Get Boards Lists */);
				apiS.calendarBoardCards().then((response) => scope.calendarCards = response.data /** Get Boards Cards */);
				scope.getWeeklyCard = (theDates, memberId) => { /** To calculate the total working days of the member per week */
					// year, month, dateStart, dateEnd, memberId, boardLists, boardCards
					return monthS.getWeeksValue(theDates.year, theDates.month, theDates.startFull, theDates.endFull, memberId, scope.boardLists, scope.boardCards);
				}
				scope.getWeeklyNeedWork = (theDates) => { /** Get the total days members should work per week*/
					// year, month, dateStart, dateEnd
					return monthS.weeklyNeedToWork(theDates.year, theDates.month, theDates.startFull, theDates.endFull);
				}
				scope.getMonthlyCard = (memberId) => { /** To calculate the total working days of the member per month*/
					return monthS.getMonthsValue(scope.thisDate.year(), scope.thisDate.month()+1, scope.boardLists, memberId, scope.boardCards);
				}
				scope.getMonthlyNeedWork = () => { /** Get the total days members should work per month */
					return monthS.monthsNeedtoWork(scope.thisDate.year(), scope.thisDate.month()+1);
				}
				scope.getWeeklyHolidays = (memberId, theDates) => { /** we get the holidays base on nationality */
					let country = nationalityS.membersNationality(memberId, scope.calendarCards, scope.calendarLists);
					let weeklyToWork = monthS.weeklyNeedToWork(theDates.year, theDates.month, theDates.startFull, theDates.endFull);
					return holidayS.datesHoliday(country, $rootScope.dt.year, scope.calendarLists, scope.calendarCards, weeklyToWork);
				}
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/statistics/directives/monthlyDir.html"
		}
	});

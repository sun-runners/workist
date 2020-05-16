'use strict';

angular.module('workingHoursTrello')
	.directive('monthlyDir',  function ($rootScope, monthS, weekS, dayS, holidayS, birthdayS) {
		return {
			link : function(scope, element, attrs){

				// Initialize Function Section
				let initialize = function(){
					let moment_original = $rootScope.moment.clone();
					let dt_original = $rootScope.getDtOfMoment(moment_original);
					scope.thisDate = moment_original;
				
				let getWeeksDates = (start, end) => { 
					let date = start;
					let result = [];
					while (date.getMonth() == end.getMonth() && date.getDate() <= end.getDate()) {
						result.push({
							Date: new Date(date.getFullYear()+ "/" + (date.getMonth() + 1) +"/"+ date.getDate())
						});
						date.setDate(date.getDate() + 1);
					}
					return result;
				};

				let getWeeklyMonth = function (month, year){
				    let weeks = [];
				    let lastDate = new Date(year, month+1, 0); 
				    let numDays =  lastDate.getDate();
				    let start = 1;
				    let end = 7;
				    let weekNumber = 1;
				    let monthMonthly = month+1;
				    if (monthMonthly <= 9) monthMonthly = "0" + monthMonthly;
				    while(start<=numDays){
						const weeksStart = new Date(year + "/" + monthMonthly + "/" + start);
						const weeksEnd = new Date(year + "/" + monthMonthly + "/" + end);
						const weeksDates = getWeeksDates(weeksStart, weeksEnd)
						weeks.push({
							year: year, 
							month: monthMonthly, 
							week:weekNumber, 
							start:start, 
							end:end, 
							startFull: weeksStart, 
							endFull: weeksEnd,
							dates: weeksDates
						});

				        weekNumber = weekNumber + 1;
				        start = end + 1;
				        end = end + 7;
				        if(end>numDays) end=numDays;    
				    }        
					return weeks;
				};
				 scope.monthlyWeeks =  getWeeklyMonth(scope.thisDate.month(), scope.thisDate.year());
				};
				// Watch Function Section
				$rootScope.$watch('moment', function(){
					initialize();
				  }, true);	

				scope.getWeeklyCard = (dateWeeks, member) => { /** we get the Total works members made */

					let totalTime = 0;
					for (const dates of dateWeeks.dates) {
						const result = dayS.getDailyCardValue(dates.Date, member)
						totalTime = totalTime + result
					}
					return totalTime
				}

				scope.getWeeklyNeedWork = (dateWeeks, member) => { /** we get the Total works needed for the week */

					const foundCurrentHolidays = $rootScope.holidays.find(holiday => {
						if (member.nationality) {
							return holiday.country.toLowerCase() == member.nationality.toLowerCase() && holiday.year == $rootScope.dt.year;
						}
					});
					if (foundCurrentHolidays) {
						return weekS.weekNeedsToWork(dateWeeks.dates, member, foundCurrentHolidays);
					}
				}

				scope.getMonthlyCard = (memberId) => { /** To calculate the total working days of the member per month*/
					return monthS.getMonthsValue(scope.thisDate.year(), scope.thisDate.month()+1, $rootScope.boardLists, memberId, $rootScope.boardCards);
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

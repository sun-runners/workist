angular.module('workingHoursTrello')
	.directive('holidayDir',  function ($rootScope, calendarS, apiS, holidayS) {
		return {
			link : function(scope, element, attrs){

				function initialize() {
					scope.getPhpHoliday = () => { 
						try { /** We create a list of cards base on the name given */
							for (let i = 0; i < scope.boardLists.length; i++) {
								const list = scope.boardLists[i];
								if (list.name == `${scope.currentYear} HOLIDAY PHILIPPINES`) {
									return list.id
								}
							}
						} catch (error) {}
					}
					scope.getKorHoliday = () => { 
						try { /** We create a list of cards base on the name given */
							for (let i = 0; i < scope.boardLists.length; i++) {
								const list = scope.boardLists[i];
								if (list.name == `${scope.currentYear} HOLIDAY KOREA`) {
									return list.id
								}
							}
						} catch (error) {}
					}
					scope.swtichHoliday = "philippines";
				}
				initialize()

				apiS.calendarBoardLists().then((response) => scope.boardLists = response.data /**  Get Boards Lists */);
				apiS.calendarBoardCards().then((response) => scope.boardCards = response.data /** Get Boards Cards */);
				
				scope.today = new Date();
				scope.currentMonth = scope.today.getMonth();
				scope.currentMonthName = moment(scope.currentMonth + 1, 'MM').format('MMMM')
				scope.currentYear = scope.today.getFullYear();

				scope.next = function() {
					scope.currentYear = (scope.currentMonth === 11) ? scope.currentYear + 1 : scope.currentYear;
					scope.currentMonth = (scope.currentMonth + 1) % 12;
					scope.currentMonthName = moment(scope.currentMonth + 1, 'MM').format('MMMM')
					calendarS.showCalendar(scope.currentMonth, scope.currentYear); /** Function to show Calendar */
				}
				scope.previous = function() {
					scope.currentYear = (scope.currentMonth === 0) ? scope.currentYear - 1 : scope.currentYear;
					scope.currentMonth = (scope.currentMonth === 0) ? 11 : scope.currentMonth - 1;
					scope.currentMonthName = moment(scope.currentMonth + 1, 'MM').format('MMMM')
					calendarS.showCalendar(scope.currentMonth, scope.currentYear); /** Function to show Calendar */
				}		
				calendarS.showCalendar(scope.currentMonth, scope.currentYear);

				scope.holidayName = (name) => holidayS.getHolidayName(name);
				scope.holidayDate = (name) => holidayS.getHolidayDate(scope.currentYear, name);
				scope.holidayDay = (name) => holidayS.geyDayOfWeek(scope.currentYear, name);
				scope.changeHoliday = (country) => { if (country == "korea") { scope.swtichHoliday = "korea"}
					else{scope.swtichHoliday = "philippines"}
				}
			},	
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/calendar/directives/holidayDir.html",
	  	}
	});
angular.module('workingHoursTrello')
	.directive('holidayDir',  function ($rootScope, calendarS, apiS, holidayS) {
		return {
			link : function(scope, element, attrs){
				function initialize() {
					scope.getHoliday = (name) => { 
						try { /** We create a list of cards base on the name given */
							for (let i = 0; i < $rootScope.calendarLists.length; i++) {
								const list = $rootScope.calendarLists[i];
								if (list.name == `${scope.currentYear} ${name}`) {
									return list.id
								}
							}
						} catch (error) {}
					}
					scope.swtichHoliday = "PHILIPPINES";
				}
				initialize()			
				scope.today = new Date();
				scope.currentMonth = scope.today.getMonth();
				scope.currentMonthName = moment(scope.currentMonth + 1, 'MM').format('MMMM')
				scope.currentYear = scope.today.getFullYear();
				scope.targetDay = 0;
				scope.selectedHoliday = -1;

				scope.next = function() {
					scope.targetDay = 0;
					scope.currentYear = (scope.currentMonth === 11) ? scope.currentYear + 1 : scope.currentYear;
					scope.currentMonth = (scope.currentMonth + 1) % 12;
					scope.currentMonthName = moment(scope.currentMonth + 1, 'MM').format('MMMM')
					calendarS.showCalendar(scope.currentMonth, scope.currentYear); /** Function to show Calendar */
					scope.selectedHoliday = -1;
				}
				scope.previous = function() {
					scope.targetDay = 0;
					scope.currentYear = (scope.currentMonth === 0) ? scope.currentYear -  1 : scope.currentYear;
					scope.currentMonth = (scope.currentMonth === 0) ? 11 : scope.currentMonth - 1;
					scope.currentMonthName = moment(scope.currentMonth + 1, 'MM').format('MMMM')
					calendarS.showCalendar(scope.currentMonth, scope.currentYear); /** Function to show Calendar */
					scope.selectedHoliday = -1;
				}		
				scope.getToHoliday = function(index, month, day){ /** change Calendar base on the given month and year */
					scope.currentMonthName = moment(month + 1, 'MM').format('MMMM');
					scope.currentYear = scope.today.getFullYear();
					scope.currentMonth = month;
					scope.targetDay = day
					calendarS.showCalendar(month, scope.currentYear);		
					scope.selectedHoliday = index;
				}			
				scope.holidayName = (name) => holidayS.getHolidayName(name);
				scope.holidayFullDate = (name) => holidayS.getHolidayFullDate(scope.currentYear, name);
				scope.holidayDay = (name) => holidayS.getDayOfWeek(scope.currentYear, name);
				scope.holidayMonth = (name) => holidayS.getHolidayMonth(scope.currentYear, name);
				scope.holidayDate = (name) => holidayS.getHolidayDate(scope.currentYear, name);
				scope.changeHoliday = (country) => { if (country == "KOREA") { scope.swtichHoliday = "KOREA"}
					else{scope.swtichHoliday = "PHILIPPINES"}
				}
				scope.initiateCalendar = () => calendarS.showCalendar(scope.currentMonth, scope.currentYear, $rootScope.calendarLists, $rootScope.calendarCards, "HOLIDAY", scope.targetDay, scope.swtichHoliday);
			},	
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../template/calendar/directives/holidayDir.html", /** if Initialize from workTimist.html */
			// templateUrl: "../../template/calendar/directives/holidayDir.html",
	  	}
	});
angular.module('workingHoursTrello')
	.directive('holidayDir',  function ($rootScope, calendarS, apiS, holidayS) {
		return {
			link : function(scope, element, attrs){
				// Initialize Function Section
				apiS.calendarBoardMembers().then((response) => scope.boardMembers = response.data /** Get Boards Members */);
				apiS.calendarBoardLists().then((response) => scope.boardLists = response.data /**  Get Boards Lists */);
				apiS.calendarBoardCards().then((response) => scope.boardCards = response.data /** Get Boards Cards */);
				
				scope.today = new Date();
				scope.currentMonth = scope.today.getMonth();
				scope.currentMonthName = moment(scope.currentMonth + 1, 'MM').format('MMMM')
				scope.currentYear = scope.today.getFullYear();

				scope.selectedMember = 0;
				

				scope.next = function() {
					scope.currentYear = (scope.currentMonth === 11) ? scope.currentYear + 1 : scope.currentYear;
					scope.currentMonth = (scope.currentMonth + 1) % 12;
					scope.currentMonthName = moment(scope.currentMonth + 1, 'MM').format('MMMM')
					calendarS.showCalendar(scope.currentMonth, scope.currentYear); /** Function to show Calendar */
					scope.selectedMember = 0;
				}
				scope.previous = function() {
					scope.currentYear = (scope.currentMonth === 0) ? scope.currentYear - 1 : scope.currentYear;
					scope.currentMonth = (scope.currentMonth === 0) ? 11 : scope.currentMonth - 1;
					scope.currentMonthName = moment(scope.currentMonth + 1, 'MM').format('MMMM')
					calendarS.showCalendar(scope.currentMonth, scope.currentYear); /** Function to show Calendar */
					scope.selectedMember = 0;
				}		
				calendarS.showCalendar(scope.currentMonth, scope.currentYear);
                
                scope.holidayDate = () => 
                    holidayS.getHolidays(scope.boardLists, scope.boardCards, "2019 HOLIDAY PHILIPPINES", scope.currentYear);
                
          
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/calendar/directives/holidayDir.html",
	  	}
	});
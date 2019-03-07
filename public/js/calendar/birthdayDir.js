angular.module('workingHoursTrello')
	.directive('birthdayDir',  function ($rootScope, calendarS, apiS, birthdayS) {
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
				
				scope.next = function() {
					scope.currentYear = (scope.currentMonth === 11) ? scope.currentYear + 1 : scope.currentYear;
					scope.currentMonth = (scope.currentMonth + 1) % 12;
					scope.currentMonthName = moment(scope.currentMonth + 1, 'MM').format('MMMM')
					calendarS.showCalendar(scope.currentMonth, scope.currentYear, scope.boardLists, scope.boardCards, "BIRTHDAY"); /** Function to show Calendar */

				}
				scope.previous = function() {
					scope.currentYear = (scope.currentMonth === 0) ? scope.currentYear - 1 : scope.currentYear;
					scope.currentMonth = (scope.currentMonth === 0) ? 11 : scope.currentMonth - 1;
					scope.currentMonthName = moment(scope.currentMonth + 1, 'MM').format('MMMM')
					calendarS.showCalendar(scope.currentMonth, scope.currentYear, scope.boardLists, scope.boardCards, "BIRTHDAY"); /** Function to show Calendar */
					
				}
				scope.getToBirthday = function(month, year){ /** change Calendar base on the given month and year */
					scope.currentMonthName = moment(scope.currentMonth, 'MM').format('MMMM');
					scope.currentYear = scope.today.getFullYear();
					calendarS.showCalendar(month, year, scope.boardLists, scope.boardCards, "BIRTHDAY");
				}			
				 /** memberId, boardLists, boardCards, strName */
				scope.getMemberBirthDate = (memberId) => /** to get Member Day of Birth and Name of Month */
					birthdayS.getBirthdate(memberId, scope.boardLists, scope.boardCards, "BIRTHDAY");

				scope.getMemberBirthMonth = (memberId) => /** to get Member Birth Month */
					birthdayS.getBirthMonth(memberId, scope.boardLists, scope.boardCards, "BIRTHDAY");

				scope.getMemberBirthYear = (memberId) => /** to get Member Birth Year */
					 birthdayS.getBirthYear(memberId, scope.boardLists, scope.boardCards, "BIRTHDAY");
				
				scope.getMemberAge = (memberId) => /** to get Member current Age */
					birthdayS.getAge(memberId, scope.boardLists, scope.boardCards, "BIRTHDAY");
				

				// scope.y = birthdayS.findBoardList(scope.boardLists, "BIRTHDAY")
				scope.initiateCalendar = () => {
					return calendarS.showCalendar(scope.currentMonth, scope.currentYear, scope.boardLists, scope.boardCards, "BIRTHDAY"); /** Function to show Calendar */
				}
				calendarS.showCalendar(scope.currentMonth, scope.currentYear)
	
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/calendar/directives/birthdayDir.html",
	  	}
	});
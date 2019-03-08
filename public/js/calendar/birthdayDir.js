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
				scope.getToBirthday = function(month, year, day){ /** change Calendar base on the given month and year */
					scope.currentMonthName = moment(month + 1, 'MM').format('MMMM');
					scope.currentYear = scope.today.getFullYear();
					calendarS.showCalendar(month, year, scope.boardLists, scope.boardCards, "BIRTHDAY", day);
				}			
				/** to get Member Day of Birth and Name of Month */
				scope.getMemberBirthDate = (memberId) => birthdayS.getBirthdate(memberId, scope.boardLists, scope.boardCards, "BIRTHDAY");
				/** to get Member Birth Day */
				scope.getMemberBirthDay = (memberId) => birthdayS.getBirthday(memberId, scope.boardLists, scope.boardCards, "BIRTHDAY");
				/** to get Member Birth Month */
				scope.getMemberBirthMonth = (memberId) => birthdayS.getBirthMonth(memberId, scope.boardLists, scope.boardCards, "BIRTHDAY");
				/** to get Member Birth Year */
				scope.getMemberBirthYear = (memberId) => birthdayS.getBirthYear(memberId, scope.boardLists, scope.boardCards, "BIRTHDAY");
				/** to get Member current Age */	 
				scope.getMemberAge = (memberId) => birthdayS.getAge(memberId, scope.boardLists, scope.boardCards, "BIRTHDAY");
				/** Function to show Calendar */
				scope.initiateCalendar = () => calendarS.showCalendar(scope.currentMonth, scope.currentYear, scope.boardLists, scope.boardCards, "BIRTHDAY"); 
					
				calendarS.showCalendar(scope.currentMonth, scope.currentYear);
	
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/calendar/directives/birthdayDir.html",
	  	}
	});
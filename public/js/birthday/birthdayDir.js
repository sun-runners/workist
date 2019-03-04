angular.module('workingHoursTrello')
	.directive('birthdayDir',  function ($rootScope) {
		return {
			link : function(scope, element, attrs){
				// Initialize Function Section
				scope.today = new Date();
				scope.currentMonth = scope.today.getMonth();
				scope.currentYear = scope.today.getFullYear();
				scope.selectYear = document.getElementById("year");
				scope.selectMonth = document.getElementById("month");

				scope.next = function() {
					scope.currentYear = (scope.currentMonth === 11) ? scope.currentYear + 1 : scope.currentYear;
					scope.currentMonth = (scope.currentMonth + 1) % 12;
					scope.showCalendar(scope.currentMonth, scope.currentYear);
				}
				scope.previous = function() {
					scope.currentYear = (scope.currentMonth === 0) ? scope.currentYear - 1 : scope.currentYear;
					scope.currentMonth = (scope.currentMonth === 0) ? 11 : scope.currentMonth - 1;
					scope.showCalendar(scope.currentMonth, scope.currentYear);
				}
				scope.jump = function() {
					scope.currentYear = parseInt(scope.selectYear.value);
					scope.currentMonth = parseInt(scope.selectMonth.value);
					scope.showCalendar(scope.currentMonth, scope.currentYear);
				}
				scope.showCalendar = function(month, year) {
					let firstDay = (new Date(year, month)).getDay();
					let daysInMonth = 32 - new Date(year, month, 32).getDate();

					let tbl = document.getElementById("calendar-body"); // body of the calendar
					// clearing all previous cells
					tbl.innerHTML = "";
					let date = 1;
					for (let i = 0; i < 6; i++) {
						// creates a table row
						let row = document.createElement("tr");
						//creating individual cells, filing them up with data.
						for (let j = 0; j < 7; j++) {
							if (i === 0 && j < firstDay) {
								let cell = document.createElement("td");
								let cellText = document.createTextNode("");
								cell.appendChild(cellText);
								row.appendChild(cell);
							}
							else if (date > daysInMonth) {
								break;
							}
							else {
								let cell = document.createElement("td");
								let cellText = document.createTextNode(date);
								if (date === scope.today.getDate() && year === scope.today.getFullYear() && month === scope.today.getMonth()) {
									cell.classList.add("bg-info");
								} // color today's date
								cell.appendChild(cellText);
								row.appendChild(cell);
								date++;
							}
						}
						tbl.appendChild(row); // appending each row into calendar body.
    				}
				}
				scope.showCalendar(scope.currentMonth, scope.currentYear);
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/birthday/directives/birthdayDir.html",
	  	}
	});
angular.module('workingHoursTrello')
	.directive('birthdayDir',  function ($rootScope, $compile, birthdayS) {
		return {
			link : function(scope, element, attrs){
				// Initialize Function Section
				scope.whoBirthday = (id, day) => {
					scope.targetDay = day;
					scope.showCalendar(scope.currentMonth, scope.currentYear);		
					scope.selectedMember = id;
					document.getElementById(id).scrollIntoView();
				}
				scope.showCalendar = function(month, year, boardLists = 0, boardCards = 0, strName = 0, targetDay = 0, nation = 0) {
					try {
						// let nonWorkingDays = calendarS.getNonWorkingDays(boardLists, boardCards, strName, year, nation)
						let nonWorkingDays = birthdayS.getBirthdays(boardLists, boardCards, strName)
						let today = new Date();
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
									let span = document.createElement("span");
									let cellText = document.createTextNode(date);
									if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
										span.classList.add("bg-today");	
									} // color today's date
									if (nonWorkingDays != 0) {
										for (let x = 0; x < nonWorkingDays.length; x++) {
											let dateOfBirth = nonWorkingDays[x];
											let dateToId = parseInt(dateOfBirth.getDate()+ "" + dateOfBirth.getMonth()+ "" + dateOfBirth.getFullYear());
											// if date is birthdate color and add click event
											if (date == dateOfBirth.getDate() && month == dateOfBirth.getMonth()) {
												span.classList.add("bg-bday");
												span.classList.add("cursor-pointer");
												span.setAttribute("ng-click", `whoBirthday(${dateToId}, ${date})`);
												$compile(span)(scope);
											}
											if (targetDay != 0) {
												if (date == targetDay && month == dateOfBirth.getMonth()) {
													span.classList.add("bg-bday-today");
												}
											}
										}
									}
									span.appendChild(cellText);
									span.classList.add("w-30px");
									span.classList.add("h-30px");
									span.classList.add("bor-50");
									span.classList.add("lh-30px");
									span.classList.add("f-12px");
									span.classList.add("fw-400");
									span.classList.add("cen-x");
									cell.appendChild(span);
									cell.classList.add("w-50px");
									cell.classList.add("h-50px");
									cell.classList.add("pl-5px");
									cell.classList.add("pr-5px");
								   
									row.appendChild(cell);
									date++;
								}
							}
							tbl.appendChild(row); // appending each row into calendar body.
						}         
					} catch (error) {
						return(error)
					}
				}
				scope.today = new Date();
				scope.currentMonth = scope.today.getMonth();
				scope.currentMonthName = moment(scope.currentMonth + 1, 'MM').format('MMMM');
				scope.currentYear = scope.today.getFullYear();
				scope.targetDay = 0;

				scope.selectedMember = 0;
				
				scope.next = function() {
					scope.currentYear = (scope.currentMonth === 11) ? scope.currentYear + 1 : scope.currentYear;
					scope.currentMonth = (scope.currentMonth + 1) % 12;
					scope.currentMonthName = moment(scope.currentMonth + 1, 'MM').format('MMMM');
					scope.targetDay = 0;
					scope.showCalendar(scope.currentMonth, scope.currentYear); /** Function to show Calendar */
					scope.selectedMember = 0;
				}
				scope.previous = function() {
					scope.currentYear = (scope.currentMonth === 0) ? scope.currentYear - 1 : scope.currentYear;
					scope.currentMonth = (scope.currentMonth === 0) ? 11 : scope.currentMonth - 1;
					scope.currentMonthName = moment(scope.currentMonth + 1, 'MM').format('MMMM');
					scope.targetDay = 0;
					scope.showCalendar(scope.currentMonth, scope.currentYear); /** Function to show Calendar */
					scope.selectedMember = 0;
				}
				scope.getToBirthday = function(id, month, year, day){ /** change Calendar base on the given month and year */
					scope.currentMonthName = moment(month + 1, 'MM').format('MMMM');
					scope.currentYear = scope.today.getFullYear();
					scope.currentMonth = month;
					scope.targetDay = day;
					scope.showCalendar(month, year);
			
					scope.selectedMember = id;
				}			
				/** to get Member Day of Birth and Name of Month */
				scope.getMemberBirthDate = birthday => moment(new Date(birthday), "YYYY-MM-DD").format('D MMMM');
				/** to get Member Birth Day */
				scope.getMemberBirthDay = birthday => new Date(birthday).getDate();
				/** to get Member Birth Month */
				scope.getMemberBirthMonth = birthday => new Date(birthday).getMonth();
				/** to get Member Birth Year */
				scope.getMemberBirthYear = birthday => new Date(birthday).getFullYear();
				/** to get Member current Age */	 
				scope.getMemberAge = birthday => Math.floor((new Date() - new Date(birthday).getTime()) / 3.15576e+10);
				/** we give member tr ID base on its birthday */
				scope.giveIdByBirthday = birthday => parseInt(new Date(birthday).getDate()+ "" + new Date(birthday).getMonth()+ "" + new Date(birthday).getFullYear());
				
				/** Function to show Calendar */
				scope.initiateCalendar = () => scope.showCalendar(scope.currentMonth, scope.currentYear, $rootScope.calendarLists, $rootScope.calendarCards, "BIRTHDAY", scope.targetDay); 
					
					
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../template/calendar/directives/birthdayDir.html", /** if Initialize from workTimist.html */
			// templateUrl: "../../template/calendar/directives/birthdayDir.html"
	  	}
	});
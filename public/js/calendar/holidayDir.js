angular.module('workingHoursTrello')
	.directive('holidayDir',  function ($rootScope, $compile, holidayS) {
		return {
			link : function(scope){
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

					scope.doSomething = (index, day) => {
						scope.targetDay = day;
						scope.showCalendar(scope.currentMonth, scope.currentYear);		
						scope.selectedHoliday = index;
						document.getElementById(`${index}`).scrollIntoView()
					}

					scope.showCalendar = function(month, year, holiday, targetDay = 0, country = 0) {
						try {
							let nonWorkingDays = holidayS.getHolidays(holiday, year, country) /** we get all the holidays this year and this country */
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
												let dateNoWork = nonWorkingDays[x];
												if (date == dateNoWork.getDate() && month == dateNoWork.getMonth()) {
													span.classList.add("bg-bday");
													span.classList.add("cursor-pointer");
													span.setAttribute("ng-click", `doSomething(${x}, ${date})`);
													$compile(span)(scope)
												} // color today's date
												if (targetDay != 0) {
													if (date == targetDay && month == dateNoWork.getMonth()) {
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
										cell.classList.add("pl-5px")
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
				}
				initialize()
				scope.today = new Date();
				scope.currentMonth = scope.today.getMonth();
				scope.currentMonthName = moment(scope.currentMonth + 1, 'MM').format('MMMM')
				scope.currentYear = scope.today.getFullYear();
				scope.targetDay = 0;
				scope.selectedHoliday = -1;

				scope.nextYear = () => {
					let lists = $rootScope.calendarLists.filter(list => {
						let year = list.name.substr(0,list.name.indexOf(' '));
						if (year == scope.currentYear + 1) {
							return year
						}
					});
					if (lists.length > 1) {
						scope.currentYear = scope.currentYear + 1;
						scope.showCalendar(scope.currentMonth, scope.currentYear);
					}else{
						scope.currentYear = scope.currentYear;
						scope.showCalendar(scope.currentMonth, scope.currentYear);
					}
				}
				scope.lastYear = () => {
					let lists = $rootScope.calendarLists.filter(list => {
						let year = list.name.substr(0,list.name.indexOf(' '));
						if (year == scope.currentYear - 1) {
							return year
						}
					});
					if (lists.length > 1) {
						scope.currentYear = scope.currentYear - 1;
						scope.showCalendar(scope.currentMonth, scope.currentYear);
					}else{
						scope.currentYear = scope.currentYear;
						scope.showCalendar(scope.currentMonth, scope.currentYear);
					}
				}
				scope.next = function() {
					scope.targetDay = 0;
					if (scope.currentMonth == 11) {
						scope.nextYear();
					}
					scope.currentMonth = (scope.currentMonth + 1) % 12;
					scope.currentMonthName = moment(scope.currentMonth + 1, 'MM').format('MMMM')
					scope.showCalendar(scope.currentMonth, scope.currentYear); /** Function to show Calendar */
					scope.selectedHoliday = -1;
				}
				scope.previous = function() {
					scope.targetDay = 0;
					if (scope.currentMonth === 0) {
						scope.lastYear();
					}
					scope.currentMonth = (scope.currentMonth === 0) ? 11 : scope.currentMonth - 1;
					scope.currentMonthName = moment(scope.currentMonth + 1, 'MM').format('MMMM')
					scope.showCalendar(scope.currentMonth, scope.currentYear); /** Function to show Calendar */
					scope.selectedHoliday = -1;
				}		
				scope.getToHoliday = function(index, month, day){ /** change Calendar base on the given month and year */
					scope.currentMonthName = moment(month + 1, 'MM').format('MMMM');
					scope.currentYear = scope.today.getFullYear();
					scope.currentMonth = month;
					scope.targetDay = day
					scope.showCalendar(month, scope.currentYear);		
					scope.selectedHoliday = index;
				}			
				scope.holidayName = (name) => holidayS.getHolidayName(name);
				scope.holidayFullDate = (name) => holidayS.getHolidayFullDate(scope.currentYear, name);
				scope.holidayDay = (name) => holidayS.getDayOfWeek(scope.currentYear, name);
				scope.holidayMonth = (name) => holidayS.getHolidayMonth(scope.currentYear, name);
				scope.holidayDate = (name) => holidayS.getHolidayDate(scope.currentYear, name);
				scope.changeHoliday = (country) => { if (country == "KOREA") { scope.swtichHoliday = "KOREA"}
					else{scope.swtichHoliday = "PHILIPPINES"}
					scope.targetDay = 0;	
					scope.selectedHoliday = -1;
				}
				scope.initiateCalendar = () => scope.showCalendar(scope.currentMonth, scope.currentYear, $rootScope.holidays, scope.targetDay, scope.swtichHoliday);
			},	
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../template/calendar/directives/holidayDir.html", /** if Initialize from workTimist.html */
			// templateUrl: "../../template/calendar/directives/holidayDir.html",
	  	}
	});
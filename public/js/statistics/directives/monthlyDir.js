'use strict';

angular.module('workingHoursTrello')
	.directive('monthlyDir',  function ($rootScope, serviceGetApi) {
		return {
			link : function(scope, element, attrs){

				// Initialize Function Section
				let initialize = function(){
					let moment_original = $rootScope.moment.clone();
					let dt_original = $rootScope.getDtOfMoment(moment_original);
					scope.thisDate = moment_original;
				
				let getWeeklyMonth = function (month, year){
				    let weeks=[],
				        firstDate=new Date(year, month, 1),
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

				        weeks.push({year: year, month: monthMonthly, week:weekNumber, start:start,end:end, startFull: year + "/" + monthMonthly + "/" + start, endFull: year + "/" + monthMonthly + "/" + end,});
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

				// Get Boards Members
				serviceGetApi.getBoardMembers().then((response) => scope.boardMembers = response.data);
				// Get Boards Lists
				serviceGetApi.getBoardLists().then((response) => scope.boardLists = response.data);
				// Get Boards Cards
				serviceGetApi.getBoardCards().then((response) => scope.boardCards = response.data);

				scope.formatDateTo = (date) => {
					let monthDate = new Date(date)
					// Get Full year month Day
					let singleDate = moment(monthDate).format("YYYY/MM/DD");
					return singleDate
				
				};

				// To get the Dates of every Day of the Month
				scope.getMonthDays = (year, month) => {
				    let date = new Date(year, month - 1, 1);
				    let monthMomment = moment(date).format("MM");
				    let result = [];
				    while (date.getMonth() == month - 1) {
				    //   result.push(`${date.getDate()}-${names[date.getDay()]}`);
				    result.push(date.getFullYear()+ "/" + monthMomment +"/"+ date.getDate());
				      date.setDate(date.getDate() + 1);
				    }
				    return result;
				};
				// Get an Array of Days from the Two given Dates
				scope.getInBetweenDates = (datesArray, startDate, endDate) => {
				    let betweenDates = [];

				    let start = moment(startDate, "YYYY/MM/DD");
				    let end = moment(endDate, "YYYY/MM/DD");
				    betweenDates.push(startDate)
				    for (let i = 0; i < datesArray.length; i++) {
				        const dateDate = datesArray[i];
				        if (moment(dateDate, "YYYY/MM/DD").isBetween(start, end)) {
				            betweenDates.push(dateDate);
				        }
				    }
				    betweenDates.push(endDate)
				    return betweenDates;
				};
				// Get a Array of List's base on the given Array of Days by Weeks
				scope.getListsOfTheWeeks = (weekArray) => {
			  		let weeklyArray = weekArray;
			  		let boardsLists = scope.boardLists;
		  			let foundListWeek = [];
		  			// We loop through the weeklyArray
		  			for (var i = 0; i < weeklyArray.length; i++) {
			  			let weeksArrayDate = weeklyArray[i];
			  				// We loop through the boardsLists
			  				for (var x = 0; x < boardsLists.length; x++) {
			  					let boardsListArray = boardsLists[x];
			  					let boardListNameParsed = boardsListArray.name.substr(0,boardsListArray.name.indexOf(' '));
			  					// we compare the Array weekly Date to our Array of Board's Lists
			  					// If True we push it to the FoundListWeek
			  					if (weeksArrayDate == boardListNameParsed) {
			  					foundListWeek.push(boardsListArray.id);
			  					}
			  				}
		  				}
		  			return foundListWeek;
			  	};
				//   Get an Weekly Array of card's base of the List's array and member ID. 
			  	scope.getCardsOfMemberWeeklyList = (listArray, memberId) => {
			  		let listsWeeklyIdArray = listArray;
			  		let cardWeeklyArray = scope.boardCards;
			  		// Container for the Array of Cards. 
			  		let cardWeeklyCont = [];
			  		for (var i = 0; i < cardWeeklyArray.length; i++) {
			  			let cardsFromArray = cardWeeklyArray[i];
			  			for (var x = 0; x < listsWeeklyIdArray.length; x++) {
			  				let listsID = listsWeeklyIdArray[x];
			  				if (cardsFromArray.idList == listsID && cardsFromArray.idMembers == memberId) {
			  					cardWeeklyCont.push(cardsFromArray.name);
			  				}
			  			}
			  		}
			  		return cardWeeklyCont;
			  	};
				//   Calculate an array of card's name to 'Hours' 
			  	scope.calculateCardsTotalToHours = (cardsArrayName) => {
			  		let cardsCalculated = [];
			  		for (var i = 0; i < cardsArrayName.length; i++) {
			  			let cardsFromArray = cardsArrayName[i];
			  			// alphabet letters found
			  			if (cardsFromArray.match(/[a-z]/i)) {
								cardsCalculated.push(0);
							}
							else {
			  					try {
									cardsCalculated.push(Math.abs(eval(cardsFromArray)));
								  } catch (error) {
									cardsCalculated.push(0);
								  }
							}
			  			
			  		}
			  		return cardsCalculated;
				  };
				//  Calculate cards array of hours(8) to Days(1,0) 
			  	scope.calculateCardsHoursToDay = (cardsHourArray) => {			  		
			  		let cardsWeeklyTotalDay = [];

			  		for (var i = 0; i < cardsHourArray.length; i++) {
			  			let cardHour = cardsHourArray[i];
			  			if (cardHour >= 8) {
			  				let cardDay = 1
			  				cardsWeeklyTotalDay.push(cardDay)
			  			}else if (cardHour > 4) {
			  				let cardDay = 0.5
			  				cardsWeeklyTotalDay.push(cardDay)
			  			}else {
			  				let cardDay = 0
			  				cardsWeeklyTotalDay.push(cardDay)
			  			}
			  		}
			  		return cardsWeeklyTotalDay;
			  	};
				//   Calculate array of Days to get the Total per Week
			  	scope.calculateTotalDay = (cardsTotalWeeklyDays) => {
			  		let cardsCount = 0;

			  		for (var i = 0; i < cardsTotalWeeklyDays.length; i++) {
			  			let cardsTotalDays = cardsTotalWeeklyDays[i];
			  			cardsCount += cardsTotalDays;
			  		}
			  		return cardsCount;
			  	};

				//   Get the Total Cards Score of the Week
				scope.getWeeklyCardsTotal = (theDates, memberID) => {
					try {
						// Get an Array of Days of this Month
						let theDaysOfMonth = scope.getMonthDays(theDates.year, theDates.month);
						// Get an Array of Days of the Weeks
						let theDaysOfWeek = scope.getInBetweenDates(theDaysOfMonth, theDates.startFull, theDates.endFull);
						// Get an Array of Lists of the Weeks
						let theListsOfWeek = scope.getListsOfTheWeeks(theDaysOfWeek);
						// Get an Array of Cards of The Weeks
						let theCardsOfWeek = scope.getCardsOfMemberWeeklyList(theListsOfWeek, memberID);
						// Calculate Cards array to Hours
				  		let cardsWeeklyHours = scope.calculateCardsTotalToHours(theCardsOfWeek);
				  		// Calculate Cards array to TotalDay
				  		let cardsWeeklyDays = scope.calculateCardsHoursToDay(cardsWeeklyHours);
				  		//	Calculate Cards array Total Days to as weekly Total 	  
				  		let cardsWeeklyTotalDays = scope.calculateTotalDay(cardsWeeklyDays);

						return cardsWeeklyTotalDays;
					} catch(e) {
						// statements
						return 0;
					}
				};
				scope.datesToNewDatesFormat = (datesArray) => {
					let datesNewDates = [];
					for (let i = 0; i < datesArray.length; i++) {
						let dates1 = datesArray[i];
						let dates2 = moment(dates1, 'YYYY/MM/DD');
						let dates3 = dates2.day()
						if (dates3 !== 5 && dates3 !== 6) {
							datesNewDates.push(dates3)
						}
					}
					return datesNewDates;
				};

				// Total Working Days of The Week
				scope.getWeeklyTotalWork = (theDates) => {
					// Get an Array of Days of this Month
					let theDaysOfMonth = scope.getMonthDays(theDates.year, theDates.month);
					let theDaysOfWorkWeekly = scope.getInBetweenDates(theDaysOfMonth, theDates.startFull, theDates.endFull);
					let theDatesNewDates = scope.datesToNewDatesFormat(theDaysOfWorkWeekly);

					return theDatesNewDates.length;
			  	};

				// Get an array of lists ID on this month
				scope.getListsOfTheMonths = (arrayMonth) => {
					let arrayLists = scope.boardLists;
					let monthLists = [];

					for (let i = 0; i < arrayMonth.length; i++) {
						const monthArray = arrayMonth[i];
						for (let x = 0; x < arrayLists.length; x++) {
							const listArray = arrayLists[x];
							const listArrayParsed = listArray.name.substr(0,listArray.name.indexOf(' '));
							if (listArrayParsed == monthArray) {
								monthLists.push(listArray);
							}		
						}
					}
					return monthLists;
				};
				// Get an array of Cards on this month base on members ID;
				scope.getCardsOfTheMonths = (listsArray, memberID) => {
					let arrayCards = scope.boardCards;
					let monthCards = [];

					for (let x = 0; x < listsArray.length; x++) {
						const list = listsArray[x];
						for (let i = 0; i < arrayCards.length; i++) {
							const card = arrayCards[i];
							if (card.idList == list.id && card.idMembers == memberID) {
								monthCards.push(card.name)
							}
						}
					}
					return monthCards;
				};
				// Get the Total Score of the Month;
				scope.getMonthTotalDates = (membersID) => {
					try {
						// we added +1 to match the months
						let monthDates = scope.getMonthDays(scope.thisDate.year(), scope.thisDate.month()+1);
						// Get an array of lists on this month
						let monthAllLists = scope.getListsOfTheMonths(monthDates); 
						// Get an array of Cards on this month base on members ID;
						let monthAllCards = scope.getCardsOfTheMonths(monthAllLists, membersID);
						//  Calculate Cards monthly Hours
						let cardsMonthlyHours = scope.calculateCardsTotalToHours(monthAllCards);
						// Calculate Cards array to TotalDay
						let cardsMonthlyDays = scope.calculateCardsHoursToDay(cardsMonthlyHours);
						//	Calculate Cards array Total Days to as Monthly Total 	  
						let cardsMonthlyTotalDays = scope.calculateTotalDay(cardsMonthlyDays);
			
						return cardsMonthlyTotalDays;	
					} 
					catch (e) {
						return 0
					}
				};

				scope.getMonthTotalWorkDays = () => {
					let monthDatesTotal = scope.getMonthDays(scope.thisDate.year(), scope.thisDate.month()+1);
					// Get the Total working Days (no saturday and sunday)
					let theWorkingDays = scope.datesToNewDatesFormat(monthDatesTotal);
					return theWorkingDays.length;
				};

			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/statistics/directives/monthlyDir.html"
		}
	});

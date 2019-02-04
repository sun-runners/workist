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
				    let monthMonthly = month+1
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
				 }
				 scope.monthlyWeeks =  getWeeklyMonth(scope.thisDate.month(), scope.thisDate.year())  
					
				};
				// Watch Function Section
				$rootScope.$watch('moment', function( $scope){
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
				    let monthMomment = moment(date).format("MM")
				    let result = [];
				    while (date.getMonth() == month - 1) {
				    //   result.push(`${date.getDate()}-${names[date.getDay()]}`);
				    result.push(date.getFullYear()+ "/" + monthMomment +"/"+ date.getDate());
				      date.setDate(date.getDate() + 1);
				    }
				    return result;
				};

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

			  	scope.calculateCardsTotalWeeklyToHours = (cardsArrayName) => {
			  		let cardsCalculated = [];
			  		for (var i = 0; i < cardsArrayName.length; i++) {
			  			let cardsFromArray = cardsArrayName[i];
			  			// alphabet letters found
			  			if (cardsFromArray.match(/[a-z]/i)) {
								cardsCalculated.push(0);
							}else {
			  					cardsCalculated.push(Math.abs(eval(cardsFromArray)));
							}
			  			
			  		}
			  		return cardsCalculated;
			  	};
			  	scope.calculateCardsWeeklyHoursToDay = (cardsHourArray) => {			  		
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

			  	scope.calculateTotalWeekDay = (cardsTotalWeeklyDays) => {
			  		let cardsCount = 0;

			  		for (var i = 0; i < cardsTotalWeeklyDays.length; i++) {
			  			let cardsTotalDays = cardsTotalWeeklyDays[i];
			  			cardsCount += cardsTotalDays;
			  		}
			  		return cardsCount;
			  	};

				scope.getCardsMembers= (theDates, memberID) => {
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
				  		let cardsWeeklyHours = scope.calculateCardsTotalWeeklyToHours(theCardsOfWeek);
				  		// // Calculate Cards array to TotalDay
				  		let cardsWeeklyDays = scope.calculateCardsWeeklyHoursToDay(cardsWeeklyHours);
				  		// // // 
				  		let cardsWeeklyTotalDays = scope.calculateTotalWeekDay(cardsWeeklyDays);

						return cardsWeeklyTotalDays;
					} catch(e) {
						// statements
						console.log(e);
						return 0
					}
				};



			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/statistics/directives/monthlyDir.html"
		}
	});

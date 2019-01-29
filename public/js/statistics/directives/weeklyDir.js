angular.module('workingHoursTrello')
	.directive('weeklyDir',  function ($rootScope, serviceGetApi) {
		return {
			link : function(scope, element, attrs){

				// Initialize Function Section
				var initialize = function(){
          		var moment_original = $rootScope.moment.clone();
					var dt_original = $rootScope.getDtOfMoment(moment_original);
					scope.dts = [];
					for(var i=1; i<=7; i++){
						// Set new moment
						var moment_in_week = moment_original.clone();
						moment_in_week = moment_in_week.date((dt_original.week-1)*7+i);
						// Set new dt
						var dt_in_week = $rootScope.getDtOfMoment(moment_in_week);
						// Compare same week
						if(dt_in_week.week!=dt_original.week) continue;
						// Push dt
						scope.dts.push(dt_in_week);
					}
				};
				// Watch Function Section
				$rootScope.$watch('moment', function( $scope){
					initialize();
			  }, true);
//   ---------------------------------------------------- fetching API Getting Names & Cards ------------------------------		   
				// Get Boards Members
				serviceGetApi.getBoardMembers().then((response) => scope.boardMembers = response.data);
				// Get Boards Lists
				serviceGetApi.getBoardLists().then((response) => scope.boardLists = response.data);
				// Get Boards Cards
				serviceGetApi.getBoardCards().then((response) => scope.boardCards = response.data);
				// we Find the Card to show Base on the Owners ID and Lists ID
				scope.findCard = (ownerId, cardId) => {
					let foundCard = scope.boardCards.find((card, index) => {
						return card.idMembers == ownerId && card.idList == cardId;
					});
					return foundCard;	
				};
				scope.getDateYearMonthDay = (dateWanted) => {
					// parse Date into the same Format as Lists Name
					return getDate = dateWanted.getFullYear() + '/' + ('0' + (dateWanted.getMonth() + 1)).slice(-2) + '/' + dateWanted.getDate()
				}
				scope.findBoardList = (dateOfList) => {	
				    let foundList = scope.boardLists.find((list, index) => {
				      	let listNameBeforeSpace = list.name.substr(0,list.name.indexOf(' '));
				      	return listNameBeforeSpace == dateOfList;
				    }); 
				    // will return the ID of the Given Date
			  		return foundList.id;
			  	};
			  		// We Calculate the Number of Hours from the Card's Name
			  	scope.calculateCardNameToHours = (card) => {
			  		let totalHours = eval(card.name);
			  		return Math.abs(totalHours);	
			  	};
			  		// We Calculate The equivalent Day of the card base on its hours
			  	scope.calculateTheCardsHourToDay = (cardsHour) => {
			  		if (cardsHour >= 8) {
			  			return cardsDay = 1;
			  		}else if (cardsHour < 8 && cardsHour > 4) {
			  			return 	cardsDay = 0.5;
			  		}else if (cardsHour <= 4) {
			  			return cardsDay = 0;
			  		}
			  	};
			  	scope.getCard = (dateWanted, ownerId) => {
			  		this.dateWanted = dateWanted;
			  		this.ownerId = ownerId;
			  		try {
			  				let theDateOf = scope.getDateYearMonthDay(this.dateWanted);
			  			    let theList = scope.findBoardList(theDateOf);
					  		// Find the Card of the Lists in the Given Day base on it's memberId.
					  		let theCard = scope.findCard(this.ownerId, theList);
					  		// Get the Total number of hours base on the Cards Name; ex: "11-13+21-23+23.5-24"
					  		let totalCardHours = scope.calculateCardNameToHours(theCard);
					  		//  Get the Day of the Card: 1, 0.5, 0. 
					  		let CardsDay = scope.calculateTheCardsHourToDay(totalCardHours);
					  		return CardsDay;
			  		} catch(e) {
			  			return 0;
			  			// console.log(e);
			  			
			  		}
			  	};
			  	// store to the array the dates of this Week
			  	scope.getCurrentWeeksArray = (week) => {
			  		let weekDate = [];
			  		for (var i = 0; i < week.length; i++) {
			  			const datesLong = week[i];
			  			const weekYMD = datesLong.Date;
			  			const weekParsed =  weekYMD.getFullYear() + '/' + ('0' + ( weekYMD.getMonth() + 1)).slice(-2) + '/' +  weekYMD.getDate();
			  			weekDate.push(weekParsed);
			  		}
			  		return weekDate;
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
			  			cardsCalculated.push(Math.abs(eval(cardsFromArray)));
			  		}
			  		return cardsCalculated;
			  	};		
			  	scope.calculateCardsWeeklyHoursToDay = (CardsHourArray) => {			  		
			  		let cardsWeeklyTotalDay = [];

			  		for (var i = 0; i < CardsHourArray.length; i++) {
			  			let cardHour = CardsHourArray[i];
			  			let cardDay = scope.calculateTheCardsHourToDay(cardHour)
			  			cardsWeeklyTotalDay.push(cardDay)
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
			  	scope.getMembersWeeklyTotal = (Dates, memberID) => {
			  		try {
			  			// Get an array of Weekly Dates
				  		let datesOfTheWeek = scope.getCurrentWeeksArray(Dates);
				  		// Get an array of Lists from the Desired Weeks
				  		let weeklyListsName = scope.getListsOfTheWeeks(datesOfTheWeek); 
				  		// Get an array of Cards from the Desired Weeks
				  		let cardsWeekly = scope.getCardsOfMemberWeeklyList(weeklyListsName, memberID);
				  		// Calculate Cards array to Hours
				  		let cardsWeeklyHours = scope.calculateCardsTotalWeeklyToHours(cardsWeekly);
				  		// Calculate Cards array to TotalDay
				  		let cardsWeeklyDays = scope.calculateCardsWeeklyHoursToDay(cardsWeeklyHours);
				  		// 
				  		let cardsWeeklyTotalDays = scope.calculateTotalWeekDay(cardsWeeklyDays);


				  		return cardsWeeklyTotalDays;
			  		} catch(e) {
			  			// statements
			  			return 0;
			  			// console.log(e);
			  		}
			  	};
			  	scope.weeklyDatesToWords = (weeklyDatesArray) => {
			  		var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
			  		let weeklyDatesWordsCont = [];

			  		for (var i = 0; i < weeklyDatesArray.length; i++) {
			  			let weeklyWordofDates =  weeklyDatesArray[i].Date;
			  			let x = days[weeklyWordofDates.getDay()];
			  			weeklyDatesWordsCont.push(x);
			  		}
			  		return weeklyDatesWordsCont;
			  	};
			  	scope.checkWorkingDays = (weeklyDaysArrays) => {
			  		let validWorkingDays = [];
			  		for (var i = 0; i < weeklyDaysArrays.length; i++) {
			  			let theDays = weeklyDaysArrays[i];
			  			if (theDays != "Saturday" && theDays != "Sunday") {
			  				validWorkingDays.push(theDays);
			  			}
			  		}
			  		return validWorkingDays
			  	}

			  	scope.getWeeklyTotalWork = (weeklyDates) => {
					let weeklyDaysWordArrays = scope.weeklyDatesToWords(weeklyDates);
					let validWeeklyWorkingDays = scope.checkWorkingDays(weeklyDaysWordArrays);
					return validWeeklyWorkingDays.length;
			  	};

			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/statistics/directives/weeklyDir.html",

	  	}
	});

//  ---------------------------------- Services To Get Weekly Output------------------------------------------------- //
  
  
angular.module('workingHoursTrello').service('weekS', function(dayS){
  
    this.weekDatesArray = (week) => {
      let weekDate = [];
      for (var i = 0; i < week.length; i++) {
        let date = week[i];
        let weekYMD = date.Date;
        let weekParsed =  weekYMD.getFullYear()+'/'+ ('0'+( weekYMD.getMonth() + 1)).slice(-2) +'/'+ weekYMD.getDate();
        weekDate.push(weekParsed);
      }
      return weekDate;
    };
    this.arrayListsID = (nameArrays, boardsLists) => {           
      let foundListWeek = [];
      // We loop through the Array
      for (var i = 0; i < nameArrays.length; i++) {
        let nameToFind = new Date(nameArrays[i]);
        let dateRef = nameToFind.getFullYear()+'/'+nameToFind.getMonth()+'/'+nameToFind.getDate();
          // We loop through the boardsLists
          for (var x = 0; x < boardsLists.length; x++) {
            let boardsListArray = boardsLists[x];
            let boardListNameParsed = new Date(boardsListArray.name.substr(0,boardsListArray.name.indexOf(' ')));
            let dateList = boardListNameParsed.getFullYear()+'/'+boardListNameParsed.getMonth()+'/'+boardListNameParsed.getDate();
            if (dateList == dateRef) { /** we compare the Array weekly Date to our Array of Board's Lists */
            foundListWeek.push(boardsListArray.id); /** If True we push it to the FoundListWeek */
            }
          }
        }
      return foundListWeek;
    };
    this.getCardsOfMemberList = (listsIdArray, memberId, cardsArray) => {
      let cardWeeklyCont = []; /** Container for the Array of Cards. */
      for (var i = 0; i < cardsArray.length; i++) {
        let cardsFromArray = cardsArray[i];
        for (var x = 0; x < listsIdArray.length; x++) {
          let listsID = listsIdArray[x];
          if (cardsFromArray.idList == listsID && cardsFromArray.idMembers == memberId) {
            cardWeeklyCont.push(cardsFromArray.name);
          }
        }
      }
      return cardWeeklyCont;
    };
    this.calculateCardsTotalNameToHours = (cardsArrayName) => { /** an array of Card's Name */
      let cardsCalculated = [];
      for (var i = 0; i < cardsArrayName.length; i++) {
        let cardsFromArray = cardsArrayName[i];
        try { /** 8-12+14-16 = 6*/
        cardsCalculated.push(Math.abs(eval(cardsFromArray)));
        } catch (error) {
          cardsCalculated.push(0)  
        }
      }
      return cardsCalculated;
    };
    this.calculateCardsHoursToDay = (CardsHourArray) => {	/** array of hours */		  		
      let cardsWeeklyTotalDay = [];
      for (var i = 0; i < CardsHourArray.length; i++) {
        let cardHour = CardsHourArray[i];
        let cardDay = dayS.calculateTheCardsHourToDay(cardHour)
        cardsWeeklyTotalDay.push(cardDay) /** array of day */
      }
      return cardsWeeklyTotalDay;
    };
    this.calculateDaysTotalDay = (cardsTotalWeeklyDays) => {
      let cardsCount = 0;
  
      for (var i = 0; i < cardsTotalWeeklyDays.length; i++) {
        let cardsTotalDays = cardsTotalWeeklyDays[i];
        cardsCount += cardsTotalDays;
      }
      return cardsCount;
    };
    // Calculate the Total Output per week
    this.getDaysTotalOutput = (DatesByDay, memberId, boardLists, boardCards) => {
      try {
        let weeklyListsId = this.arrayListsID(DatesByDay, boardLists); 
        /** Get an array of Cards Name from the Desired Weeks */
        let cardsWeekly = this.getCardsOfMemberList(weeklyListsId, memberId, boardCards);
        /** Calculate Cards name's array to Hours */
        let cardsWeeklyHours = this.calculateCardsTotalNameToHours(cardsWeekly);
        /** Calculate cards from hours to days */
        let cardsWeeklyDays = this.calculateCardsHoursToDay(cardsWeeklyHours);
        /** Calculate cards Array of days to Total */ 
        let cardsWeeklyTotalDays = this.calculateDaysTotalDay(cardsWeeklyDays);
        return cardsWeeklyTotalDays;
      } catch(e) {
        // statements
        return 0;
        // console.log(e);
      }
    };
    this.weeklyDatesToWords = (weeklyDatesArray) => { /** convert 0-6 to weekdays */
      var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      let weeklyDatesWordsCont = [];
  
      for (var i = 0; i < weeklyDatesArray.length; i++) {
        let weeklyWordofDates =  weeklyDatesArray[i].Date;
        let x = days[weeklyWordofDates.getDay()];
        weeklyDatesWordsCont.push(x);
      }
      return weeklyDatesWordsCont;
    };
    this.checkWorkingDays = (weeklyDaysArrays) => { /** this will remove saturday and sunday */ 
      let validWorkingDays = [];
      for (var i = 0; i < weeklyDaysArrays.length; i++) {
        let theDays = weeklyDaysArrays[i];
        if (theDays != "Saturday" && theDays != "Sunday") {
          validWorkingDays.push(theDays);
        }
      }
      return validWorkingDays
    }
    this.removeWeekEnds = (datesArray) => { /** this will remove saturday and sunday */
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
    this.weeklyNeedToWork = (weeklyDates) => { /** this will give you the total days members should work */
      let weeksDatesByDay = this.weekDatesArray(weeklyDates);
      let weeksWorkingDates = this.removeWeekEnds(weeksDatesByDay);
      // return weeksWorkingDates.length;
      return weeksDatesByDay
    };
  });
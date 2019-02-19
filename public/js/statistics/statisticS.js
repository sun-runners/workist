//  ---------------------------------- Services To Get Daily Output------------------------------------------------- //
  
  
  angular.module('workingHoursTrello').service('dayS', function() {
  
    this.getYmd = (theDate) => {
      return getDate = theDate.getFullYear() + '/' + ('0' + (theDate.getMonth() + 1)).slice(-2) + '/' + theDate.getDate();
    }  
    this.findBoardList = (boardLists, dateOfList) => {
        for (let i = 0; i < boardLists.length; i++) {
          let list = boardLists[i];
          let listName = list.name.substr(0,list.name.indexOf(' '))
          if (listName == dateOfList) {
              return list
            }
        }
    }
    this.findListMemberCard = (cardsArray, ownerId, list) => {
      for (let i = 0; i < cardsArray.length; i++) {
        const cards = cardsArray[i];
        if (cards.idMembers == ownerId && cards.idList == list.id) {
          return cards;
        }
      }	
    }
    this.calculateCardNameToHours = (card) => {
      if (card.name.match(/[a-z]/i)) {
        return 0;
      }else{
        try {
          let totalHours = eval(card.name);
          return Math.abs(totalHours);
        } 
        catch (error) {
          return 0;
        }	
      }		  		
    };
    this.calculateTheCardsHourToDay = (cardsHour) => {
      if (cardsHour >= 8) {
        return cardsDay = 1;
      }else if (cardsHour <= 8 && cardsHour > 4) {
        return 	cardsDay = 0.5;
      }else if (cardsHour <= 4) {
        return cardsDay = 0;
      }
    };
    this.getDailyCardValue = (dateWanted, ownerId, listsArray, cardsArray) => {
      try {
        // Get the Dase with proper format
        let theDate = this.getYmd(dateWanted);
        // Get the lists base on the Dates
        let theList = this.findBoardList(listsArray, theDate);
        // Find the Card of the Lists in the Given Day base on it's memberId.
        let theCard = this.findListMemberCard(cardsArray, ownerId, theList);
        // Get the Total number of hours base on the Cards Name; ex: "11-13+21-23+23.5-24"
        let totalCardHours = this.calculateCardNameToHours(theCard);
        // Get the Day of the Card: 1, 0.5, 0. 
        let CardsDay = this.calculateTheCardsHourToDay(totalCardHours);
        return CardsDay;
      } catch(e) {
        return 0;
        // console.log(e);
      }
    };
  });
  
  
//  ---------------------------------- Services To Get Weekly Output------------------------------------------------- //
  
  
  angular.module('workingHoursTrello').service('weekS', function(dayS){
  
    this.weekDatesArray = (week) => {
      let weekDate = [];
      for (var i = 0; i < week.length; i++) {
        let date = week[i];
        let weekYMD = date.Date;
        let weekParsed =  weekYMD.getFullYear() + '/' + ('0' + ( weekYMD.getMonth() + 1)).slice(-2) + '/' +  weekYMD.getDate();
        weekDate.push(weekParsed);
      }
      return weekDate;
    };
    this.arrayListsID = (nameArrays, boardsLists) => {           
      let foundListWeek = [];
      // We loop through the Array
      for (var i = 0; i < nameArrays.length; i++) {
        let nameToFind = nameArrays[i];
          // We loop through the boardsLists
          for (var x = 0; x < boardsLists.length; x++) {
            let boardsListArray = boardsLists[x];
            let boardListNameParsed = boardsListArray.name.substr(0,boardsListArray.name.indexOf(' '));
            if (nameToFind == boardListNameParsed) { /** we compare the Array weekly Date to our Array of Board's Lists */
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
    this.calculateCardsTotalNameToHours = (cardsArrayName) => {
      let cardsCalculated = [];
      for (var i = 0; i < cardsArrayName.length; i++) {
        let cardsFromArray = cardsArrayName[i];
        try {
        cardsCalculated.push(Math.abs(eval(cardsFromArray)));
        } catch (error) {
          cardsCalculated.push(0)  
        }
      }
      return cardsCalculated;
    };
    this.calculateCardsHoursToDay = (CardsHourArray) => {			  		
      let cardsWeeklyTotalDay = [];
  
      for (var i = 0; i < CardsHourArray.length; i++) {
        let cardHour = CardsHourArray[i];
      
        let cardDay = dayS.calculateTheCardsHourToDay(cardHour)
        cardsWeeklyTotalDay.push(cardDay)
      }
      return cardsWeeklyTotalDay;
    };
    this.calculateArrayTotalDay = (cardsTotalWeeklyDays) => {
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
        // Get an array of Cards from the Desired Weeks
        let cardsWeekly = this.getCardsOfMemberList(weeklyListsId, memberId, boardCards);
        // Calculate Cards array to Hours
        let cardsWeeklyHours = this.calculateCardsTotalNameToHours(cardsWeekly);
        // Calculate cards from hours to days
        let cardsWeeklyDays = this.calculateCardsHoursToDay(cardsWeeklyHours);
        // Calculate Cards array to TotalDay 
        let cardsWeeklyTotalDays = this.calculateArrayTotalDay(cardsWeeklyDays);
  
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
      return weeksWorkingDates.length;
    };
  });


//  ---------------------------------- Services To Get Monthly Output------------------------------------------------- //


  angular.module('workingHoursTrello').service('monthS', function(weekS) {

    //  Get the Dates of the month of that year
    this.monthDaysDate = (year, month) => { 
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
    this.getInBetweenDates = (datesArray, startDate, endDate) => {
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
    this.getWeeksValue = (year, month, dateStart, dateEnd, memberId, boardLists, boardCards) => { /** get the Total days members have work per week of the month */
        let monthsDatesByDay = this.monthDaysDate(year, month);
        let weeksDatesByDay = this.getInBetweenDates(monthsDatesByDay, dateStart, dateEnd);
        let monthWeeksOutput = weekS.getDaysTotalOutput(weeksDatesByDay, memberId, boardLists, boardCards)
        return monthWeeksOutput;
    }
    this.weeklyNeedToWork = (year, month, dateStart, dateEnd) => { /** get the Total days members must work per week of the month */
        let monthsDatesByDay = this.monthDaysDate(year, month);
        let weeksDatesByDay = this.getInBetweenDates(monthsDatesByDay, dateStart, dateEnd);
        let weeksToWorkDates = weekS.removeWeekEnds(weeksDatesByDay)
        return weeksToWorkDates.length;
    }
    this.getMonthsValue = (year, month, boardLists, memberId, boardCards) => { /** get the total days members have work per month */
        try {
          let monthDatesByDay = this.monthDaysDate(year, month); 
          let totalhaveWork = weekS.getDaysTotalOutput(monthDatesByDay, memberId, boardLists, boardCards);
          return totalhaveWork;          
        } catch (error) {
          return 0
        }
    }
    this.monthsNeedtoWork = (year, month) => { /** Get all the days member have to work this month*/
      let monthsDatesByDay = this.monthDaysDate(year, month);
      let monthsToWorkDates = weekS.removeWeekEnds(monthsDatesByDay);
      return monthsToWorkDates.length;
    }
  });


  //  ---------------------------------- Services To Get Yearly Output------------------------------------------------- //


  angular.module('workingHoursTrello').service('yearS', function(monthS, weekS) {
    this.getAllDates = (year, months) => {
      let allYearDates = [];
      for(var i = 0; i < months.length; i++) {
        let month = months[i]
        let dates = monthS.monthDaysDate(year, month.value);
        allYearDates = allYearDates.concat(dates)
      }
      return allYearDates;
    }
    this.getYearsValue = (year, month, memberId, boardLists, boardCards) => {
      try {
        let yearsDatesByDay = this.getAllDates(year, month);
        let totalhaveWorks = weekS.getDaysTotalOutput(yearsDatesByDay, memberId, boardLists, boardCards);
        // return totalhaveWork;
        return totalhaveWorks;
      } catch (error) {
        return 0;
      }
    }
    this.yearsNeedToWork = (year, month) => {
      let yearsDatesByDay = this.getAllDates(year, month);
      let yearsToWorkDays = weekS.removeWeekEnds(yearsDatesByDay);
      return yearsToWorkDays.length
    }
  });


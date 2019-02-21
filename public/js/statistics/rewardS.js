  
  
//  ---------------------------------- Services To Get Time Number------------------------------------------------- //
  
  
angular.module('workingHoursTrello').service('timeS', function(monthS, weekS, yearS) {
    this.totalHours = (hoursArray) => {
      let hoursTotal = 0;
      for (let i = 0; i < hoursArray.length; i++) {
        const hour = hoursArray[i];
        hoursTotal = hoursTotal + hour;
      }
      return hoursTotal;
    }
    this.monthlyTime = (year, month, boardLists, memberId, boardCards) => {
      try {
        let monthDateByDay = monthS.monthDaysDate(year, month); 
        let listsId = weekS.arrayListsID(monthDateByDay, boardLists); 
        let memberCards = weekS.getCardsOfMemberList(listsId, memberId, boardCards); /** Get an array of Cards */
        /** Calculate Cards array to Hours */
        let cardsMemberHours = weekS.calculateCardsTotalNameToHours(memberCards);
        let hoursTotal = this.totalHours(cardsMemberHours);
        if (hoursTotal) {
            return hoursTotal
        }else{
            return "-"
        }
      } catch (error) {
        // console.log(error)
      }
    }
    this.yearlyTime = (year, months, boardLists, memberId, boardCards) => {
      try {
        let allDatesByDay = yearS.getAllDates(year, months);
        let listsId = weekS.arrayListsID(allDatesByDay, boardLists);      
        let memberCards = weekS.getCardsOfMemberList(listsId, memberId, boardCards);/** Get an array of Cards */
        let cardsMemberHours = weekS.calculateCardsTotalNameToHours(memberCards);/** Calculate Cards array to Hours */
        let hoursTotal = this.totalHours(cardsMemberHours);
        if (hoursTotal) {
            return hoursTotal
        }else{
            return "-";
        }
      } catch (error) {
        // console.log(error)
      }
    };
  });
    
  
//  ---------------------------------- Services To Get Task Number------------------------------------------------- //
  
  
  angular.module('workingHoursTrello').service('taskS', function(monthS, weekS, yearS) {

    this.getCheckItemMemberList = (listsIdArray, memberId, cardsArray) => {
      let cardWeeklyCont = []; /** Container for the Array of Cards. */
      for (var i = 0; i < cardsArray.length; i++) {
        let cardsFromArray = cardsArray[i];
        for (var x = 0; x < listsIdArray.length; x++) {
          let listsID = listsIdArray[x];
          if (cardsFromArray.idList == listsID && cardsFromArray.idMembers == memberId) {
            cardWeeklyCont.push(cardsFromArray.badges.checkItemsChecked);
          }
        }
      }
      return cardWeeklyCont;
    };
    this.calculateTotalTasks = (tasks) => {
      let totalTask = 0;
      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        totalTask = totalTask + task
      }
      return totalTask;
    };
    this.monthlyTasks = (year, month, boardLists, memberId, boardCards) => {
      try {
        let monthDateByDay = monthS.monthDaysDate(year, month);
        let listsId = weekS.arrayListsID(monthDateByDay, boardLists); 
        let cardsCheckItems = this.getCheckItemMemberList(listsId, memberId, boardCards);
        let totalTask = this.calculateTotalTasks(cardsCheckItems);
        if (totalTask) {
          return totalTask;
        }else{
          return "-";
        }       
      } catch (error) {
        // console.log(error)
      }
    }
    this.yearlyTasks = (year, months, boardLists, memberId, boardCards) => {
      try {
        let allDatesByDay = yearS.getAllDates(year, months);
        let listsId = weekS.arrayListsID(allDatesByDay, boardLists); 
        let cardsCheckItems = this.getCheckItemMemberList(listsId, memberId, boardCards);
        let totalTask = this.calculateTotalTasks(cardsCheckItems);
        if (totalTask) {
          return totalTask;
        } else {
          return "-";
        }
      } catch (error) {
        // console.log(error);
      }
    }
  });


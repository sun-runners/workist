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
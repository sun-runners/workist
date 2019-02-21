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
        if (hoursTotal > 0) {
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
        /** Calculate Cards array to Hours */
        let cardsMemberHours = weekS.calculateCardsTotalNameToHours(memberCards);
        let hoursTotal = this.totalHours(cardsMemberHours);
        if (hoursTotal > 0) {
            return hoursTotal
        }else{
            return "-";
        }
      } catch (error) {
            // console.log(error)
      }
    };
  });


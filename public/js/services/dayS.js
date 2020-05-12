//  ---------------------------------- Services To Get Daily Output------------------------------------------------- //
  
  
angular.module('workingHoursTrello').service('dayS', function($rootScope) {
  
    this.getYmd = (theDate) => {
      return getDate = theDate.getFullYear() + '/' + ('0' + (theDate.getMonth() + 1)).slice(-2) + '/' + theDate.getDate();
    }  
    this.findBoardList = (boardLists, dateAsked) => { /** Find Board's List base on Date'YYYY/MM/DD' */
        for (let i = 0; i < boardLists.length; i++) {
          let list = boardLists[i];
          let listName = list.name.substr(0,list.name.indexOf(' '))
          let dateList = moment(new Date(listName), "YYYY/MM/DD").format(); /** We Format the List Name and List Asked to compare them */
          let dateRef = moment(new Date(dateAsked), "YYYY/MM/DD").format();          

          if (dateRef == dateList) {
              return list
            }
        }
    }
    this.findListMemberCard = (cardsArray, ownerId, list) => { /** Get Members Cards */
      let foundCard = cardsArray.find(card => card.idMembers == ownerId && card.idList == list.id)
      return foundCard
    }
    this.calculateCardNameToHours = (card) => {
      if (card.name.match(/[a-z]/i)) { /** Card name: 12-13+14-18  to hours = 5*/
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
    this.getDailyCardValue = (dateOfDay, memberId) => {
      const member_worked_data = $rootScope.workedInfo.find(item => item.id == memberId)
      const current_month_worked = member_worked_data.workedData[dateOfDay.getMonth()]
      const current_day_worked = current_month_worked.worked.find(item => item.day == dateOfDay.getDate())
      if (current_day_worked) {
        const time = current_day_worked.cards.time
        if (time >= 8) return 1;
        if (time < 8 && time > 4) return 0.5;
        if (time > 4) return 0;
      }
      return 0
    };
  });
//  ---------------------------------- Services To Get Daily Output------------------------------------------------- //
  
  
angular.module('workingHoursTrello').service('dayS', function() {
  
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
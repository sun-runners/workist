
angular.module('workingHoursTrello').service('totalSalaryS', function(){
    this.getListByName = (boardLists, nameToFind) => {
        let foundList =  boardLists.find((list) => list.name == nameToFind)
        return foundList.id;
    }
    this.getEntryDate = (boardCards, listId, memberId) => { /** we get the entry date of the member */
        let foundCard = boardCards.find((card) => card.idMembers == memberId && card.idList == listId);
        return new Date(foundCard.name.substr(0,foundCard.name.indexOf(' ')));
    }
    this.diffInMonths = (from, to) => {
        let months = to.getMonth() - from.getMonth() + (12 * (to.getFullYear() - from.getFullYear()));
        if(to.getDate() < from.getDate()){
            let newFrom = new Date(to.getFullYear(),to.getMonth(),from.getDate());
            if (to < newFrom  && to.getMonth() == newFrom.getMonth() && to.getYear() %4 != 0){
                months--;
            }
        }
        return months;
    }
    this.monthDuration = (boardLists, boardCards, nameToFind, currentDate, memberId) => {
        try { /** we get the total duration vy month */
            let listId = this.getListByName(boardLists, nameToFind);
            let entryDate = this.getEntryDate(boardCards, listId, memberId);
            let Month = this.diffInMonths(entryDate, currentDate);
        return  Month;
        } catch (error) {
            return '-';
        }
    }
    this.salaryFromCardName = (boardCards, listId, memberId) => {
        let foundCard = boardCards.find((card) => card.idMembers == memberId && card.idList == listId);
        return salary = foundCard.name.substr(foundCard.name.indexOf(' ')+1);
        // return foundCard
    }
    this.increasePer = (monthDuration) => {
        let result = ((divResult = monthDuration / 6) <= 0 ? 0 : Math.floor(divResult));
        if (result > 2) {
            return ((divResult = monthDuration / 12) <= 0 ? 0 : Math.floor(divResult) + 1);
        }
        return result
    }
    this.currentIncreased = (increasedPer, value) => {
        return value * increasedPer;
    }
    this.salary = (boardLists, boardCards, nameToFind, memberId, monthDuration) => { /** get salary per month */
        try {
            let listId = this.getListByName(boardLists, nameToFind);
            let startSalary = this.salaryFromCardName(boardCards, listId, memberId)
            let increasePer = this.increasePer(monthDuration);
            let salaryIncreased = this.currentIncreased(increasePer, 5000)
           return (parseInt(startSalary) + parseInt(salaryIncreased)).toLocaleString() +' PHP'; /** parse string number to integer and add commas every 3 digits */
        } catch (error) {
            return '-';
        }
    }
    this.betweenDates = (startDate, endDate) => {
        let dates = [], /** to get all the dates between two dates */
            currentDate = startDate,
            addDays = function(days) {
              let date = new Date(this.valueOf());
              date.setDate(date.getDate() + days);
              return date;
            };
        while (currentDate <= endDate) {
            // if (condition) {
                
            // }
          dates.push(currentDate.getFullYear() + '/' + (currentDate.getMonth() + 1) + '/' + currentDate.getDate());
          currentDate = addDays.call(currentDate, 1);
        }
        return dates;
      };

    this.percentage = (boardLists, boardCards, nameToFind, currentDate, memberId) => {
        let listId = this.getListByName(boardLists, nameToFind);
        let entryDate = this.getEntryDate(boardCards, listId, memberId);
        let datesToWork = this.betweenDates(entryDate, currentDate)
        return datesToWork;
    }
  });
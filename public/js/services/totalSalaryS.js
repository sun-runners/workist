
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
        var months = to.getMonth() - from.getMonth() + (12 * (to.getFullYear() - from.getFullYear()));
    
        if(to.getDate() < from.getDate()){
            var newFrom = new Date(to.getFullYear(),to.getMonth(),from.getDate());
            if (to < newFrom  && to.getMonth() == newFrom.getMonth() && to.getYear() %4 != 0){
                months--;
            }
        }
    
        return months;
    }
    this.monthDuration = (boardLists, boardCards, memberId, nameToFind, currentDate) => {
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

    this.salary = (boardLists, boardCards, memberId, nameToFind) => {
        try {
            let listId = this.getListByName(boardLists, nameToFind);
            let startSalary = this.salaryFromCardName(boardCards, listId, memberId)
           return parseInt(startSalary).toLocaleString() +' PHP'; /** parse string number to integer and add commas every 3 digits */
            
        } catch (error) {
            return '-';
        }
    }
  });
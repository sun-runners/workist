
angular.module('workingHoursTrello').service('totalSalaryS', function(){
    this.getListByName = (boardLists, nameToFind) => {
        let foundList =  boardLists.find((list) => list.name == nameToFind)
        return foundList.id;
    }
    this.getEntryDate = (boardCards, listId, memberId) => {
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
    
    this.monthDuration = (boardLists, boardCards, memberId, currentDate, nameToFind) => {
        try {
            let listId = this.getListByName(boardLists, nameToFind);
            let entryDate = this.getEntryDate(boardCards, listId, memberId);
            let Month = this.diffInMonths(entryDate, currentDate);
        return  Month;
        } catch (error) {
            return '-'
        }
    }
  });
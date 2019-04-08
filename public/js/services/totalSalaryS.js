
angular.module('workingHoursTrello').service('totalSalaryS', function(){
    this.getListByName = (boardLists, nameToFind) => {
        let foundList =  boardLists.find((list) => list.name == nameToFind)
        return foundList.id;
    }
    this.getEntryDate = (boardCards, listId, memberId) => {
        let foundCard = boardCards.find((card) => card.idMembers == memberId && card.idList == listId);
        return new Date(foundCard.name.substr(0,foundCard.name.indexOf(' ')));
    }
    this.monthDiff = (d1, d2) => {
        var months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth() + 1;
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }
    
    this.monthDuration = (boardLists, boardCards, memberId, currentDate, nameToFind) => {
        try {
            let listId = this.getListByName(boardLists, nameToFind);
            let entryDate = this.getEntryDate(boardCards, listId, memberId);
            let Month = this.monthDiff(entryDate, currentDate);
        return  Month+1;
        } catch (error) {
            return '-'
        }
    }
  });
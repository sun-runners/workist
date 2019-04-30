angular.module('workingHoursTrello').service('privateSalaryS', function(totalSalaryS){
    this.getListByName = (boardLists, nameToFind) => {
        let foundList =  boardLists.find((list) => list.name == nameToFind)
        return foundList.id;
    }
    this.getEntryDate = (boardCards, listId, memberId) => { /** we get the entry date of the member */
        let foundCard = boardCards.find((card) => card.idMembers == memberId && card.idList == listId);
        return new Date(foundCard.name.substr(0,foundCard.name.indexOf(' ')));
    }

    this.workedMonths = (boardLists) => {
        return boardLists.length
    }
  });
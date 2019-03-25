angular.module('workingHoursTrello').service('nationalityS', function(holidayS) {

    this.findListCards = (listId, calendarCards) => {
        let cards = [];
        for (let i = 0; i < calendarCards.length; i++) {
            const card = calendarCards[i];
            if (card.idList == listId) {
                cards.push({name:card.name, members:card.idMembers});
            }
        }
        return cards;
    }
    this.findNationality = (idMember, nationCards) => {
        for (let i = 0; i < nationCards.length; i++) { /** determine members nationality */
            const nation = nationCards[i];
            for (let x = 0; x < nation.members.length; x++) {
                const member = nation.members[x];
               if (idMember == member) {
                   return nation.name /** will return either philippines or korea */
               }
            }
        }
    }
    this.membersNationality = (id, calendarCards, calendarLists) => {
        try {
            let listId = holidayS.getListByName('NATIONALITY', calendarLists)
            let nationsCards = this.findListCards(listId, calendarCards)
            let nationality = this.findNationality(id, nationsCards)
        return nationality;
        } catch (error) {
            
        }
    }
});
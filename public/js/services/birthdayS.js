
//  ---------------------------------- Services for Birthday ------------------------------------------------- //
  
angular.module('workingHoursTrello').service('birthdayS', function() {

    this.findBoardList = (boardLists, stringName) => {
        return boardLists.find(item => { /** Find List base on the given name*/
           return item.name == stringName;
        });
    }
    this.findListCard = (memberId, listId, boardCards) => {
        for (let i = 0; i < boardCards.length; i++) { /** Find Card base on memberId and ListId */
            let card = boardCards[i];
            if (card.idMembers == memberId && card.idList == listId) {
                return card.name
            }
        }
    }
    this.getFullBirthDate = (memberId, boardLists, boardCards, strName) => {
        try { /** Get Full BirthDate */
            let list = this.findBoardList(boardLists, strName);
            let cardName = this.findListCard(memberId, list.id, boardCards);
            let date = new Date(cardName);
            return date;
        } catch (error) {
            return "-";
        }
    }
    this.removeBirthdate = (memberId, boardLists, boardCards, strName, workingDates) => { //** We remove the birthDates from the lists of Dates */
        try {
            let birthday = this.getFullBirthDate(memberId, boardLists, boardCards, strName);
            let dateBirth = new Date(birthday);
            let datesResult = [];
            for (let i = 0; i < workingDates.length; i++) {
                const date = new Date(workingDates[i]);
                if (`${date.getFullYear()}/${date.getMonth()}/${date.getDate()}` != `${date.getFullYear()}/${dateBirth.getMonth()}/${dateBirth.getDate()}`) {
                    datesResult.push(date.getFullYear() + "/" + (date.getMonth()+1) + "/" + date.getDate());
                }
            }
            return datesResult
        } catch (error) {
            
        }
    }
    this.getBirthdays = (boardLists, boardCards, strName) => {
        let cards = []; /** Will Contain Cards from the List base on the Given strName */
            for (let i = 0; i < boardLists.length; i++) {        
                let list = boardLists[i];
                if (list.name == strName) {
                    for (let x = 0; x < boardCards.length; x++) {
                        let card = boardCards[x];
                        if (card.idList == list.id) {
                            let date = new Date(card.name);
                            cards.push(date);
                            // console.log({date:date, memberId:card.idMembers[0]});
                        }
                    }
                }
            }
            return cards;
    }
});

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
    this.getBirthdate = (memberId, boardLists, boardCards, strName) => {
        let fullDate = this.getFullBirthDate(memberId, boardLists, boardCards, strName)
        let date = moment(fullDate, "YYYY-MM-DD").format('DD MMMM');
        return date;
    }
    this.getBirthday = (memberId, boardLists, boardCards, strName) => {
        let date = this.getFullBirthDate(memberId, boardLists, boardCards, strName);
        return date.getDate();
    }
    this.getBirthMonth = (memberId, boardLists, boardCards, strName) => {
        let date = this.getFullBirthDate(memberId, boardLists, boardCards, strName);
        return date.getMonth();
    }
    this.getBirthYear = (memberId, boardLists, boardCards, strName) => {
        try {
            let date = this.getFullBirthDate(memberId, boardLists, boardCards, strName);
            return date.getFullYear();
        } catch (error) {
            
        }
    }
    this.getAge = (memberId, boardLists, boardCards, strName) => {
        try {
            let list = this.findBoardList(boardLists, strName);
            let cardName = this.findListCard(memberId, list.id, boardCards);
            let date = Math.floor((new Date() - new Date(cardName).getTime()) / 3.15576e+10);
            return date;
        } catch (error) {
            return "-";
        }
    }
    this.removeBirthdate = (memberId, boardLists, boardCards, strName, workingDates) => {
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
    }
});
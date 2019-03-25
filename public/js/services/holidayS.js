
//  ---------------------------------- Services for holidayS ------------------------------------------------- //

angular.module('workingHoursTrello').service('holidayS', function() {
   
    this.getHolidayName = (cardName) => {
        return name = cardName.substr(cardName.indexOf(' ')+1);
    }
    this.getHolidayFullDate = (year, cardName) => {
        let rawDate = cardName.substr(0, cardName.indexOf(" "));
        let holiDate = new Date(year + "/" + rawDate);
        let monthDate = moment(holiDate.getMonth() + 1, 'MM').format('MMMM');
        let dayDate = holiDate.getDate();
        let yearDate = holiDate.getFullYear();
        let fullDate = monthDate + " " +dayDate + ", "+ yearDate;
        return fullDate;
    }
    this.getHolidayMonth = (year, cardName) => { /** get Month of the holiday */
        let rawDate = cardName.substr(0, cardName.indexOf(" "));
        let holiDate = new Date(year+ '/' +rawDate);
        let holiMonth = holiDate.getMonth();
        return holiMonth;
    }
    this.getHolidayDate = (year, cardName) => { /** get Holiday date of the card */
        let rawDate = cardName.substr(0, cardName.indexOf(" "));
        let holiDate = new Date(year+ '/' +rawDate);
        let holiDay = holiDate.getDate();
        return holiDay;
    }
    this.getDayOfWeek = (year, cardName) => {
        let rawDate = cardName.substr(0, cardName.indexOf(" "));
        let holiDate = new Date(year+ '/' +rawDate);
        let weekDay = holiDate.toLocaleDateString(locale, { weekday: 'long' }); 
        // let weekDay = holiDate.getDay();
        return weekDay;
    }
    this.getHolidayCards = (listId, boardCards) => {
        let cards = [];
        for (let x = 0; x < boardCards.length; x++) {
            let card = boardCards[x];
            if (card.idList == listId) {
                cards.push(card.name);
            }
        }
        return cards;
    }
    this.getListByName = (strToFind, boardLists) => {
        for (let x = 0; x < boardLists.length; x++) {
            let list = boardLists[x];
            if (list.name == strToFind) {
                return list.id;
            }
        }
    }
});
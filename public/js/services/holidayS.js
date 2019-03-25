
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
            let list = boardLists[x]; /** we loop through the board' lists and getthe list id of the list base on the given name */
            if (list.name == strToFind) {
                return list.id;
            }
        }
    }
    this.getHolidayDates = (year, listId, boardCards) => {
        let cards = []; /** Here we get the Holiday Dates */
        for (let i = 0; i < boardCards.length; i++) {
            const card = boardCards[i];
            if (card.idList == listId) {
                let rawDate = card.name.substr(0, card.name.indexOf(" "));
                let date = new Date(year+ '/' +rawDate); 
                cards.push(date.getFullYear()+'/'+(date.getMonth()+1)+'/'+date.getDate())
            }
        }
        return cards
    }
    this.sameHoliday = (workDates, holidayDate) => {
        let sameDates = 0;   
        /** we'll compare the working Dates with the Holiday Dates and will return the number of the same dates*/
        for (let i = 0; i < workDates.length; i++) {
            const dateDate = workDates[i];
            let rawDate = new Date(dateDate);
            let workDate = rawDate.getFullYear()+'/'+(rawDate.getMonth()+1)+'/'+rawDate.getDate();
            for (let x = 0; x < holidayDate.length; x++) {
                const holiday = holidayDate[x];
                if (workDate == holiday) {
                    sameDates = sameDates + 1
                }
            }
        }
        return sameDates;
    }
    this.datesHoliday = (country, year, boardLists, boardCards, workDate) => {
       try {
        let listName = year + ' HOLIDAY ' + country;
        let listId = this.getListByName(listName, boardLists);
        let AllHolidays = this.getHolidayDates(year, listId, boardCards);
        let nonWorking = this.sameHoliday(workDate, AllHolidays)
        let newTotalWork = workDate.length - nonWorking;
        return newTotalWork
       } catch (error) {}
    }
});
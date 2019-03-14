  
//  ---------------------------------- Services for calendarS ------------------------------------------------- //
  
angular.module('workingHoursTrello').service('calendarS', function(holidayS, birthdayS) {

    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    let selectYear = document.getElementById("year");
    let selectMonth = document.getElementById("month");

    this.jump = function() {
        currentYear = parseInt(selectYear.value);
        currentMonth = parseInt(selectMonth.value);
        this.showCalendar(currentMonth, currentYear);
    }
    this.getNonWorkingDays = (boardLists, boardCards, strName, year, nation) => {
        try {
           if (strName == "BIRTHDAY") {
            let cards = []; /** Will Contain Cards from the List base on the Given strName */
            for (let i = 0; i < boardLists.length; i++) {        
                let list = boardLists[i];
                if (list.name == strName) {
                    for (let x = 0; x < boardCards.length; x++) {
                        let card = boardCards[x];
                        if (card.idList == list.id) {
                            let date = new Date(card.name);
                            cards.push(date);
                        }
                    }
                }
            }
            return cards;
           }else if(strName == "HOLIDAY") {
                let cards = []; /** Will Contain Cards from the List base on the Given strName */
                let strToFind = `${year} HOLIDAY ${nation}`; 
                let listId = holidayS.getListByName(strToFind, boardLists);
                for (let i = 0; i < boardCards.length; i++) {
                    let card = boardCards[i];
                    if (card.idList == listId) {
                        let cardRawName = card.name.substr(0, card.name.indexOf(" "));
                        let cardDate = new Date(`${year}/${cardRawName}`);
                        cards.push(cardDate);
                    }
                }
                console.log(strToFind)
                return cards
           }
        } catch (error) {
            } 
    }
    this.showCalendar = function(month, year, boardLists = 0, boardCards = 0, strName = 0, targetDay = 0, nation = 0) {
        try {
            let nonWorkingDays = this.getNonWorkingDays(boardLists, boardCards, strName, year, nation)
            let today = new Date();
            let firstDay = (new Date(year, month)).getDay();
            let daysInMonth = 32 - new Date(year, month, 32).getDate();

            let tbl = document.getElementById("calendar-body"); // body of the calendar
            // clearing all previous cells
            tbl.innerHTML = "";
            let date = 1;
            for (let i = 0; i < 6; i++) {
                // creates a table row
                let row = document.createElement("tr");
                //creating individual cells, filing them up with data.
                for (let j = 0; j < 7; j++) {
                    if (i === 0 && j < firstDay) {
                        let cell = document.createElement("td");
                        let cellText = document.createTextNode("");
                        cell.appendChild(cellText);
                        row.appendChild(cell);
                    }
                    else if (date > daysInMonth) {
                        break;
                    }
                    else {
                        let cell = document.createElement("td"); 
                        let span = document.createElement("span");
                        let cellText = document.createTextNode(date);
                        if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                            span.classList.add("bg-today");
            
                        } // color today's date
                        if (nonWorkingDays != 0) {
                            for (let x = 0; x < nonWorkingDays.length; x++) {
                                let dateNoWork = nonWorkingDays[x];
                                if (date == dateNoWork.getDate() && month == dateNoWork.getMonth()) {
                                    span.classList.add("bg-bday");
                                } // color today's date
                                if (targetDay != 0) {
                                    if (date == targetDay && month == dateNoWork.getMonth()) {
                                        span.classList.add("bg-bday-today");
                                    }
                                }
                            }
                        }
                        span.appendChild(cellText);
                        span.classList.add("w-40px")
                        span.classList.add("h-40px")
                        span.classList.add("bor-50");
                        span.classList.add("lh-40px");
                        cell.appendChild(span);
                        cell.classList.add("w-50px");
                        cell.classList.add("h-50px");
                        cell.classList.add("pl-10px")
                        cell.classList.add("pr-10px")
                       
                        row.appendChild(cell);
                        date++;
                    }
                }
                tbl.appendChild(row); // appending each row into calendar body.
            }         
        } catch (error) {
            return(error)
        }
    }
});


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
});

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
    this.getHolidayMonth = (year, cardName) => {
        let rawDate = cardName.substr(0, cardName.indexOf(" "));
        let holiDate = new Date(year+ '/' +rawDate);
        let holiMonth = holiDate.getMonth();
        return holiMonth;
    }
    this.getHolidayDate = (year, cardName) => {
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
  
//  ---------------------------------- Services for calendarS ------------------------------------------------- //
  
angular.module('workingHoursTrello').service('calendarS', function(holidayS) {

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
                        span.classList.add("w-30px")
                        span.classList.add("h-30px")
                        span.classList.add("bor-50");
                        span.classList.add("lh-30px");
                        span.classList.add("f-12px")
                        span.classList.add("fw-400")
                        span.classList.add("cen-x")
                        cell.appendChild(span);
                        cell.classList.add("w-50px");
                        cell.classList.add("h-50px");
                        cell.classList.add("pl-5px")
                        cell.classList.add("pr-5px");
                       
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




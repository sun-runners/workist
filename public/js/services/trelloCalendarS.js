  
//  ---------------------------------- Services for calendarS ------------------------------------------------- //
  
angular.module('workingHoursTrello').service('calendarS', function() {

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
    this.getCardsFromLists = (boardLists, boardCards, strName) => {
        try {
            let Cards = []; /** Will Contain Cards from the List base on the Given strName */
            for (let i = 0; i < boardLists.length; i++) {        
                const list = boardLists[i];
                if (list.name == strName) {
                    for (let x = 0; x < boardCards.length; x++) {
                        const card = boardCards[x];
                        if (card.idList == list.id) {
                            let date = new Date(card.name);
                            Cards.push(date);
                        }
                    }
                }
            }
            return Cards;
        } catch (error) {
            } 
    }
    this.showCalendar = function(month, year, boardLists = 0, boardCards = 0, strName = 0) {
        try {
            let daytarget = this.getCardsFromLists(boardLists, boardCards, strName)
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
                row.class = "bg-rd"
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
                        let cellText = document.createTextNode(date);
                        if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                            cell.classList.add("bg-today");
                        } // color today's date
                        if (daytarget != 0) {
                            for (let x = 0; x < daytarget.length; x++) {
                                const dateNoWork = daytarget[x];
                                if (date == dateNoWork.getDate() && month == dateNoWork.getMonth()) {
                                    cell.classList.add("bg-bday");
                                } // color today's date
                            }
                        }
                        cell.appendChild(cellText);
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
        return boardLists.find(item => {
           return item.name == stringName;
        });
    }
    this.findListCard = (memberId, listId, boardCards) => {
        for (let i = 0; i < boardCards.length; i++) {
            const card = boardCards[i];
            if (card.idMembers == memberId && card.idList == listId) {
                return card.name
            }
        }
    }
    this.getBirthdate = (memberId, boardLists, boardCards, strName) => {
        try {
            let list = this.findBoardList(boardLists, strName);
            let cardName = this.findListCard(memberId, list.id, boardCards);
            let date = moment(new Date(cardName)).format('DD MMMM');
            return date;
        } catch (error) {
            return "-";
        }
    }
    this.getBirthMonth = (memberId, boardLists, boardCards, strName) => {
        try {
            let list = this.findBoardList(boardLists, strName);
            let cardName = this.findListCard(memberId, list.id, boardCards);
            let date = new Date(cardName);
            return date.getMonth();
       } catch (error) {
           return "-";
       }
    }
    this.getBirthYear = (memberId, boardLists, boardCards, strName) => {
       try {
            let list = this.findBoardList(boardLists, strName);
            let cardName = this.findListCard(memberId, list.id, boardCards);
            let date = new Date(cardName);
            return date.getFullYear();
       } catch (error) {
           return "-";
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
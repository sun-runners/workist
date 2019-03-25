
//  ---------------------------------- Services To Get Monthly Output------------------------------------------------- //


angular.module('workingHoursTrello').service('monthS', function(weekS) {

    //  Get the Dates of the month of that year
    this.monthDaysDate = (year, month) => { 
        let date = new Date(year, month - 1, 1);
        let monthMomment = moment(date).format("MM");
        let result = [];
        while (date.getMonth() == month - 1) {
        //   result.push(`${date.getDate()}-${names[date.getDay()]}`);
            result.push(date.getFullYear()+ "/" + monthMomment +"/"+ date.getDate());
            date.setDate(date.getDate() + 1);
        }
        return result;
    };
    this.getInBetweenDates = (datesArray, startDate, endDate) => {
        let betweenDates = [];
        let start = moment(startDate, "YYYY/MM/DD");
        let end = moment(endDate, "YYYY/MM/DD");
        betweenDates.push(startDate)
        for (let i = 0; i < datesArray.length; i++) {
            const dateDate = datesArray[i];
            if (moment(dateDate, "YYYY/MM/DD").isBetween(start, end)) {
                betweenDates.push(dateDate);
            }
        }
        betweenDates.push(endDate)
        return betweenDates;
    };
    this.getWeeksValue = (year, month, dateStart, dateEnd, memberId, boardLists, boardCards) => { /** get the Total days members have work per week of the month */
        let monthsDatesByDay = this.monthDaysDate(year, month);
        let weeksDatesByDay = this.getInBetweenDates(monthsDatesByDay, dateStart, dateEnd);
        let monthWeeksOutput = weekS.getDaysTotalOutput(weeksDatesByDay, memberId, boardLists, boardCards)
        return monthWeeksOutput;
    }
    this.weeklyNeedToWork = (year, month, dateStart, dateEnd) => { /** get the Total days members must work per week of the month */
        let monthsDatesByDay = this.monthDaysDate(year, month);
        let weeksDatesByDay = this.getInBetweenDates(monthsDatesByDay, dateStart, dateEnd);
        let weeksToWorkDates = weekS.removeWeekEnds(weeksDatesByDay)
        return weeksToWorkDates;
        // return weeksToWorkDates.length;
    }
    this.getMonthsValue = (year, month, boardLists, memberId, boardCards) => { /** get the total days members have work per month */
        try {
          let monthDatesByDay = this.monthDaysDate(year, month); 
          let totalhaveWork = weekS.getDaysTotalOutput(monthDatesByDay, memberId, boardLists, boardCards);
          return totalhaveWork;          
        } catch (error) {
          return 0
        }
    }
    this.monthsNeedtoWork = (year, month) => { /** Get all the days member have to work this month*/
      let monthsDatesByDay = this.monthDaysDate(year, month);
      let monthsToWorkDates = weekS.removeWeekEnds(monthsDatesByDay);
      return monthsToWorkDates;
    }
  });

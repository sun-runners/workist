

  //  ---------------------------------- Services To Get Yearly Output------------------------------------------------- //


  angular.module('workingHoursTrello').service('yearS', function(monthS, weekS) {
    this.getAllDates = (year, months) => {
      let allYearDates = [];
      for(var i = 0; i < months.length; i++) {
        let month = months[i]
        let dates = monthS.monthDaysDate(year, month.value); /** months = [month:'jan', value:1] */
        allYearDates = allYearDates.concat(dates)
      }
      return allYearDates;
    }
    this.getYearsValue = (year, month, memberId, boardLists, boardCards) => {
      try {
        let yearsDatesByDay = this.getAllDates(year, month);
        let totalhaveWorks = weekS.getDaysTotalOutput(yearsDatesByDay, memberId, boardLists, boardCards);
        return totalhaveWorks;
      } catch (error) {
        return 0;
      }
    }
    this.yearsNeedToWork = (year, month) => {
      let yearsDatesByDay = this.getAllDates(year, month);
      let yearsToWorkDays = weekS.removeWeekEnds(yearsDatesByDay);
      return yearsToWorkDays;
    }
    this.monthWorked = (workedInfo) => {
      return workedInfo.length;
    }
  });
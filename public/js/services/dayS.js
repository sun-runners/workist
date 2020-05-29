//  ---------------------------------- Services To Get Daily Output------------------------------------------------- //
  
  
angular.module('workingHoursTrello').service('dayS', function() {

    this.getDailyCardValue = (dateOfDay, member) => {
      if (member.workedData) {
        const current_month_worked = member.workedData[dateOfDay.getMonth()]
        const current_day_worked = current_month_worked.worked.find(item => item.day == dateOfDay.getDate())
        if (current_day_worked) {
          const time = current_day_worked.cards.time
          if (time >= 8) return 1;
          if (time < 8 && time >= 4) return 0.5;
        }
        return 0
      }
      return 0
    };
  });
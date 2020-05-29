
//  ---------------------------------- Services To Get Monthly Output------------------------------------------------- //


angular.module('workingHoursTrello').service('monthS', function() {

    this.datesNeedToWork = (member, monthWeeksDates, allHolidays) => {
      let monthWorkingDays =  monthWeeksDates.filter(item => { // remove sat & sun
        return item.Date.getDay() != 6 && item.Date.getDay() != 0;
      });

      monthWorkingDays = monthWorkingDays.filter(item => { // remove birthday
        let bd = new Date(member.birthday) 
        return `${item.Date.getMonth()+1}/${item.Date.getDate()}` != `${bd.getMonth()+1}/${bd.getDate()}`
      });

      const holidays = allHolidays.dates.map(item => {
        const hd = new Date(item.date);
        return `${hd.getMonth()+1}/${hd.getDate()}`; 
      });

      monthWorkingDays = monthWorkingDays.filter(item => {
        return !holidays.includes(`${item.Date.getMonth()+1}/${item.Date.getDate()}`);
      });

      return monthWorkingDays.length;
    }
  });

//  ---------------------------------- Services To Get Weekly Output------------------------------------------------- //
  
  
angular.module('workingHoursTrello').service('weekS', function(){

  this.weekNeedsToWork = (dateWeeks, member, allHolidays) => {
    let workingDays = dateWeeks.filter(item => { // remove sat & sun
      return item.Date.getDay() != 6 && item.Date.getDay() != 0;
    });
    workingDays = workingDays.filter(item => { // remove birthday
      let bd = new Date(member.birthday) 
      return `${item.Date.getMonth()+1}/${item.Date.getDate()}` != `${bd.getMonth()+1}/${bd.getDate()}`
    });

    const holidays = allHolidays.dates.map(item => {
      const hd = new Date(item.date);
      return `${hd.getMonth()+1}/${hd.getDate()}`; 
    });
    workingDays = workingDays.filter(item => {
      return !holidays.includes(`${item.Date.getMonth()+1}/${item.Date.getDate()}`);
    });
    return workingDays.length;
  }
});
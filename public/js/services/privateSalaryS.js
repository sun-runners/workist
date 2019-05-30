angular.module('workingHoursTrello').service('privateSalaryS', function(totalSalaryS){

    this.getMonths = (memberId, fromDate, toDate) => { /** we get the dates by year and month from two dates */
        const fromYear = fromDate.getFullYear();
        const fromMonth = fromDate.getMonth();
        const toYear = toDate.getFullYear();
        const toMonth = toDate.getMonth();
        const months = [];
        for (let year = fromYear; year <= toYear; year++) {
          let month = year === fromYear ? fromMonth : 0;
          const monthLimit = year === toYear ? toMonth : 11;
          for (; month <= monthLimit; month++) {
            months.push({memberId, year, month });
          }
        }
        return months;
      };
  });
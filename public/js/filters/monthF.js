(function(){
    'use strict';

    angular
        .module('workingHoursTrello')
        .filter('getMonthValue', month)

    function month(){

        return monthFn;

        function monthFn(item, month){
            for (let i = 0; i < item.workedData.length; i++) {
              const data = item.workedData[i];
              if (data.month == month) {
                return data.monthWorked;
              }
            }
        }
    }

}());

(function(){
    'use strict';

    angular
        .module('workingHoursTrello')
        .filter('getMonthTime', getMonthTime)

    function getMonthTime(){

        return getMonthTimeFn;

        function getMonthTimeFn(item, month){
            let worked = item.workedData;

            for (let i = 0; i < worked.length; i++) {
              const data = worked[i];
                if (data.month == month) {
                    return data.monthTime
                }
            }
        }
    }

}());
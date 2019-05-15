(function(){
    'use strict';

    angular
        .module('workingHoursTrello')
        .filter('getMonthTask', getMonthTask)

    function getMonthTask(){

        return getMonthTaskFn;

        function getMonthTaskFn(item, month){
            let worked = item.workedData;

            for (let i = 0; i < worked.length; i++) {
              const data = worked[i];
                if (data.month == month) {
                    return data.monthTask
                }
            }
        }
    }

}());
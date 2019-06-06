(function(){
    'use strict';

    angular
        .module('workingHoursTrello')
        .filter('timeOrder', timeOrder)

    function timeOrder(){

        return timeOrderFn;

        function timeOrderFn(item, time, month){
            for (let x = 0; x < item.length; x++) {
                const win = item[x];
                if (win.winTime == time && win.month == month) {
                    if (time != 0) {
                    return "1st";
                    }
                }
                if (win.time2nd == time && win.month == month) {
                    if (time != 0) {
                        return "2nd";
                    }
                }
                if (win.time3rd == time && win.month == month) {
                    if (time != 0) {
                        return "3rd";
                    }
                }
            }
        }
    }
}());
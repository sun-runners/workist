(function(){
    'use strict';

    angular
        .module('workingHoursTrello')
        .filter('taskOrder', taskOrder)

    function taskOrder(){

        return taskOrderFn;

        function taskOrderFn(item, task, month){
            for (let x = 0; x < item.length; x++) {
                const win = item[x];
                if (win.winTask == task && win.month == month) {
                    if (task != 0) {
                    return "1st";
                    }
                }
                if (win.task2nd == task && win.month == month) {
                    if (task != 0) {
                        return "2nd";
                    }
                }
                if (win.task3rd == task && win.month == month) {
                    if (task != 0) {
                        return "3rd";
                    }
                }
            }
        }
    }
}());
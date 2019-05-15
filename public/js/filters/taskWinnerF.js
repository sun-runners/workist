(function(){
    'use strict';

    angular
        .module('workingHoursTrello')
        .filter('taskWinner', taskWinner)

    function taskWinner(){

        return taskWinnerFn;

        function taskWinnerFn(item, month){
            for (let x = 0; x < item.length; x++) {
              const win = item[x];
              if (win.month == month) {
                return win.winTask;
              }
            }
        }
    }
}());
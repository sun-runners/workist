(function(){
    'use strict';

    angular
        .module('workingHoursTrello')
        .filter('timeWinner', timeWinner)

    function timeWinner(){

        return timeWinnerFn;

        function timeWinnerFn(item, month){
            for (let x = 0; x < item.length; x++) {
              const win = item[x];
              if (win.month == month) {
                return win.winTime;
              }
            }
        }
    }
}());
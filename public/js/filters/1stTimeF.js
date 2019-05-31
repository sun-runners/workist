(function(){
    'use strict';

    angular
        .module('workingHoursTrello')
        .filter('task1st', task1st)

    function task1st(){

        return task1stFn;

        function task1stFn(item, time){
            for (let x = 0; x < item.length; x++) {
              const win = item[x];
              if (win.winTime == time) {
                  if (time != 0) {
                    return "1st";
                  }
              }
            }
        }
    }
}());
(function(){
    'use strict';

    angular
        .module('workingHoursTrello')
        .filter('getYearTime', getYearTime)

    function getYearTime(){

        return getYearTimeFn;

        function getYearTimeFn(item){
            return item.totYearTime;
        }
    }

}());
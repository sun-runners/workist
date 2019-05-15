(function(){
    'use strict';

    angular
        .module('workingHoursTrello')
        .filter('getYearTask', getYearTask)

    function getYearTask(){

        return getYearTaskFn;

        function getYearTaskFn(item){
            return item.totYearTask;
        }
    }

}());
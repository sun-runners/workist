(function(){
    'use strict';

    angular
        .module('workingHoursTrello')
        .filter('getYearValue', year)

    function year(){

        return yearFn;

        function yearFn(item){
            return item.totYearWorked;
        }
    }

}());

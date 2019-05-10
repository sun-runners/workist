(function(){
    'use strict';

    angular
        .module('myApp')
        .filter('getMonthValue', test1)

    function test1(){

        return test1Fn;

        function test1Fn(item, month){
            for (let i = 0; i < item.workedData.length; i++) {
              const data = item.workedData[i];
              if (data.month == month) {
                return `${item.fullName}  --- ${data.monthWorked}`
              }
            }
        }
    }

}());

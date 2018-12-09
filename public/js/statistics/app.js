angular.module('workingHoursTrello', [

]).config(function(){

  // Codes will he here

}).run(function(){



  // Variable Section
  $rootScope.monent = moment();



  // Increase Function Section
  $rootScope.increaseWeek = function(){
    $rootScope.monent.add(7, 'days');
  };

  $rootScope.increaseMonth = function(){
    $rootScope.monent.add(1, 'months');
  };

  $rootScope.increaseYear = function(){
    $rootScope.monent.add(1, 'years');
  };



  // Decrease Function Section
  $rootScope.decreaseWeek = function(){
    $rootScope.monent.subtract(7, 'days');
  };

  $rootScope.decreaseMonth = function(){
    $rootScope.monent.subtract(1, 'months');
  };

  $rootScope.decreaseYear = function(){
    $rootScope.monent.subtract(1, 'years');
  };



  var t = window.TrelloPowerUp.iframe();
  var months;
  t.render(function(){
    t.lists('all')
    .then(function (lists) {
      console.log(lists);
      for(var i=0; i<lists.length; i++){
        var list = lists[i];
        if(!list.name) continue;
        console.log(list.name);
      }
    });
  });

  // Examples
  var years = [
    {
      year:2018,
      // Months
      months:[
        {
          month: 1,
          // Weeks
          weeks: [
            {
              week: 1,
              // Days
              days: [
                {
                  day:1
                  // Users
                  users:[
                    {
                      name:'Kim Sun Wook',
                      time_text:'10-19.5',
                      time_number:9.5,
                      is_annual:false,
                      is_national:false,
                      is_birthday:false
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];

});

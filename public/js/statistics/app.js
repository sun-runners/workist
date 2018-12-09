angular.module('workingHoursTrello', [

]).config(function(){

  // Codes will he here

}).run(function($rootScope){



  // Variable Section
  $rootScope.moment = moment();
  $rootScope.trello = {};



  // Increase Function Section
  $rootScope.increaseWeek = function(){
    $rootScope.moment.add(7, 'days');
  };

  $rootScope.increaseMonth = function(){
    $rootScope.moment.add(1, 'months');
  };

  $rootScope.increaseYear = function(){
    $rootScope.moment.add(1, 'years');
  };



  // Decrease Function Section
  $rootScope.decreaseWeek = function(){
    $rootScope.moment.subtract(7, 'days');
  };

  $rootScope.decreaseMonth = function(){
    $rootScope.moment.subtract(1, 'months');
  };

  $rootScope.decreaseYear = function(){
    $rootScope.moment.subtract(1, 'years');
  };

  // Get Function Section
  $rootScope.getDtOfMoment = function(moment){
    var dt = {};
    dt.Date = moment.toDate();
    dt.year = moment.year();
    dt.month = moment.month()+1;
    dt.date = moment.date();
    dt.week = Math.ceil(moment.date()/7);
    return dt;
  }



  // Watch Section
  $rootScope.$watch('moment', function(){
    $rootScope.dt = $rootScope.getDtOfMoment($rootScope.moment);
  }, true);

  var t = window.TrelloPowerUp.iframe();
  var months;
  t.render(function(){
    t.lists('all')
    .then(function (lists) {
      $rootScope.trello.lists = lists;

      for(var i=0; i<=lists.length; i++){
        var list = lists[i];
        console.log(list);
        for(var j=0; j<=list.cards.length; j++){
          var card = list.cards[i];
          console.log(card);
          // if(!card.members[0]){
          //
          // };
          // (https://api.trello.com/1/notifications/id/memberCreator)
        }
      }

      $rootScope.trello.years = [
      ];
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
                  day:1,
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

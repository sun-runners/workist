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


  // Get Function Section
  var getNumberOfCard = function(card){
    var number = eval(card['name']);
    return Math.abs(number);
  }

  var getHoursOfCard = function(card){
    var number = getNumberOfCard(card);
    return Math.floor(number);
  }

  var getMinutesOfCard = function(card){
    var number = getNumberOfCard(card);
    var hour = getHoursOfCard(card);
    var minute = (number-hour)*60;
    var minute = ("0" + minute).slice(-2);
    return minute;
  }

  var getDayOfCard = function(card){
    var hour = getHoursOfCard(card);
    var day_work = 0;
    if(hour>=8) day_work = 1;
    else if(hour>=4) day_work = 0.5;
    else day_work = 0;
    return day_work;
  }

  var getDtOfList = function(list){
    var splits = list.name.split('/');
    console.log('splits',splits);
    var dt = null;
    if(splits.length==3){
      var moment_list = moment().year(splits[0]).month(splits[1]-1).date(splits[2]);
      dt = $rootScope.getDtOfMoment(moment_list);
    }
    else if(splits.length==2){
      var moment_list = moment().year(2018).month(splits[0]-1).date(splits[1]);
      dt = $rootScope.getDtOfMoment(moment_list);
    }
    console.log('dt',dt);
    return dt;
  }



  // Watch Section
  $rootScope.$watch('moment', function(){
    $rootScope.dt = $rootScope.getDtOfMoment($rootScope.moment);
  }, true);

  var t = window.TrelloPowerUp.iframe();
  var months;
  t.render(function(){

    t.lists('all').then(function (lists) {
      $rootScope.trello.lists = lists;
      // All
      for(var i=0; i<lists.length; i++){
        var list = lists[i];
        var users = [];
        // Each Day
        for(var j=0; j<list.cards.length; j++){
          var user = {};
          // Each Card
          var card = list.cards[j];
          console.log('card', card);

          // Set time
          user.time_number = getNumberOfCard(card);
          user.time_hour = getHoursOfCard(card);
          user.time_minute = getMinutesOfCard(card);
          user.time_day = getDayOfCard(card);

          // Set link
          if(card.url) user.card_link = card.url;

          // Set user
          if(!card.members[0]){
            user.user_name = 'Undefined';
          } else{
            user.user_name = card.members.fullName;
            user.user_profile = card.members.avatar;
          }

          users.push(user);
        }
        console.log('list', list);
        getDtOfList(list);
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

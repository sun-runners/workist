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
          console.log(card);

          // Set Data
          if(card.url) user.card_link = card.url;

          if(!card.members[0]){
            var xhr = new XMLHttpRequest();
            xhr.addEventListener("readystatechange", function () {
              if (this.readyState === this.DONE) {
                console.log(this);
                console.log(this.responseText);
              }
            });
            xhr.open("GET", "https://api.trello.com/1/cards/"+card.id+"/actions?key=83fc2b66ce8cb9fa5d195fe9b10b28ce&token=501cd596f1b8d08229629d931c91b5d1b2ae1f2c09c740192e9686f27ece6f33");
            xhr.send(null);
          } else{
            user.user_name = card.members.fullName;
            user.user_profile = card.members.avatar;
          }
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

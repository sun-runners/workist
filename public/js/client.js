var Promise = TrelloPowerUp.Promise;

/*
t.board('id', 'name', 'url', 'shortLink', 'members')
t.list('id', 'name', 'cards')
t.lists('id', 'name', 'cards')
t.card('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')
t.cards('id', 'name', 'desc', 'due', 'closed', 'cover', 'attachments', 'members', 'labels', 'url', 'shortLink', 'idList')
t.member('id', 'fullName', 'username')
*/

var GLITCH_ICON = 'https://cdn.glitch.com/2442c68d-7b6d-4b69-9d13-feab530aa88e%2Fglitch-icon.svg?1489773457908';
var GRAY_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg';
var WHITE_ICON = 'https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-white.svg';

// Check Function Section
var checkTimeOfCard = function(card){
  var equation = card['name'];
  var numbers = equation.split(/\+|\-/);
  if(numbers.length%2==1) return false;
  return true;
}

// Get Function Section
var getNumberOfCard = function(card){
  var number = eval(card['name']);
  return Math.abs(number);
}

var getHoursOfNumber = function(card){
  var number = getNumberOfCard(card);
  return Math.floor(number);
}

var getMinutesOfNumber = function(card){
  var number = getNumberOfCard(card);
  var hour = getHoursOfNumber(card);
  var minute = (number-hour)*60;
  var minute = ("0" + minute).slice(-2);
  return minute;
}

var getColorOfNumber = function(card){
  var hour = getHoursOfNumber(card);
  var color = 'none';
  if(hour>=8) color = 'green';
  else if(hour>=4) color = 'yellow';
  else color = 'red';
  return color;
}

// Initialize Function Section
var initializeCardBadges = function(t){
  return t.card('all')
  .then(function(card){
    return [{
      dynamic: function(){
        var is_time_valid = checkTimeOfCard(card);
        var text = '';
        var color = 'none';

        if(is_time_valid){
          var hour = getHoursOfNumber(card);
          var minute = getMinutesOfNumber(card);
          color = getColorOfNumber(card);
          text = hour+':'+minute;
        }
        else{
          text = 'Not valid';
          color = 'blue';
        }
        return {
          title: 'Worked',
          text: text,
          icon: GRAY_ICON,
          color: color
        };
      }
    }];
  });
};

var boardButtonCallback = function(t){
  return t.popup({
    title: 'Time calculater',
    items: [
      {
        text: 'Weekly statistics',
        callback: function(t){
          return t.boardBar({
            url: './template/statistics/weekly.html',
            height: 200
          })
          .then(function(){
            return t.closePopup();
          });
        }
      },
      {
        text: 'Monthly statistics',
        callback: function(t){
          return t.boardBar({
            url: './template/statistics/monthly.html',
            height: 200
          })
          .then(function(){
            return t.closePopup();
          });
        }
      },
      {
        text: 'Yearly statistics',
        callback: function(t){
          return t.boardBar({
            url: './template/statistics/yearly.html',
            height: 200
          })
          .then(function(){
            return t.closePopup();
          });
        }
      }
    ]
  });
};

TrelloPowerUp.initialize({
  'board-buttons': function(t, options){
    return [{
      // we can either provide a button that has a callback function
      // that callback function should probably open a popup, overlay, or boardBar
      icon: WHITE_ICON,
      text: 'Time calculater',
      callback: boardButtonCallback
    }];
  },
  'card-badges': function(t, options){
    return initializeCardBadges(t);
  },
  'card-detail-badges': function(t, options) {
    return initializeCardBadges(t);
  }
});

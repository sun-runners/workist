angular.module('workingHoursTrello', [

]).config(function(){

  // Codes will he here

}).run(function(){

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

});

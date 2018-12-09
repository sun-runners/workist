var t = TrelloPowerUp.iframe();

t.render(function(){
});

// var t = window.TrelloPowerUp.iframe();
// var months;
// t.render(function(){
//   t.lists('all')
//   .then(function (lists) {
//     months = lists;
//     for(var i=0; i<lists.length; i++){
//       var list = lists[i];
//       if(!list.name) continue;
//     }
//   });
// });

var app = new Vue({
  el: '#app',
  data: {
    months: '12312312'
  }
});

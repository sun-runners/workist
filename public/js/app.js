angular.module('workingHoursTrello', [
  'ngRoute'
]).config(function($sceDelegateProvider, $routeProvider){
  // Codes will he here
  $sceDelegateProvider.resourceUrlWhitelist(['**']);
  $routeProvider
    .when("/weekly", {
        template : "<weekly-dir></weekly-dir>"
    })
    .when("/monthly", {
        template : "<monthly-dir></monthly-dir>"
    })
    .when("/yearly", {
        template : "<yearly-dir></yearly-dir>"
    })
    .when("/total", {
      template : "<salary-dir></salary-dir>"
    })
    .when("/13th", {
      template : "<thirteen-dir></thirteen-dir>"
    })
    .when("/time", {
        template : "<time-dir></time-dir>"
    })
    .when("/task", {
      template : "<task-dir></task-dir>"
    })
    .when("/holiday", {
    template : "<holiday-dir></holiday-dir>"
    })
    .when("/birthday", {
      template : "<birthday-dir></birthday-dir>"
    })
    .otherwise({
      template : "<weekly-dir></weekly-dir>"
    });
}).run(function($rootScope, $http, apiS){
  
  $rootScope.selectedMember = null; /** this will indicate who current selected Member */
  $rootScope.changeSelectedMember = (memberId) => $rootScope.selectedMember = memberId; 

  // We get the Api from trello
  apiS.getBoardLists().then((response) => $rootScope.boardLists = response.data /**  Get Boards Lists */);
  apiS.getBoardCards().then((response) => $rootScope.boardCards = response.data /** Get Boards Cards */);
  apiS.getBoardMembers().then((response) => $rootScope.boardMembers = response.data /** Get Boards Members */);
  apiS.calendarBoardLists().then((response) => $rootScope.calendarLists = response.data /**  Get Boards Lists of Work Timist Data */);
  apiS.calendarBoardCards().then((response) => $rootScope.calendarCards = response.data /** Get Boards Cards of Work Timist Data */);

  const token = '7be1976d0063e2ca94d145fbf01604667dfee015cfe1b4cd41a355d76a1ca118';
  const key ='86b2621fa79c88d61ff3a95b82ec2bd7';

  async function trelloCards() {
    let response = await fetch(`https://api.trello.com//1/boards/5ba38efef50b8979566922d0/cards?key=${key}&token=${token}`);
    return await response.json();
  }
  async function trelloLists() {
    let response = await fetch(`https://api.trello.com/1/boards/5ba38efef50b8979566922d0/lists?key=${key}&token=${token}`)
    return await response.json();
  }
  async function bindWorkInfo() {
    const cards = await trelloCards();
    const lists = await trelloLists();

    let trelloWorkData = [];
    for (let i = 0; i < lists.length; i++) {
      const list = lists[i];
      list.name = list.name.substr(0,list.name.indexOf(' '))
      let listWithCard = [];
      for (let x = 0; x < cards.length; x++) {
        const card = cards[x];
        if (card.idList == list.id) {
          try { /** 8-12+14-16 = 6*/
            card.name = Math.abs(eval(card.name));
            listWithCard.push({id:list.id, date:list.name, idCard:card.id, time:card.name, task:card.badges.checkItemsChecked, idMember:card.idMembers[0]});
            } catch (error) {}
        }
      }
      trelloWorkData.push(listWithCard);
    }
    $rootScope.workedInfo = trelloWorkData;
    console.log($rootScope.workedInfo);
  }
  bindWorkInfo();


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

 const t = window.TrelloPowerUp.iframe();

}).controller('mainCtrl', function($scope, $compile) {
  
	$scope.template = 'monthlys';
  $scope.subMenu = ['weekly', 'monthly', 'yearly'];
  $scope.mainMenu = [{title:'attendance', active:'weekly'}, {title:'award', active:'time'}, {title:'salary', active:'total'}, {title:'calendar', active:'birthday'}];
  $scope.activeSub = 'weekly';
  $scope.activateSub = (target) => $scope.activeSub = target; 
  $scope.activeMenu = 'attendance';
  $scope.activateMenu = (target) => $scope.activeMenu = target;
  
	$scope.switchSub = (menuOf) => {
      switch (menuOf) {
        case 'attendance':
          $scope.subMenu = ['weekly', 'monthly', 'yearly'];
          $scope.activateSub('weekly');
          break;
        case 'salary':
          $scope.subMenu = ['total', '13th'];
          $scope.activateSub('total');
          break;
        case 'award':
          $scope.subMenu = ['time', 'task'];
          $scope.activateSub('time');
          break;
        case 'calendar':
          $scope.subMenu = ['birthday', 'holiday'];
          $scope.activateSub('birthday');
          break;
      }
    }	
  $scope.openModal = function() {
    $scope.target = document.querySelector('#targetDiv');
    // the div where we append the target
    $scope.showTarget = document.querySelector('#showTarget')
    // Get the modal
    $scope.modal = document.querySelector('#modalTimist');
    // When the user clicks the button, open the modal 
    $scope.modal.style.display = "block";
      // showTarget.removeChild(canvas);
      html2canvas($scope.target).then(function(canvas) {
          $scope.showTarget.appendChild(canvas);
      });
  }
  // When the user clicks on <span> (x), close the modal
  $scope.closeModal = function() {
      while ($scope.showTarget.firstChild) {
        $scope.showTarget.removeChild($scope.showTarget.firstChild);
      }
      $scope.modal.style.display = "none";
  };
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == $scope.modal) {
          // showTarget.innerHTML=""
          while ($scope.showTarget.firstChild) {
            $scope.showTarget.removeChild($scope.showTarget.firstChild);
          }
          $scope.modal.style.display = "none";
          }
  };

  // $scope.showLoader = () => {
  //   document.getElementById("tyle-loader").style.display = "block";
  //   return setTimeout(showPage, 1000);
  // }
	// function showPage() {
	// 	document.getElementById("tyle-loader").style.display = "none";
	// }
	// $scope.showLoader()
});


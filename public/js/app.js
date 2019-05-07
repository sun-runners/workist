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
  const token = '7be1976d0063e2ca94d145fbf01604667dfee015cfe1b4cd41a355d76a1ca118';
  const key ='86b2621fa79c88d61ff3a95b82ec2bd7';

  apiS.calendarBoardLists(key, token).then((response) => $rootScope.calendarLists = response.data /**  Get Boards Lists of Work Timist Data */);
  apiS.calendarBoardCards(key, token).then((response) => $rootScope.calendarCards = response.data /** Get Boards Cards of Work Timist Data */);

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

    apiS.getBoardMembers(key, token).then((response) => {
      $rootScope.boardMembers = response.data /** Get Boards Members */
  
      apiS.getBoardLists(key, token).then((response) => {
        $rootScope.boardLists = response.data /**  Get Boards Lists */
        
        apiS.getBoardCards(key, token).then((response) => {
          $rootScope.boardCards = response.data /** Get Boards Cards */
    
          let memberWorked = []; /** Holds members Worked Data */
          for (let y = 0; y < $rootScope.boardMembers.length; y++) {
            const member = $rootScope.boardMembers[y];

            let monthsWorked = [];
            for (let month = 1; month < 13; month++) {
              
              let listWorkData = []; /** Holds Lists Data */
              for (let i = 0; i < $rootScope.boardLists.length; i++) {
                const list = $rootScope.boardLists[i];
                listName = new Date(x = list.name.substr(0,list.name.indexOf(' ')));
                listDate = `${listName.getFullYear()}/${listName.getMonth() + 1}/${listName.getDate()}`;
  
                toAdd = false; /** this will tell if the list Data should be pushed */
  
                let listWithCard = []; /** Holds Cards Data */
                for (let x = 0; x < $rootScope.boardCards.length; x++) {
                  const card = $rootScope.boardCards[x];
                  
                  if (card.idList == list.id && card.idMembers == member.id && $rootScope.dt.year == listName.getFullYear() && (listName.getMonth() + 1) == month) {
                    toAdd = true; /** will push the cards to the listWithCard */
  
                    try { /** 8-12+14-16 = 6*/
                      cardName = Math.abs(eval(card.name));
                      /** the card data to be pushed to members cards */
                      listWithCard.push({id:card.id, time:cardName, task:card.badges.checkItemsChecked, idMember:card.idMembers[0]});
                      } catch (error) {}
                  }
                }
                if (toAdd == true) {
                  listWorkData.push({id:list.id, dateFull:listDate, day:listName.getDate(), month:(listName.getMonth()+1), year:listName.getFullYear(), cards:listWithCard}); /** the data to pushed on workData */
                  toAdd = false;
                }
              }
             

              monthsWorked.push({month:month, worked:listWorkData})
            }

            memberWorked.push({id:member.id, fullName:member.fullName, workedData:monthsWorked})
          }
  
          $rootScope.workedInfo = memberWorked;
          console.log(memberWorked)
          console.log($rootScope.dt.month)
          // console.log($rootScope.dt.year)
        })
      });
    });

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


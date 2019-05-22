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

  function initApi() {
    // API Manipulation Starts here -------------------------------------------
    apiS.getBoardMembers(key, token).then((response) => {
      $rootScope.boardMembers = response.data; /** Get Boards Members */
      
      apiS.calendarBoardLists(key, token).then((response) => {
        $rootScope.calendarLists = response.data ;

        apiS.calendarBoardCards(key, token).then((response) => {
          $rootScope.calendarCards = response.data;

          apiS.getBoardLists(key, token).then((response) => {
            $rootScope.boardLists = response.data; /**  Get Boards Lists */
  
            apiS.getBoardCards(key, token).then((response) => {
              $rootScope.boardCards = response.data; /** Get Boards Cards */
              
              let monthlyWin = []; /** Holds the winners per month */
              let memberWorked = []; /** Holds members Worked Data */

              for (let y = 0; y < $rootScope.boardMembers.length; y++) {
                const member = $rootScope.boardMembers[y];
                let totalYearTime = 0;
                let totalYearTask = 0;
                let totalYearDay = 0;
                let monthsWorked = [];
                /** we loop 12 times to show per month */
                for (let month = 1; month < 13; month++) {
                  
                  let listWorkData = []; /** Holds Lists Data */
                  for (let i = 0; i < $rootScope.boardLists.length; i++) {
                    const list = $rootScope.boardLists[i];
                    listName = new Date(x = list.name.substr(0,list.name.indexOf(' ')));
                    listDate = `${listName.getFullYear()}/${listName.getMonth() + 1}/${listName.getDate()}`;
                    toAdd = false; /** this will tell if the list Data should be assigned */
      
                    let listWithCard = {id:0, time:0, task:0, idMember:0}; /** Holds Cards Data */
                    for (let x = 0; x < $rootScope.boardCards.length; x++) {
                      const card = $rootScope.boardCards[x];
                      if (card.idList == list.id && card.idMembers == member.id && $rootScope.dt.year == listName.getFullYear() && (listName.getMonth() + 1) == month) {
                        toAdd = true; /** will assign the cards to the listWithCard */
                        try { /** 8-12+14-16 = 6*/
                          cardName = card.name;
                          let number = 0;
                          if (cardName.match(/[a-z]/i) || /\/.*\//.test( cardName )) { /* we filter if the card name is legit **/
                            number = 0;
                          }else{
                            var numbers = cardName.split(/\+|\-/);
                            if(numbers.length%2==1){
                               number = 0;
                            }
                            number = Math.abs(eval(cardName));
                          }
                          // cardName = Math.abs(eval(card.name));
                          /** the card data to be pushed to members cards */
                          listWithCard.id = card.id;
                          listWithCard.time = number;
                          listWithCard.task = card.badges.checkItemsChecked;
                          listWithCard.idMember = card.idMembers[0];
                          // listWithCard.push({id:card.id, time:cardName, task:card.badges.checkItemsChecked, idMember:card.idMembers[0]});
                          } catch (error) {}
                      }
                    }
                    if (toAdd == true) {
                      listWorkData.push({id:list.id, dateFull:listDate, day:listName.getDate(), month:(listName.getMonth()+1), year:listName.getFullYear(), cards:listWithCard}); /** the data to pushed on workData */
                      toAdd = false;
                    }
                  }
                  let totalMonthTime = 0;
                  let totalMonthTask = 0;
                  let totalMonthDay = 0;
                  
                  for (let z = 0; z < listWorkData.length; z++) {
                    const card = listWorkData[z].cards;
                    // console.log(data)
                    cardDay = 0;
                    if (card.time >= 8) {
                        cardDay = 1;
                    }else if (card.time <= 8 && card.time > 4) {
                        cardDay = 0.5;
                    }else if (card.time <= 4) {
                        cardDay = 0;
                    }
                    /** will add the monthly data */
                    totalMonthDay = totalMonthDay + cardDay;
                    totalMonthTime = totalMonthTime + card.time;
                    totalMonthTask = totalMonthTask + card.task;
                    /** will add the yearly data */
                    totalYearDay = totalYearDay + cardDay;
                    totalYearTime = totalYearTime + card.time;
                    totalYearTask = totalYearTask + card.task;
                  }
                  monthsWorked.push({month:month, monthTime: totalMonthTime, monthTask: totalMonthTask, monthWorked:totalMonthDay, worked:listWorkData});
       
                  while (monthlyWin.length < month) {
                    monthlyWin.push({month:month, winTime:totalMonthTime, winTask:totalMonthTask});
                  }
                  if (monthlyWin.length >= 12) {
                    for (let j = 0; j < monthlyWin.length; j++) {
                      const winner = monthlyWin[j];
                      if (winner.month == month) {
                        if (winner.winTime < totalMonthTime) {
                          winner.winTime = totalMonthTime;
                        }
                        if (winner.winTask < totalMonthTask) {
                          winner.winTask = totalMonthTask;
                        }
                      }
                    }
                  }
                }
                memberWorked.push({id:member.id, fullName:member.fullName,  totYearTime: totalYearTime, totYearTask: totalYearTask, totYearWorked: totalYearDay, workedData:monthsWorked});
              }
              $rootScope.workedInfo = memberWorked;
              $rootScope.monthWin = monthlyWin;
              // console.log($rootScope.monthWin);
            }); /** getBoardCards */
          }); /** getBoardLists */

          let holidays = [] /** Holds the holidays per year each country */
          for (let i = 0; i < $rootScope.calendarLists.length; i++) {
              const list = $rootScope.calendarLists[i];
              const listWords = list.name.split(" ");
              let country;
              let year; 
              for (let j = 0; j < listWords.length; j++) {
                  const word = listWords[j];
                  if (word == "PHILIPPINES") {
                      country = "PHILIPPINES";
                  }
                  if (word == "KOREA") {
                      country = "KOREA";
                  }
                  if (!isNaN(word)) {
                      year = word;
                  }
              }
              let holiDates = []; /** Holds the dates of the holiday */
              for (let x = 0; x < $rootScope.calendarCards.length; x++) {
                  const card = $rootScope.calendarCards[x];
                  if (card.idList == list.id) {
                      cardDate = card.name.substr(0, card.name.indexOf(" ")); 
                      fullDate = `${year}/${cardDate}`; /** We get the Holiday card date */
                      holidayName = card.name.substr(card.name.indexOf(' ')+1); /** We get the name of the Holiday */
                      holiDates.push({date:fullDate, name:holidayName});
                  }
              }
              if (country != undefined || year != undefined) {
                  holidays.push({country:country, year:year, dates:holiDates})
              }
          }
          $rootScope.holidays = holidays;
          // console.log($rootScope.holidays)

        }); /** calendarBoardCards End */
      }); /** calendarBoardList End */
    }); /** boardMembers End */
  }
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
    initApi();
    
  }, true);

 const t = window.TrelloPowerUp.iframe();

}).controller('mainCtrl', function($scope, $compile, $rootScope) {
  
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

  $rootScope.showLoader = () => {
    document.getElementById("tyle-loader").style.display = "block";
    return setTimeout(showPage, 4000);
  }
	const showPage = () => {
		document.getElementById("tyle-loader").style.display = "none";
	}
	$rootScope.showLoader()
});


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
    .when("/private", {
      template : "<private-dir></private-dir>"
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
}).run(function($rootScope, $http, apiS, privateSalaryS){

  $rootScope.selectedMember = null; /** this will indicate who current selected Member */
  $rootScope.changeSelectedMember = (memberId) => $rootScope.selectedMember = memberId;

  // We get the Api from trello
  const key ='83fc2b66ce8cb9fa5d195fe9b10b28ce';
  const token = '501cd596f1b8d08229629d931c91b5d1b2ae1f2c09c740192e9686f27ece6f33';

  function initApi() {
    apiS.getBoardMembers(key, token).then((response) => {
      $rootScope.boardMembers = response.data; /** Get Boards Members */

      apiS.calendarBoardLists(key, token).then((response) => {
        $rootScope.calendarLists = response.data ; /** workist calendar lists */

        apiS.calendarBoardCards(key, token).then((response) => {
          $rootScope.calendarCards = response.data; /** workist calendar cards */

          apiS.getBoardLists(key, token).then((response) => {
            $rootScope.boardLists = response.data; /**  Get Boards Lists */

            apiS.getBoardCards(key, token).then((response) => {
              $rootScope.boardCards = response.data; /** Get Boards Cards */

              let monthlyWin = []; /** Holds the winners per month */
              let memberWorked = []; /** Holds members Worked Data */

              for (let y = 0; y < $rootScope.boardMembers.length; y++) {
                const member = $rootScope.boardMembers[y];
                let total_year_time = 0;
                let total_year_task = 0;
                let total_year_day = 0;

                let start_salary;


                let months_worked = [];
                /** we loop 12 times to show per month */
                for (let month = 1; month < 13; month++) {

                  let listWorkData = []; /** Holds Lists Data */
                  for (let i = 0; i < $rootScope.boardLists.length; i++) {
                    const list = $rootScope.boardLists[i];
                    list_name = new Date(x = list.name.substr(0,list.name.indexOf(' ')));
                    listDate = `${list_name.getFullYear()}/${list_name.getMonth() + 1}/${list_name.getDate()}`;
                    toAdd = false; /** this will tell if the list Data should be assigned */

                    let list_with_card = {id:0, time:0, task:0, idMember:0}; /** Holds Cards Data */
                    for (let x = 0; x < $rootScope.boardCards.length; x++) {
                      const card = $rootScope.boardCards[x];
                      if (card.idList == list.id && card.idMembers == member.id && $rootScope.dt.year == list_name.getFullYear() && (list_name.getMonth() + 1) == month) {
                        toAdd = true; /** will assign the cards to the list_with_card */
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
                          list_with_card.id = card.id;
                          list_with_card.time = number;
                          list_with_card.task = card.badges.checkItemsChecked;
                          list_with_card.idMember = card.idMembers[0];
                          // list_with_card.push({id:card.id, time:cardName, task:card.badges.checkItemsChecked, idMember:card.idMembers[0]});
                          } catch (error) {}
                      }
                    }
                    if (toAdd == true) {
                      listWorkData.push({id:list.id, dateFull:listDate, day:list_name.getDate(), month:(list_name.getMonth()+1), year:list_name.getFullYear(), cards:list_with_card}); /** the data to pushed on workData */
                      toAdd = false;
                    }
                  }
                  let total_month_time = 0;
                  let total_month_task = 0;
                  let total_month_day = 0;

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
                    total_month_day = total_month_day + cardDay;
                    total_month_time = total_month_time + card.time;
                    total_month_task = total_month_task + card.task;
                    /** will add the yearly data */
                    total_year_day = total_year_day + cardDay;
                    total_year_time = total_year_time + card.time;
                    total_year_task = total_year_task + card.task;
                  }
                  months_worked.push({month:month, monthTime: total_month_time, monthTask: total_month_task, monthWorked:total_month_day, worked:listWorkData});
                  /** We are now determining which on has the highest time & task */
                  while (monthlyWin.length < month) {
                    monthlyWin.push({ month:month, winTime:total_month_time, time2nd:0, time3rd:0, winTask:total_month_task, task2nd:0, task3rd:0 });
                  }
                  if (monthlyWin.length >= 12) {
                    for (let j = 0; j < monthlyWin.length; j++) {
                      const winner = monthlyWin[j];
                      if (winner.month == month) {
                        if (winner.winTime < total_month_time) {
                          winner.time3rd = winner.time2nd;
                          winner.time2nd = winner.winTime
                          winner.winTime = total_month_time;
                        }
                        else if (winner.time2nd < total_month_time && total_month_time < winner.winTime) {
                          winner.time3rd = winner.time2nd
                          winner.time2nd = total_month_time;
                        }

                        if (winner.winTask < total_month_task) {
                          winner.task3rd = winner.task2nd
                          winner.task2nd = winner.winTask;
                          winner.winTask = total_month_task;
                        }
                        else if (winner.task2nd < total_month_task && total_month_task < winner.winTask) {
                          winner.task3rd = winner.task2nd
                          winner.task2nd = total_month_task;
                        }
                      }
                    }
                  }
                }
                let enter_date;
                var member_birthday;
                let nationality;
                /** We get the Nationality, Entering Date and Birthday */
                for (let i = 0; i < $rootScope.calendarLists.length; i++) {
                  const list = $rootScope.calendarLists[i];
                  const list_name = list.name.toUpperCase();

                  switch (list_name) {
                    case "BIRTHDAY":
                      const birth_card = $rootScope.calendarCards.find((card) => list.id == card.idList && member.id == card.idMembers);
                      // if members birthday is undefined make newyear as it's birthday.
                      if(birth_card == undefined){
                        member_birthday = "2019/01/01";
                      }else{
                        member_birthday = birth_card.name;
                      }
                      break;
                    case "ENTERING DATE":
                      const enter_date_card = $rootScope.calendarCards.find((card) => list.id == card.idList && member.id == card.idMembers);
                      if (enter_date_card) {
                        enter_date = enter_date_card.name.substr(0,enter_date_card.name.indexOf(' '));
                        start_salary = enter_date_card.name.substr(enter_date_card.name.indexOf(' ')+1);
                      }
                      break;
                    case "NATIONALITY":
                      for (let x = 0; x < $rootScope.calendarCards.length; x++) {
                        const card = $rootScope.calendarCards[x];
                        for (let y = 0; y < card.idMembers.length; y++) {
                          const cardMember = card.idMembers[y];
                          if (cardMember == member.id) {
                            nationality = card.name;
                          }
                        }
                      }
                      break;
                    default:
                      break;
                  }
                }
                // we check if members nationality is not present on cardData board make it KOREA
                if (nationality == undefined) {
                  nationality = "KOREA";
                }
                memberWorked.push({id:member.id, fullName:member.fullName, nationality:nationality, birthday:member_birthday, enterDate:enter_date, startSalary:start_salary, totYearTime: total_year_time, totYearTask: total_year_task, totYearWorked: total_year_day, workedData:months_worked});
              }
              $rootScope.workedInfo = memberWorked;
              // console.log($rootScope.workedInfo);
              $rootScope.monthWin = monthlyWin;
              // console.log($rootScope.monthWin);

              let userToken = Trello.token(); /** We generate new token for the user */
              // console.log(userToken);
              apiS.privateData(key, userToken).then((response) => { /** Personal API starts here */
                const private_data = response.data;
                // Authenticated API manipulation
                // const work = $rootScope.workedInfo.find((worker) => worker.id == "5c1e4c6f88a03b8640170363");
                const work = $rootScope.workedInfo.find((worker) => worker.id == private_data.id);
                $rootScope.currentUser = work;
                // console.log(work);
                let months = privateSalaryS.getMonths(new Date(work.enterDate), new Date());
                months.forEach(month => {
                  month.memberId = work.id;
                  month.nationality = work.nationality;
                  month.startSalary = work.startSalary;
                  month.enterDate = work.enterDate;
                  month.birthday = work.birthday;
                });
                $rootScope.workedMonths = months; /** This holds and array of months the user worked */
                // console.log(months);
              });
            }); /** getBoardCards */
          }); /** getBoardLists */
          let holidays = [] /** Holds the holidays per year each country */
          for (let i = 0; i < $rootScope.calendarLists.length; i++) {
              const list = $rootScope.calendarLists[i];
              const list_words = list.name.split(" ");
              let country;
              let year;
              for (let j = 0; j < list_words.length; j++) {
                  const word = list_words[j];
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
                  holidays.push({country:country, year:year, dates:holiDates});
              }
          }
          $rootScope.holidays = holidays; /** This holds an array of Holidays */
          // console.log($rootScope.holidays)
        }); /** calendarBoardCards End */
      }); /** calendarBoardList End */
    }); /** boardMembers End */
  };// API Manipulation ends here -------------------------------------------

  const authenticationSuccess = function() {
      console.log('Success authentication');
    };
  const authenticationFailure = function() {
      console.log('Failed authentication');
    };

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
    Trello.authorize({
      type: 'popup',
      name: 'Workist',
      persist: 1,
      interactive: 1,

      // persist: 'true', // the token will be saved on localstorage
      scope:{
        read: true,
        write: false,
        account: false
      },
      expiration: '1day',
      success: initApi,
      error: authenticationFailure
  });

  }, true);

 const t = window.TrelloPowerUp.iframe();

}).controller('mainCtrl', function($scope, $rootScope) {

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
          $scope.subMenu = ['total', '13th', 'private'];
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
    return setTimeout(() => {
      document.getElementById("tyle-loader").style.display = "none";
    }, 4000);
  }
	$rootScope.showLoader()
});

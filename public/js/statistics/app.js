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

}).run(function($rootScope, $http){
  
  $rootScope.selectedMember = null; /** this will indicate who current selected Member */
  $rootScope.changeSelectedMember = (memberId) => {$rootScope.selectedMember = memberId; console.log($rootScope.selectedMember)}

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
  $scope.mainMenu = [{title:'attendance', active:'weekly'}, {title:'award', active:'time'}, {title:'salary', active:''}, {title:'calendar', active:'birthday'}];
  $scope.activeSub = 'weekly';
  $scope.activeMenu = 'attendance';
  
	$scope.switchSub = (menuOf) => {
      switch (menuOf) {
        case 'attendance':
          $scope.subMenu = ['weekly', 'monthly', 'yearly'];
          $scope.activateSub('weekly');
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
  
  $scope.activateSub = (target) => $scope.activeSub = target; 

  $scope.activateMenu = (target) => $scope.activeMenu = target;

});


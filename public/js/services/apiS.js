//  ---------------------------------- Services To Access API---------------------------------------------------  //


angular.module('workingHoursTrello').service('apiS', function($http){
    // get boards Members
    this.getBoardMembers = function() {
      return  $http.get('https://api.trello.com/1/boards/5ba38efef50b8979566922d0/members?key=86b2621fa79c88d61ff3a95b82ec2bd7&token=7be1976d0063e2ca94d145fbf01604667dfee015cfe1b4cd41a355d76a1ca118');
    }
    // get boars Lists
    this.getBoardLists = function() {
      return $http.get('https://api.trello.com//1/boards/5ba38efef50b8979566922d0/lists?key=86b2621fa79c88d61ff3a95b82ec2bd7&token=7be1976d0063e2ca94d145fbf01604667dfee015cfe1b4cd41a355d76a1ca118');
    }
    //get boards Cards
    this.getBoardCards = function() {
      return $http.get('https://api.trello.com/1/boards/5ba38efef50b8979566922d0/cards?key=86b2621fa79c88d61ff3a95b82ec2bd7&token=7be1976d0063e2ca94d145fbf01604667dfee015cfe1b4cd41a355d76a1ca118');
    }
  });
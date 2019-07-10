//  ---------------------------------- Services To Access API---------------------------------------------------  //


angular.module('workingHoursTrello').service('apiS', function($http){
  // the board of time-in
  const board_id = '5ba38efef50b8979566922d0';
  // the board of board where members data are stored
  const board_data = '5c6cb6171cf49a5579a42e7d';
    // get boards Members
    this.getBoardMembers = function(key, token) {
      return  $http.get(`https://api.trello.com/1/boards/${board_id}/members?key=${key}&token=${token}`);
      // return  $http.get('https://api.trello.com/1/boards/5ba38efef50b8979566922d0/members?key=86b2621fa79c88d61ff3a95b82ec2bd7&token=7be1976d0063e2ca94d145fbf01604667dfee015cfe1b4cd41a355d76a1ca118');
    }
    // get boars Lists
    this.getBoardLists = function(key, token) {
      return $http.get(`https://api.trello.com//1/boards/${board_id}/lists?key=${key}&token=${token}`);
      // return $http.get('https://api.trello.com//1/boards/5ba38efef50b8979566922d0/lists?key=86b2621fa79c88d61ff3a95b82ec2bd7&token=7be1976d0063e2ca94d145fbf01604667dfee015cfe1b4cd41a355d76a1ca118');
    }
    //get boards Cards
    this.getBoardCards = function(key, token) {
      return $http.get(`https://api.trello.com/1/boards/${board_id}/cards?key=${key}&token=${token}`);
      // return $http.get('https://api.trello.com/1/boards/5ba38efef50b8979566922d0/cards?key=86b2621fa79c88d61ff3a95b82ec2bd7&token=7be1976d0063e2ca94d145fbf01604667dfee015cfe1b4cd41a355d76a1ca118');
    }
   
    // get Calendar Data Board's Lists
    this.calendarBoardLists = function(key, token) {
      return $http.get(`https://api.trello.com//1/boards/${board_data}/lists?key=${key}&token=${token}`);
      // return $http.get('https://api.trello.com//1/boards/5c6cb6171cf49a5579a42e7d/lists?key=86b2621fa79c88d61ff3a95b82ec2bd7&token=7be1976d0063e2ca94d145fbf01604667dfee015cfe1b4cd41a355d76a1ca118');
    }
    // get Calendar Data Board's Lists
    this.calendarBoardCards = function(key, token) {
      return $http.get(`https://api.trello.com//1/boards/${board_data}/cards?key=${key}&token=${token}`);
      // return $http.get('https://api.trello.com//1/boards/5c6cb6171cf49a5579a42e7d/cards?key=86b2621fa79c88d61ff3a95b82ec2bd7&token=7be1976d0063e2ca94d145fbf01604667dfee015cfe1b4cd41a355d76a1ca118');
    }
    this.privateData = function(key, token) {
      return $http.get(`https://api.trello.com/1/members/me/?key=${key}&token=${token}`);
      // return $http.get(`https://api.trello.com/1/members/me/?key=86b2621fa79c88d61ff3a95b82ec2bd7&token=7be1976d0063e2ca94d145fbf01604667dfee015cfe1b4cd41a355d76a1ca118`);
    }
  });
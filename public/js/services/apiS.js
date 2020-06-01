//  ---------------------------------- Services To Access API---------------------------------------------------  //


angular.module('workingHoursTrello').service('apiS', function($http){

  const board_id = credentials.board_id;

  const board_data = '5c6cb6171cf49a5579a42e7d';

  // get boards Members
  this.getBoardMembers = function(key, token) {
    return $http.get(`https://api.trello.com/1/boards/${board_id}/members?key=${key}&token=${token}`);
  }
  // get boars Lists
  this.getBoardLists = function(key, token) {
    return $http.get(`https://api.trello.com//1/boards/${board_id}/lists?key=${key}&token=${token}`);
  }
  //get boards Cards
  this.getBoardCards = function(key, token) {
    return $http.get(`https://api.trello.com/1/boards/${board_id}/cards?key=${key}&token=${token}`);
  }

  // get Calendar Data Board's Lists
  this.calendarBoardLists = function(key, token) {
    return $http.get(`https://api.trello.com//1/boards/${board_data}/lists?key=${key}&token=${token}`);
  }
  // get Calendar Data Board's Lists
  this.calendarBoardCards = function(key, token) {
    return $http.get(`https://api.trello.com//1/boards/${board_data}/cards?key=${key}&token=${token}`);
  }
});

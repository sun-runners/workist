angular.module('workingHoursTrello')
	.directive('weeklyDir',  function ($rootScope, serviceGetApi) {
		return {
			link : function(scope, element, attrs){

				// Initialize Function Section
				var initialize = function(){
          		var moment_original = $rootScope.moment.clone();
					var dt_original = $rootScope.getDtOfMoment(moment_original);
					scope.dts = [];
					for(var i=1; i<=7; i++){
						// Set new moment
						var moment_in_week = moment_original.clone();
						moment_in_week = moment_in_week.date((dt_original.week-1)*7+i);

						// Set new dt
						var dt_in_week = $rootScope.getDtOfMoment(moment_in_week);

						// Compare same week
						if(dt_in_week.week!=dt_original.week) continue;

						// Push dt
						scope.dts.push(dt_in_week);
					}
				};
				// Watch Function Section
				$rootScope.$watch('moment', function( $scope){
					initialize();
			  }, true);

//   ---------------------------------------------------- fetching API Getting Names & Cards ------------------------------		   
				// Get Boards Members
				serviceGetApi.getBoardMembers().then(function(response) {
					scope.boardMembers = response.data; 
				});
				// Get Boards Lists
				serviceGetApi.getBoardLists().then(function(response){
					scope.boardLists = response.data;
				});
				// Get Boards Cards
				serviceGetApi.getBoardCards().then(function(response){
					scope.boardCards = response.data;
				});

				// we Find the Card to show Base on the Owners ID and Lists ID
				scope.findCard = function(ownerId, cardId){
					let foundCard = scope.boardCards.find(function(card, index){
						return card.idMembers == ownerId && card.idList == cardId;
					});
					return foundCard;	
				}
				scope.findBoardList = function(dateWanted){
					// parse Date into the same Format as Lists Name
					getDate = dateWanted.getFullYear() + '/' + ('0' + (dateWanted.getMonth() + 1)).slice(-2) + '/' + dateWanted.getDate()

				    let foundList = scope.boardLists.find(function(list, index){
				      	let listNameBeforeSpace = list.name.substr(0,list.name.indexOf(' '));
				      	return listNameBeforeSpace == getDate;
				    }); 
				    // will return the ID of the Given Date
			  		return foundList.id;
			  	}
			  		// We Calculate the Number of Hours from the Card's Name
			  	scope.calculateCardNameToHours = function(card){
			  		let totalHours = eval(card.name);
			  		return Math.abs(totalHours);	
			  	}
			  	scope.calculateTheCardsHourToDay = function(cardsHour){
			  		if (cardsHour >= 8) {
			  			return cardsDay = 1;
			  		}else if (cardsHour < 8 && cardsHour > 4) {
			  			return 	cardsDay = 0.5;
			  		}else if (cardsHour <= 4) {
			  			return cardsDay = 0;
			  		}
			  	
			  	}

			  	scope.getCard = function(dateWanted, ownerId){
			  		this.dateWanted = dateWanted;
			  		this.ownerId = ownerId;
		
			  		try {
			  			    let theList = scope.findBoardList(this.dateWanted);
					  		// Find the Card of the Lists in the Given Day base on it's memberId.
					  		let theCard = scope.findCard(this.ownerId, theList);
					  		// Get the Total number of hours base on the Cards Name; ex: "11-13+21-23+23.5-24"
					  		let totalCardHours = scope.calculateCardNameToHours(theCard);
					  		//  Get the Day of the Card: 1, 0.5, 0. 
					  		let CardsDay = scope.calculateTheCardsHourToDay(totalCardHours);
					  		return CardsDay;
			  		} catch(e) {
			  			return 0;
			  			console.log(e);
			  		}
			  		
			  	}



			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/statistics/directives/weeklyDir.html",

	  	}
	});

'use strict';

angular.module('workingHoursTrello')
	.directive('weeklyDir', function ($rootScope) {
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
				$rootScope.$watch('moment', function(){
					initialize();
			  }, true);

			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/statistics/directives/weeklyDir.html",
			controller: function($scope, servTrelloApiGet) {
				servTrelloApiGet.getBoardMembers().then(function(response) {
					$scope.boardMembers = response.data;
				});
			}
		}
	});

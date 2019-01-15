'use strict';

angular.module('workingHoursTrello')
	.directive('weeklyDir',  function ($rootScope, $http) {
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
				$rootScope.$watch('moment', function( $scope, servTrelloApiGet){
	
					initialize();
			  }, true);

				$http.get('https://api.trello.com/1/boards/5ba38efef50b8979566922d0/members?key=86b2621fa79c88d61ff3a95b82ec2bd7&token=7be1976d0063e2ca94d145fbf01604667dfee015cfe1b4cd41a355d76a1ca118')
				.then(function (response) {
					scope.boardMembers = response.data;
				});
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/statistics/directives/weeklyDir.html"
		}
	});

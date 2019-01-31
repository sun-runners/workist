'use strict';

angular.module('workingHoursTrello')
	.directive('monthlyDir', function ($rootScope) {
		return {
			link : function(scope, element, attrs){

				// Initialize Function Section
				var initialize = function(){
					var moment_original = $rootScope.moment.clone();
					var dt_original = $rootScope.getDtOfMoment(moment_original);
					scope.thisDate = moment_original;
				
				var getWeeklyMonth = function (month, year){
				    let weeks=[],
				        firstDate=new Date(year, month, 1),
				        lastDate=new Date(year, month+1, 0), 
				        numDays= lastDate.getDate();
				    
				    let start=1;
				    let end=7;
				    let weekNumber = 1;
				    let monthMonthly = month+1
				    if (monthMonthly <= 9) {
				    	monthMonthly = "0"+ monthMonthly
				    }
				    while(start<=numDays){

				        weeks.push({week:weekNumber, start:monthMonthly+ " " +start,end:end});
				        weekNumber = weekNumber + 1;
				        start = end + 1;
				        end = end + 7;
				        if(end>numDays)
				            end=numDays;    
				    }        
				     return weeks;
				 }
				 scope.monthlyWeeks =  getWeeklyMonth(scope.thisDate.month(), scope.thisDate.year())  
					
				};
				// Watch Function Section
				$rootScope.$watch('moment', function( $scope){
					initialize();
			  }, true);

			scope.y = (number) => {
				if (number == 1) {
					return "January";
				}else {
					return "febuary";
				}
			} 

			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/statistics/directives/monthlyDir.html"
		}
	});

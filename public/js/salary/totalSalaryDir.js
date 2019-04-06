'use strict';

angular.module('workingHoursTrello')
	.directive('salaryDir', function ($rootScope, apiS) {
		return {
			link : function(scope, element, attrs){
				

                apiS.getBoardMembers().then((response) => scope.boardMembers = response.data /** Get Boards Members */);
			},
			restrict: "EA",
			replace: true,
			scope: {},
			templateUrl: "../../template/salary/directives/totalSalaryDir.html",
		}
	});

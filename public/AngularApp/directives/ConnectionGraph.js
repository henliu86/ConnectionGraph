angular.module("graphapp").directive("myjson",function(){
	return {
		restrict: "A",
		controller: "ConnectionGraphCtrl",
		link: function(scope,element){
			//call function to get salesforce data
			scope.getSalesforceJSON();
		}
	}
});
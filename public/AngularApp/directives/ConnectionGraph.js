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

angular.module("graphapp").directive("connectionGraphic",function(){
	return {
		restrict: "A",
		controller: "ConnectionGraphCtrl",
		link: function(scope,element){
			
			
		}
	}
});
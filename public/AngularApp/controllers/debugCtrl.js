angular.module("debug").controller("debugCtrl",function($scope,salesforceconnections){
	$scope.mouseEntered = function(){
		console.log("mouse Entered!");
	};
	$scope.mouseLeaved = function(){
		console.log("mouse Leaved!");
	};
	salesforceconnections.getUserIdToSubscriberIds().then(function(res){
		$scope.userIdToSubscriberIds = res.data;
	});
	salesforceconnections.getChatterGroupIdToSubscriberIds().then(function(res){
		$scope.chatterGroupIdToSubscriberIds = res.data;
	});
	salesforceconnections.getUserIdToChatterGroupIds().then(function(res){
		$scope.userIdToChatterGroupIds = res.data;
	});
	salesforceconnections.getIdToName().then(function(res){
		$scope.idToName = res.data;
	});
});


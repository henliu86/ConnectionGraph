angular.module("graphapp").controller("ConnectionGraphCtrl",function($scope, $q, salesforceconnections){
	
	var numProcessed = 0;
	var buildDefer = $q.defer();
	//check if all processes have been completed
	function allDone(){
		if(numProcessed == 4)
		{
			buildMyGraph();
		}
	}

	//factory getting json string into scope
	$scope.getSalesforceJSON = function()	
	{
		salesforceconnections.getUserIdToSubscriberIds().then(function(res){
			$scope.userIdToSubscriberIds = res.data;
			numProcessed++;
			allDone();

		});
		salesforceconnections.getChatterGroupIdToSubscriberIds().then(function(res){
			$scope.chatterGroupIdToSubscriberIds = res.data;
			numProcessed++;
			allDone();
		});
		salesforceconnections.getUserIdToChatterGroupIds().then(function(res){
			$scope.userIdToChatterGroupIds = res.data;
			numProcessed++;
			allDone();
		});
		salesforceconnections.getIdToName().then(function(res){
			$scope.idToName = res.data;
			numProcessed++;
			allDone();
		});
	}

	//once all data have been loaded, directive calls this function to build graph
	function buildMyGraph(){
		console.log("build my graph");
		var buildGraph = new BuildingGraph('00530000008L9njAAC','00530000008B7WiAAK'); //current user id, desire user id
		buildGraph.initMe($scope.userIdToSubscriberIds,$scope.chatterGroupIdToSubscriberIds,$scope.userIdToChatterGroupIds,$scope.idToName);
		buildGraph.build();

		//add yourself once the graph is built
		//buildGraph.addYourself();
	}
	
});


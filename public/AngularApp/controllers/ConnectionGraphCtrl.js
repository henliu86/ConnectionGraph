//salesforceconnections is the factory

angular.module("graphapp").controller("ConnectionGraphCtrl",function($scope, $q, salesforceconnections){
	$scope.desiredUserId = '00530000008B7WiAAK';
	$scope.myUserId = '00530000008L9njAAC';
	$scope.includeChatterGroups = false;
	var numProcessed = 0;
	var buildDefer = $q.defer();
	$scope.myNode = {};
	$scope.finalShortestPaths = [];
	
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
		if($scope.includeChatterGroups)
		{
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
		}
		else
		{
			$scope.chatterGroupIdToSubscriberIds = {};
			$scope.userIdToChatterGroupIds = {};
			numProcessed = numProcessed+2;
			allDone();
		}
		salesforceconnections.getIdToName().then(function(res){
			$scope.idToName = res.data;
			numProcessed++;
			allDone();
		});
	}

	//once all data have been loaded, directive calls this function to build graph
	function buildMyGraph(){
		console.log("build my graph");
		var buildGraph = new BuildingGraph($scope.myUserId,$scope.desiredUserId); //current user id, desire user id
		buildGraph.initMe($scope.userIdToSubscriberIds,$scope.chatterGroupIdToSubscriberIds,$scope.userIdToChatterGroupIds,$scope.idToName);
		buildGraph.build();
		$scope.myNode = buildGraph.rootNode;
		var shorestPaths = buildGraph.finalShortestPaths;
		for(var i=0;i<shorestPaths.length;i++)
		{
			var aPath = shorestPaths[i].reverse(); //reverse so order is from you to desire user
			$scope.finalShortestPaths.push([]);
			for(var j=0;j<aPath.length;j++)
			{
				if(aPath[j].userId.substring(0,3) == '005') //is user
					$scope.finalShortestPaths[i].push( aPath[j].userId ); //$scope.idToName[ "userMap" ][ aPath[j].userId ].Name
				else //is a chatter group
					$scope.finalShortestPaths[i].push( aPath[j].userId ); //$scope.idToName[ "chatterGroupMap" ][ aPath[j].userId ].Name
			}
		}


	}
	
});


//salesforceconnections is the factory
angular.module("graphapp").controller("ConnectionGraphCtrl",function($scope, $q, salesforceconnections){
	$scope.desiredUserId = '00530000008B7WiAAK';
	$scope.myUserId = '00530000008L9njAAC';
	$scope.includeChatterGroups = false;
	var numProcessed = 0;
	var buildDefer = $q.defer();
	$scope.myNode = {}; //node of me
	$scope.finalShortestPaths = [];
	$scope.globalUserMap; //map of all users
	$scope.d3object; //d3 node/link object. use for d3
	$scope.oauthObj;
	
	//check if all processes have been completed
	function allDone(callback){
		if(numProcessed == 5)
		{
			buildMyGraph(callback);
			numProcessed = 0; //reset so data will update on refresh
		}
	}

	//factory getting json string into scope
	$scope.getSalesforceJSON = function(callback)	
	{
		//console.log(callback);
		salesforceconnections.getOauthObject().then(function(res){
			$scope.oauthObj = res.data;
			numProcessed++;
			allDone(callback);
		});
		salesforceconnections.getUserIdToSubscriberIds().then(function(res){
			$scope.userIdToSubscriberIds = res.data;
			numProcessed++;
			allDone(callback);

		});
		if($scope.includeChatterGroups)
		{
			salesforceconnections.getChatterGroupIdToSubscriberIds().then(function(res){
				$scope.chatterGroupIdToSubscriberIds = res.data;
				numProcessed++;
				allDone(callback);
			});
			salesforceconnections.getUserIdToChatterGroupIds().then(function(res){
				$scope.userIdToChatterGroupIds = res.data;
				numProcessed++;
				allDone(callback);
			});
		}
		else
		{
			$scope.chatterGroupIdToSubscriberIds = {};
			$scope.userIdToChatterGroupIds = {};
			numProcessed = numProcessed+2;
			allDone(callback);
		}
		salesforceconnections.getIdToName().then(function(res){
			$scope.idToName = res.data;
			numProcessed++;
			allDone(callback);
		});
	}

	//once all data have been loaded, directive calls this function to build graph
	function buildMyGraph(callback){
		//console.log("build my graph");
		var buildGraph = new BuildingGraph($scope.myUserId,$scope.desiredUserId); //current user id, desire user id
		buildGraph.initMe($scope.userIdToSubscriberIds,$scope.chatterGroupIdToSubscriberIds,$scope.userIdToChatterGroupIds,$scope.idToName);
		buildGraph.build();
		$scope.myNode = buildGraph.rootNode;
		$scope.globalUserMap = buildGraph.globalUsers;
		$scope.d3object = buildGraph.d3object;
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

		callback($scope);
	}
	
});


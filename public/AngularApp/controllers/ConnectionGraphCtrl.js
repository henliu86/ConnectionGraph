//salesforceconnections is the factory
angular.module("graphapp").controller("ConnectionGraphCtrl",function($scope, $q, salesforceconnections, $routeParams){
	//http://damp-castle-2728.herokuapp.com/index/00530000008B7WiAAK/00530000008L9njAAC
	//http://damp-castle-2728.herokuapp.com/index/00530000008B7WR/00530000008B7Wi    elliot to vanessa
/*	
	$scope.desiredUserId = $routeParams.sourceUserId;//'00530000008B7WiAAK';
	$scope.myUserId = $routeParams.targetUserId; //'00530000008L9njAAC';
	console.log($routeParams);
	console.log($routeParams.sourceUserId);
	console.log($routeParams.targetUserId);
*/
	console.log("HERE WE GO!");
	$scope.includeChatterGroups = false;
	var numProcessed = 0;
	var buildDefer = $q.defer();
	$scope.myNode = {}; //node of me
	$scope.finalShortestPaths = [];
	$scope.globalUserMap; //map of all users
	$scope.d3object; //d3 node/link object. use for d3
	$scope.oauthObj;
	$scope.doneInit = false; //is the function done initializing, getting salesforce data
	
	//check if all processes have been completed
	function allDone(callback){
		if(numProcessed == 7)
		{
			buildMyGraph(callback);
			numProcessed = 0; //reset so data will update on refresh
		}
	}

	//factory getting json objects and userIds into scope
	//gotta do it this way because fucken factory calls are all async
	$scope.getSalesforceJSON = function(callback)	
	{
		salesforceconnections.getSourceUsers().then(function(res){
			$scope.myUserId = res.data;
			//console.log('source: ');
			//console.log( $scope.myUserId);
			numProcessed++;
			allDone(callback);
		});
		salesforceconnections.getTargetUsers().then(function(res){
			$scope.desiredUserId = res.data;
			//console.log('target: ');
			//console.log( $scope.desiredUserId);
			numProcessed++;
			allDone(callback);
		});

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
		console.log($scope.myUserId + ' to '+$scope.desiredUserId);
		var buildGraph = new BuildingGraph($scope.myUserId,$scope.desiredUserId); //current user id, desire user id
		$scope.doneInit = buildGraph.initMe($scope.userIdToSubscriberIds,$scope.chatterGroupIdToSubscriberIds,$scope.userIdToChatterGroupIds,$scope.idToName);
		$scope.$watch('doneInit',function(){
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
		});
	}
	
});


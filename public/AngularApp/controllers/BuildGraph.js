/****************************************************************************************************
 *	This class will build a graph of the people Users are following, including chatter groups  		*
 *	While traversing through all users, it will also find the shorest path to the desired User 		*
 *	VF PAGE is graphConnections																		*
 *	Created by Henry Liu, henry.liu@salesforce.com 													*
 ***************************************************************************************************/
function BuildingGraph(currentUserId, desireUsrId)
{	
	//build the whole graph, then go back and map userid to user name. This way it's more efficient

	this.globalUsers = {}; //Map<Id,ConnectionNode> //unique users id to connectionNode. Use this to check if ConnectionNode [User] is built already before building the node
	this.finalShortestPaths = {}; //List<List<ConnectionNode>> //shortest path to the the person you are viewing. Could have more than 1.
	this.rootNode = new ConnectionNode(currentUserId); //ConnectionNode //youself. Goal is to get to the person you are viewing
	
	this.userIdToSubscriberIds = {}; //Map<Id,List<Id>> //mapping of userid to followers userids
	this.chatterGroupIdToSubscriberIds = {}; //Map<Id,List<Id>> //mapping of chatterGroupId to followers' userids
	this.userIdToChatterGroupIds = {}; //Map<Id,List<Id>> //mapping of userid to Chatter Group Ids

	this.idToName = {}; //Map<Id,String> //id of user or chatter group to it's name
	//this should be standard controller, however there's no custom vf page available on user. SO this should be enter by user
	this.desiredUserId = desireUsrId; //Id //id of the user you are trying to see the connection with
	var that = this;
}

//to remove duplicates in array, just call array.unique();
Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) 
        {
        	var temp1 = a[i];
        	var temp2 = a[j];
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
};

//to remove duplicates in array, just call array.unique();
Array.prototype.uniquelists = function() {
    var listoflist = this.concat();
    for(var i=0; i<listoflist.length; ++i) {
        for(var j=i+1; j<listoflist.length; ++j) 
        {
        	//check if the list in the list are unique, so no duplicate list with same nodes
            for(var x=0;x<listoflist[i].length;x++)
            {
            	var isDuplicated = true;
            	if(listoflist[i][x].userId != listoflist[j][x].userId) //see if ConnectionNode.userId is the same
            	{
            		isDuplicated = false;
            		break;
            	}
            }
            if(isDuplicated)
                listoflist.splice(j--, 1); //remove the duplicated list
        }
    }
    return listoflist;
};

BuildingGraph.prototype = {
	/******************* This function needs to be called right after initializing BuildingGraph() *********************/
	initMe : function(myuserIdToSubscriberIds, mychatterGroupIdToSubscriberIds, myuserIdToChatterGroupIds, myidToName){
		this.userIdToSubscriberIds = myuserIdToSubscriberIds;
		this.chatterGroupIdToSubscriberIds = mychatterGroupIdToSubscriberIds;
		this.userIdToChatterGroupIds = myuserIdToChatterGroupIds;
		this.idToName = myidToName;
		console.log('initialized!');
	},

	/****************** This will build the whole graph ******************/
	build : function()
	{
		//Users I am following
		var iAmFollowing = this.userIdToSubscriberIds[this.rootNode.userId]; //List<id> //add all users I am following
		if(iAmFollowing != null)
		{
			var allChatGroupIFollow = this.userIdToChatterGroupIds[this.rootNode.userId]; //List<Id>
			if(allChatGroupIFollow != null)
				iAmFollowing.concat(allChatGroupIFollow).unique(); //add all groups I am following
		}
		else
			iAmFollowing = this.userIdToChatterGroupIds[this.rootNode.userId];

		//creating connectionNodes for ME
		var myFollowingNode = []; //List<ConnectionNode>
		for(var i=0; i< iAmFollowing.length; i++)
		{
			var c = new ConnectionNode(iAmFollowing[i]);
			//this.globalUsers[iAmFollowing[i]] = c; //add user you follow to globalUsers Mapping. This is to check if node for current user is created already
			myFollowingNode.push(c);
		}	
		this.rootNode.following = myFollowingNode;//add my following nodes into rootNode
		this.globalUsers[this.rootNode.userId] = this.rootNode;//add myself to globalUsers Mapping. This is to check if node for current user is created already

		//HERE COME RECURSION! BUILD THAT SHIT
		this.finalShortestPaths = this.buildHelper(this.rootNode);
		this.finalShortestPaths = this.finalShortestPaths.uniquelists();
		console.log("finalShortest: ");		
		console.log(this.finalShortestPaths);
		this.addYourself();
		//console.log(this.globalUsers);
	},

	addYourself : function()
	{
		//then now add yourself into the nodes
		for(var i=0;i<this.finalShortestPaths.length;i++) //path is List<ConnectionNode> 
		{
			this.rootNode.toDesiredNode.push(this.finalShortestPaths[i][this.finalShortestPaths[i].length-1]); //add paths to your own node
			//add starting user to the shortest path
			this.finalShortestPaths[i].push(this.rootNode); //add to the back of the list
		}
		if(this.finalShortestPaths.length < 0) //if there is a path to the desired person from ME
			this.rootNode.numberOfHop = this.rootNode.toDesiredNode[0].numberOfHop+1; //set root's number of hop
	},

	/********* This method is called recursively to build the graph *************/
	//returns the shortest paths (could have more than 1 shortest path) to or empty List
	buildHelper : function(connNode) //List<List<ConnectionNode>> buildHelper(ConnectionNode connNode)
	{
		console.log('\n\n--Current Connection Node: ' + connNode.userId);
		console.log(connNode);
		//console.log(connNode);
		var pathsToDesire = []; //find the shortest path. If this is not null then there is a path //List<List<ConnectionNode>>
		if(connNode.userId == this.desiredUserId) //you found him/her?!?
		{
			console.log('FOUND: '+connNode.userId);
			connNode.numberOfHop = 0;
			return [[]]; //return an empty list so at returned function can add the found user //List<List<ConnectionNode>>
		}	
		else //not the person, so keep building the graph
		{
			//build following nodes
			var meFollowing; //List<id>
			if(connNode.isChatterGroup == false)//this node is an user
			{	
				meFollowing = this.userIdToSubscriberIds[connNode.userId]; //get people this user is following
				//console.log('meFollowing:');
				//console.log(meFollowing);
				if(meFollowing != null) //if list is created already then just add chatter groups into the list too
				{
					var followingChatGroups = this.userIdToChatterGroupIds[connNode.userId]; //List<id>
					//console.log(connNode.userId+ ' is following these chatter group: '+ followingChatGroups);
					if(followingChatGroups != null) //make sure you are actually following at least 1 chatter group so don't input null
					{
						meFollowing.concat(followingChatGroups).unique(); //add all groups I am following
					}	
				}
				else //not following any users so just create a new list
				{
					meFollowing = this.userIdToChatterGroupIds[connNode.userId]; //add all groups I am following
				}
			}
			else //this node is a chatter group
				meFollowing = this.chatterGroupIdToSubscriberIds[connNode.userId]; //get people that are following this group

			if(meFollowing == null) //no one following or already when through users he/she follows
			{
				return null;
			}
			else //have people he/she follows
			{
				for(var i=0; i< meFollowing.length; i++) // i is an ID
				{
					var c = new ConnectionNode(meFollowing[i]);
					var alreadyTraverseNode = this.globalUsers[meFollowing[i]]; // this is to get the following person's node //ConnectionNode

					if(alreadyTraverseNode == null) //if not in here, then add to the unique user mapping
					{
						this.globalUsers[meFollowing[i]] = c; //add the user person is following to globalUsers Mapping.
						connNode.following.push(c); //only add to following list IF USER IS NOT ALREADY ADDED! This is because you don't want to traverse to the same node again.
					}
					else //already in the map
					{
						if(meFollowing[i] == this.desiredUserId)//if this following person is the desired user
						{	
							connNode.following.push(alreadyTraverseNode); //add so we get the desire path
							//connNode.numberOfHop = 1;
						}
						else //not the desired person and is already in the map
						{
							//See if the Node has numberOfHop set, if so then it already reached the desired person
							if(alreadyTraverseNode.numberOfHop != null)
							{
								console.log('REACHED User 2nd TIME for '+meFollowing[i]);
								console.log('follow persons hop is '+alreadyTraverseNode.numberOfHop);
								//If so, get the path from the that person
								var paths = this.getPathToDesired(alreadyTraverseNode); //List<List<ConnectionNode>>
								//then add the paths to pathsToDesire list
								for(var j=0; j< paths.length; j++) //path[j] is List<ConnectionNode>
								{	
									pathsToDesire.push(paths[j]); //then add the list to pathsToDesire
								}
								if(alreadyTraverseNode.numberOfHop + 1 < connNode.numberOfHop) //if new found path hop is less than current hop, then change it
									connNode.numberOfHop = alreadyTraverseNode.numberOfHop + 1;
							}
							//else //that means we found a loop so don't do ANYTHING!!
						}
					}
				}
				//console.log('Following nodes: ');
				//console.log(connNode.following);
				//traverse through all user this person is following
				for(var c=0;c < connNode.following.length; c++) //c is a ConnectionNode
				{
					var listOfShortestPaths = this.buildHelper(connNode.following[c]);//List<List<ConnectionNode>>
					//(connNode.following[c].numberOfHop == null) ? this.buildHelper(connNode.following[c]) : null;
					if(listOfShortestPaths != null && listOfShortestPaths.length > 0) //found path //&& !listOfShortestPaths.isEmpty() means found the desired user
					{
						//add to current list of shortest paths
						for(var l=0;l<listOfShortestPaths.length;l++) //l is List<ConnectionNode> 
						{
							listOfShortestPaths[l].push(connNode.following[c]); //add itself since this node is within the path to desired node
							pathsToDesire.push(listOfShortestPaths[l]); //gather all the path, so we can then return the shortest path
						}
					}
				}
				return this.shortestPath(pathsToDesire); //return the shortest path
			}
		}
	},

	/***************** calculate the shortest path and return that list ***************/
	//argument should never be null but could be empty
	//there could be more than 1 shortest path, so gotta pass back a list of shortest paths
	shortestPath : function(listOfConnNodes) //List<List<ConnectionNode>> shortestPath(List<List<ConnectionNode>>
	{
		var shortestCount = -1;
		var currentShortestPaths = []; //List<List<ConnectionNode>> 
		if(listOfConnNodes.length == 0) //if don't have a path to desired User
			return null;
		else
		{
			//figure out which list(s) have the shorest count/path
			for(var x = 0;x<listOfConnNodes.length;x++) //listOfConnNodes[x]  is List<ConnectionNode>
				if(listOfConnNodes[x] != null)
				{
					if(shortestCount == -1) //first one so just set it as that one
					{
						currentShortestPaths.push(listOfConnNodes[x]);
						//set shortest count
						shortestCount = listOfConnNodes[x].length;
					}
					else //compare this one to existing one to see which one is shorter, ignore if path count is larger
					{	
						if(listOfConnNodes[x].length < shortestCount)//found shorter paths
						{
							currentShortestPaths = []; //reset the currentShortestPaths and add this one in //new List<List<ConnectionNode>>()
							currentShortestPaths.push(listOfConnNodes[x]);
							shortestCount = listOfConnNodes[x].length; //reset shortestCount
						}
						else if(listOfConnNodes[x].length == shortestCount)//found a path with same count
							currentShortestPaths.push(listOfConnNodes[x]); //add to currentShortestPaths
					}
				}
			
			for(var x = 0;x< currentShortestPaths.length;x++) //spaths is List<ConnectionNode> 
			{
				//set numberOfHop from furthest to shortest
				currentShortestPaths[x][currentShortestPaths[x].length-1].numberOfHop = currentShortestPaths[x].length-1;
				if(currentShortestPaths[x].length > 1) //not just contain the desired node
					for(var i = 1;i<currentShortestPaths[x].length;i++)
						if(!this.listNodeContains(currentShortestPaths[x][i].toDesiredNode,currentShortestPaths[x][i-1]))//if not already added then add
						{	
							//wtf is this doing again?
							currentShortestPaths[x][i].toDesiredNode.push(currentShortestPaths[x][i-1]); //go through and set the Node's toDesiredNode field
						}
			}	
			return currentShortestPaths;
		}
	},

	//traverse nodes and return the path in a list
	getPathToDesired : function(curNode) //List<List<ConnectionNode>> getPathToDesired(ConnectionNode curNode)
	{
		var paths = []; //List<List<ConnectionNode>> 
		//reached the end, the desired node
		if(curNode.toDesiredNode.length == 0)
		{
			var l = []; //List<ConnectionNode>
			l.push(curNode);
			paths.push(l);
		}
		else //keep going
		{
			for(var n=0;n<curNode.toDesiredNode.length;n++) // n is ConnectionNode
			{
				paths = this.getPathToDesired(curNode.toDesiredNode[n]);
				for(var l=0;l<paths.length;l++) //for each path //List<ConnectionNode> 
					paths[l].push(curNode); //add itself to the list
			}
		}
		return paths;
	},

	//simple check wether list contains the id or not
	listContains : function(listOfIds, lookForId)
	{
		for(var i = 0; i< listOfIds.length;i++)
			if(listOfIds[i] == lookForId)
				return true;
		return false;
	},

	//simple check wether list contains the id or not
	listNodeContains : function(listOfNodes,lookForNode) //boolean listContains(List<ConnectionNode> listOfNodes, ConnectionNode lookForNode)
	{
		for(var i = 0; i< listOfNodes.length;i++)
			if(listOfNodes[i].userId == lookForNode.userId)
				return true;
		return false;
	}
}
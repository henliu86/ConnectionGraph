/****************************************
* This class gets data from salesforce  *
****************************************/

var userIdToSubscriberIds;

var userIdToChatterGroupIds;
var chatterGroupIdToSubscriberIds;
var doneWithFunctionCall = false;//done with setting both userIdToChatterGroupIds and chatterGroupIdToSubscriberIds

var sourceAndTargetUserId = {
	'sourceTargetId': null,
	'targetUserId': null
};
export.sourceAndTargetUserId = function(){
	return sourceAndTargetUserId;
}

////map all subscribers
exports.getUserIdToSubscriberIds = function(org,req,res){
	
		userIdToSubscriberIds={};
		//console.log('oauth Obj:');
		//console.log(oauthObj);

		var q = "select parentId,subscriberId from EntitySubscription where NetworkId = null";//default network
		var result;
		
		//do your query
		org.query(q, req.session.oauth, function(err, resp){
			if(!err && resp.records){
				var result = resp.records;
				console.log('EntitySubscription Query SUCCESS!!');
				entitySubscriptions = parseSalesforceEntitySubscription(result);

				//logic for mapping all user subscribers
				for(var x=0;x<entitySubscriptions.length;x++) //list of all users
				if( (entitySubscriptions[x].parentId).substring(0,3) == '005') //if parent is user
					for(var y=0; y < entitySubscriptions.length;y++) //list of all subscribers
						if( entitySubscriptions[y].parentId.substring(0,3) == '005' )// || ((String)es.parentId).substring(0,3) == '0F9') //if current subscriber is an user or chatter group
						{
							if(entitySubscriptions[x].parentId == entitySubscriptions[y].subscriberId) //if user is a your subscriber, then add to userIdToSubscriberIds map
							{
								//if no userid in the map yet, then create one
								if(userIdToSubscriberIds[entitySubscriptions[x].parentId] == null)
								{
									userIdToSubscriberIds[entitySubscriptions[x].parentId] = [entitySubscriptions[y].parentId];
								}
								else //else just add to the existing one
								{
									//if list does not contain the user yet, then add
									var listOfFollowing = userIdToSubscriberIds[entitySubscriptions[x].parentId]; //list of ids
									if( !listContains(listOfFollowing,entitySubscriptions[y].parentId) ) //if it's not in list already
										userIdToSubscriberIds[entitySubscriptions[x].parentId].push(entitySubscriptions[y].parentId);
								}
							}
						}

				//console.log('jsonResult is : '+userIdToSubscriberIds);
				res.send( JSON.stringify(userIdToSubscriberIds) );
			}
			else
			{
				console.log(err);
				console.log(resp);
			}
		});

		/******************* another way of authenticating, by username and password ********************
		org.authenticate({ username: 'username@here.com', password: 'passwordhere'}, function(err, resp){
			// store the oauth object for this user
			if(!err) 
			{
				oauth = resp;
				console.log(resp);

				//do your queries after you get oauth
				org.query(q,oauth, function(err, resp){
					if(!err && resp.records){
						var a = resp.records[0];
						console.log('QUERY SUCCESS!!');
						console.log(resp);
					}
					else
					{
						console.log(err);
						console.log(resp);
					}
				});
			}
		});
		****************************************************************************************************/
	
};

function parseSalesforceEntitySubscription(salesforceObj){
	var myJsonObj = [];
	for(var x = 0;x < salesforceObj.length;x++)
	{
		var NewObj = new Object();
		NewObj.parentId = salesforceObj[x].ParentId;
		NewObj.subscriberId = salesforceObj[x].SubscriberId;
		myJsonObj.push(NewObj);
	}
	//console.log('parsedObject:');
	//console.log(myJsonObj);
	return myJsonObj;
}


exports.getChatterGroupIdToSubscriberIds = function(org,req,res){
	chatterGroupIdToSubscriberIds = null;
	doneWithFunctionCall = false;
	if(chatterGroupIdToSubscriberIds == null)
	{
		console.log('chatterGroupIdToSubscriberIds is null');
		userToChatterGroupAndChatterGroupToSubscriber(org, req, res, function(){
			res.send( JSON.stringify(chatterGroupIdToSubscriberIds) );
		});
	}
	else
	{
		console.log('chatterGroupIdToSubscriberIds is NOT NULL');
		var interval = setInterval( function(){
			if(doneWithFunctionCall)
			{	
				clearInterval(interval);
				res.send( JSON.stringify(chatterGroupIdToSubscriberIds) );
			}
		},100);
	}
};

exports.getUserIdToChatterGroupIds = function(org,req,res){
	userIdToChatterGroupIds = null;
	doneWithFunctionCall = false;
	if(userIdToChatterGroupIds == null)
	{	
		console.log('userIdToChatterGroupIds is null');
		userToChatterGroupAndChatterGroupToSubscriber(org,req, res, function(){
			res.send( JSON.stringify(userIdToChatterGroupIds) );
		});
	}
	else
	{
		console.log('userIdToChatterGroupIds is NOT NULL');
		var interval = setInterval(function(){ 
			if(doneWithFunctionCall)
			{	
				clearInterval(interval);
				res.send( JSON.stringify(userIdToChatterGroupIds) );
			}
		},100);
	}
};

//this function is going to set userIdToChatterGroupIds and chatterGroupIdToSubscriberIds
function userToChatterGroupAndChatterGroupToSubscriber(org,req,res,callback)
{
	userIdToChatterGroupIds = {};
	chatterGroupIdToSubscriberIds = {};

	var q = "SELECT CollaborationGroupId,MemberId FROM CollaborationGroupMember WHERE CollaborationGroup.NetworkId = null";

	//do your query
	org.query(q, req.session.oauth, function(err, resp){
		if(!err && resp.records){
			var result = resp.records;
			console.log('CollaborationGroupMember Query SUCCESS!!');

			var allchatsubscriptions = parseSalesforceCollaborationGroupMember(result);

			for(var e = 0; e < allchatsubscriptions.length; e++) //list of all chatter group
			{
				for(var es = 0; es < allchatsubscriptions.length; es++) //list of all subscribers
					if(allchatsubscriptions[e].collaborationGroupId == allchatsubscriptions[es].collaborationGroupId) //if user is a your subscriber, then add to userIdToChatterGroupIds map
					{
						//populate userId to ChatterGroupIds Map
						//if no chatter group id in the map yet, then create one
						if(userIdToChatterGroupIds[allchatsubscriptions[e].memberId] == null)
						{
							userIdToChatterGroupIds[allchatsubscriptions[e].memberId] = [allchatsubscriptions[es].collaborationGroupId];
							//console.log(userIdToChatterGroupIds);
						}
						else //else just add to the existing one
						{
							//if list does not contain the user yet, then add
							var listOfFollowing = userIdToChatterGroupIds[allchatsubscriptions[e].memberId]; //list of ids
							if( !listContains(listOfFollowing,allchatsubscriptions[es].collaborationGroupId) ) //if it's not in list already
								userIdToChatterGroupIds[allchatsubscriptions[e].memberId].push(allchatsubscriptions[es].collaborationGroupId);
						}

						//Populate ChatterGroupId to subscriber User Ids
						//if no chatter group id in the map yet, then create one
						if(chatterGroupIdToSubscriberIds[allchatsubscriptions[e].collaborationGroupId] == null)
						{
							chatterGroupIdToSubscriberIds[allchatsubscriptions[e].collaborationGroupId] = [allchatsubscriptions[es].memberId];
						}
						else //else just add to the existing one
						{
							//if list does not contain the user yet, then add
							var listOfFollowing = chatterGroupIdToSubscriberIds[allchatsubscriptions[e].collaborationGroupId];
							if( !listContains(listOfFollowing,allchatsubscriptions[es].memberId) ) //if it's not in list already
								chatterGroupIdToSubscriberIds[allchatsubscriptions[e].collaborationGroupId].push(allchatsubscriptions[es].memberId);
						}
					}
			}
			doneWithFunctionCall = true;
			//res.send( JSON.stringify(userIdToChatterGroupIds) );	
			callback();	//res send the data user is asking for
		}
		else
		{
			console.log(err);
			console.log(resp);
		}

	});
}

function parseSalesforceCollaborationGroupMember(salesforceObj)
{
	var myJsonObj = [];
	for(var x = 0;x < salesforceObj.length;x++)
	{
		var NewObj = new Object();
		NewObj.collaborationGroupId = salesforceObj[x].CollaborationGroupId;
		NewObj.memberId = salesforceObj[x].MemberId;
		myJsonObj.push(NewObj);
	}
	//console.log('parsedObject:');
	//console.log(myJsonObj);
	return myJsonObj;
}


exports.getIdToName = function(org,req,res){
	var mapOf_UserId_Info = {}; //map of userid to object with user info Object
	var mapOf_ChatterGroupId_Info = {}; //map of Chatter Group Id to Chatter Group Info Object
	var q = "SELECT AboutMe,Alias,Email,FirstName,FullPhotoUrl,Id,LastName,Name,Phone,SmallPhotoUrl,Title,Username,UserType FROM User";
	org.query(q, req.session.oauth, function(err, resp){
		if(!err && resp.records)
		{
			var listOfUsers = resp.records;
			for(var x=0; x<listOfUsers.length; x++)
			{
				//parse through the user json info and add to map
				var newUserObj = new Object();
				newUserObj.Type = listOfUsers[x].attributes.type;
				newUserObj.Url = listOfUsers[x].attributes.url;
				newUserObj.AboutMe = listOfUsers[x].AboutMe;
				newUserObj.Alias = listOfUsers[x].Alias;
				newUserObj.Email = listOfUsers[x].Email;
				newUserObj.FirstName = listOfUsers[x].FirstName;
				newUserObj.LastName = listOfUsers[x].LastName;
				newUserObj.Name = listOfUsers[x].Name;
				newUserObj.FullPhotoUrl = listOfUsers[x].FullPhotoUrl;
				newUserObj.Id = listOfUsers[x].Id;
				newUserObj.Phone = listOfUsers[x].Phone;
				newUserObj.SmallPhotoUrl = listOfUsers[x].SmallPhotoUrl;
				newUserObj.Title = listOfUsers[x].Title;
				newUserObj.Username = listOfUsers[x].Username;
				newUserObj.UserType = listOfUsers[x].UserType;

				mapOf_UserId_Info[ newUserObj.Id ] = newUserObj;
			}

			//QUERY for chatter group so we can add it to the mapping
			var queryChatterGroup = "SELECT Name, Id, NetworkId, FullPhotoUrl, SmallPhotoUrl, OwnerId, CollaborationType, Description, InformationTitle, InformationBody FROM CollaborationGroup";
			org.query(queryChatterGroup, req.session.oauth,function(errC, respC){
				if(!errC && respC.records)
				{
					var listOfChatGroups = respC.records;
					//parse through the chatter group json info and add to map
					for(var x=0; x<listOfChatGroups.length; x++)
					{
						var newChatGroupObj = new Object();
						newChatGroupObj.type = listOfChatGroups[x].attributes.type;
						newChatGroupObj.url = listOfChatGroups[x].attributes.url;
						newChatGroupObj.Name = listOfChatGroups[x].Name;
						newChatGroupObj.Id = listOfChatGroups[x].Id;
						newChatGroupObj.NetworkId = listOfChatGroups[x].NetworkId;
						newChatGroupObj.FullPhotoUrl = listOfChatGroups[x].FullPhotoUrl;
						newChatGroupObj.SmallPhotoUrl = listOfChatGroups[x].SmallPhotoUrl;
						newChatGroupObj.OwnerId = listOfChatGroups[x].OwnerId;
						newChatGroupObj.CollaborationType = listOfChatGroups[x].CollaborationType;
						newChatGroupObj.Description = listOfChatGroups[x].Description;
						newChatGroupObj.InformationTitle = listOfChatGroups[x].InformationTitle;
						newChatGroupObj.InformationBody = listOfChatGroups[x].InformationBody;
						
						mapOf_ChatterGroupId_Info[newChatGroupObj.Id] = newChatGroupObj;
					}

					var listOfMaps = {};
					listOfMaps["userMap"] = mapOf_UserId_Info;
					listOfMaps["chatterGroupMap"] = mapOf_ChatterGroupId_Info;

					res.send(JSON.stringify(listOfMaps));
					//res.send(JSON.stringify( mapOf_UserId_Info ));
				}
				else
				{
					console.log(errC);
					console.log(respC);
					res.send(errC);
				}

			});
			
		}
		else
		{
			console.log(err);
			console.log(resp);
			res.send(err);
		}
	});
};


//simple check wether list contains the id or not
function listContains(listOfIds, lookForId)
{
	for(var i = 0; i< listOfIds.length;i++)
		if(listOfIds[i] == lookForId)
			return true;
	return false;
}



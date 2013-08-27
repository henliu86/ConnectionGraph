/****************************************
* This class gets data from salesforce  *
****************************************/

exports.getUserIdToSubscriberIds = function(org,req){
	var userIdToSubscriberIds;
	//console.log('oauth Obj:');
	//console.log(oauthObj);

	var q = "select parentId,subscriberId from EntitySubscription where NetworkId = null";//default network
	
	//use access code to get access_token
	org.authenticate({ code: req.session.oauth.code }, function(err, oauth){
		if(!err) 
		{
			console.log('resp: ')
			console.log(oauth);        
			req.session.oauth = oauth; //reassign session oath object

			//do your query
			org.query(q,oauth, function(err, resp){
				if(!err && resp.records){
					var a = resp.records[0];
					console.log('QUERY SUCCESS!!');
				}
				else
				{
					console.log(err);
					console.log(resp);
				}

				console.log(req.session);
			});
		} else {
			console.log('Error: ' + err.message);
		}
    });
	/*
	org.authenticate({ username: 'hliu@salesforce.chatter', password: 'salesforce1'}, function(err, resp){
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
	*/

	

	
	
	

	
	//grab data from salesforce and put it into local variables in here.
	userIdToSubscriberIds = {
		"00530000008B7WbAAK":[
			"00530000008B7WTAA0",
			"0F9300000001jcUCAQ",
			"0F9300000001jcRCAQ",
			"0F9300000001jcTCAQ"
		],
		"00530000008B7WjAAK":[
			"00530000008B7WRAA0",
			"00530000008B7WTAA0",
			"00530000008B7WZAA0",
			"00530000008B7WaAAK",
			"00530000008B7WeAAK",
			"00530000008B7WgAAK",
			"00530000008B7WuAAK",
			"00530000008B7WxAAK",
			"00530000008L9njAAC",
			"0F9300000001jcVCAQ"
		],
		"00530000008B7WuAAK":[
			"00530000008B7WRAA0",
			"00530000008B7WbAAK",
			"00530000008B7WxAAK",
			"00530000008L9njAAC",
			"0F9300000001jcTCAQ"
		],
		"00530000008B7WfAAK":[
			"00530000008B7WRAA0",
			"00530000008B7WVAA0",
			"00530000008B7WZAA0",
			"00530000008B7WgAAK",
			"00530000008B7WuAAK",
			"00530000008L9njAAC",
			"0F9300000001jcRCAQ"
		],
		"00530000008B7WxAAK":[
			"00530000008B7WRAA0",
			"00530000008B7WZAA0",
			"00530000008B7WbAAK",
			"00530000008B7WuAAK",
			"00530000008L9njAAC",
			"0F9300000001jcUCAQ",
			"0F9300000001jcTCAQ"
		],
		"00530000008B7WWAA0":[
			"00530000008L9njAAC"
		],
		"00530000008B7WiAAK":[
			"00530000008B7WRAA0",
			"00530000008B7WfAAK"
		],
		"00530000008B7WaAAK":[
			"00530000008B7WRAA0",
			"00530000008B7WZAA0",
			"00530000008B7WeAAK",
			"00530000008B7WgAAK",
			"00530000008B7WjAAK",
			"00530000008B7WuAAK",
			"00530000008L9njAAC",
			"0F9300000001jcVCAQ"
		],
		"00530000008B7WVAA0":[
			"00530000008B7WRAA0",
			"00530000008B7WZAA0",
			"00530000008B7WfAAK",
			"00530000008B7WgAAK",
			"00530000008B7WuAAK",
			"00530000008L9njAAC"
		],
		"00530000008B7WdAAK":[
			"00530000008B7WeAAK",
			"0F9300000001jcQCAQ"
		],
		"00530000008LL3BAAW":[
			"00530000008L9njAAC"
		],
		"00530000008B7WcAAK":[
			"00530000008B7WRAA0"
		],
		"00530000008B7WZAA0":[
			"00530000008B7WRAA0",
			"00530000008B7WgAAK",
			"00530000008B7WuAAK",
			"00530000008L9njAAC"
		],
		"00530000008B7WeAAK":[
			"00530000008B7WiAAK"
		],
		"00530000008L9njAAC":[
			"00530000008B7WcAAK",
			"00530000008B7WdAAK",
			"00530000008LL3BAAW",
			"0F9300000001jcSCAQ",
			"0F9300000001jcQCAQ",
			"0F9300000001jcTCAQ",
			"0F9300000001jcPCAQ",
			"0F9300000001jcSCAQ",
			"0F9300000001jcQCAQ",
			"0F9300000001jcTCAQ",
			"0F9300000001jcPCAQ"
		],
		"00530000008B7WvAAK":[
			"00530000008B7WJAA0",
			"00530000008B7WTAA0",
			"00530000008B7WfAAK",
			"00530000008L9njAAC",
			"0F9300000001jcRCAQ"
		],
		"00530000008B7WRAA0":[
			"00530000008B7WiAAK",
			"0F9300000001jcVCAQ",
			"0F9300000001jcSCAQ"
		],
		"00530000008B7WTAA0":[
			"00530000008B7WRAA0",
			"00530000008B7WZAA0",
			"00530000008B7WcAAK",
			"00530000008B7WdAAK",
			"00530000008B7WfAAK",
			"00530000008B7WgAAK",
			"00530000008B7WuAAK"
		]};
	return JSON.stringify(userIdToSubscriberIds);
};


exports.getChatterGroupIdToSubscriberIds = function(){
	// //map all subscribers
	// List<EntitySubscription> allsubscriptions = [select parentId,subscriberId from EntitySubscription where NetworkId = :Network.getNetworkId()];
	// for(EntitySubscription e : allsubscriptions) //list of all users
	// 	if( ((String)e.parentId).substring(0,3) == '005') //if parent is user
	// 		for(EntitySubscription es : allsubscriptions) //list of all subscribers
	// 			if( ((String)es.parentId).substring(0,3) == '005' )// || ((String)es.parentId).substring(0,3) == '0F9') //if current subscriber is an user or chatter group
	// 			{
	// 				if(e.parentId == es.subscriberId) //if user is a your subscriber, then add to userIdToSubscriberIds map
	// 				{
	// 					//if no userid in the map yet, then create one
	// 					if(!userIdToSubscriberIds.containsKey(e.parentId))
	// 					{
	// 						List<Id> l = new List<Id>();
	// 						l.add(es.parentId);
	// 						userIdToSubscriberIds.put(e.parentId,l);
	// 					}
	// 					else //else just add to the existing one
	// 					{
	// 						//if list does not contain the user yet, then add
	// 						List<Id> listOfFollowing = userIdToSubscriberIds.get(e.parentId);
	// 						if( !listContains(listOfFollowing,es.parentId) ) //if it's not in list already
	// 							userIdToSubscriberIds.get(e.parentId).add(es.parentId);
	// 					}
	// 				}
	// 			}
	// 			** This is if you want to get people who is following you instead of you following them
	// 			if( ((String)es.parentId).substring(0,3) == '005' || ((String)es.parentId).substring(0,3) == '0F9' ) //if current subscriber is a chatter group
	// 			{
	// 				if(e.parentId == es.parentId) //if user is a your subscriber, then add to userIdToSubscriberIds map
	// 				{
	// 					//if no userid in the map yet, then create one
	// 					if(!userIdToSubscriberIds.containsKey(e.parentId))
	// 					{
	// 						List<Id> l = new List<Id>();
	// 						l.add(es.subscriberId); //add chatter group follower
	// 						userIdToSubscriberIds.put(e.parentId,l);
	// 					}
	// 					else //else just add to the existing one
	// 					{
	// 						//if list does not contain the user yet, then add
	// 						List<Id> listOfFollowing = userIdToSubscriberIds.get(e.parentId);
	// 						if( ((String)es.parentId).substring(0,3) == '005' && !listContains(listOfFollowing,es.parentId) ) //if it's an user & not in list already
	// 							userIdToSubscriberIds.get(e.parentId).add(es.subscriberId);
	// 					}
	// 				}
	// 			}
	// 			**
	
	// //map all chatter group id to members
	// List<CollaborationGroupMember> allchatsubscriptions = [SELECT CollaborationGroupId,MemberId FROM CollaborationGroupMember WHERE CollaborationGroup.NetworkId = :Network.getNetworkId()];
	// for(CollaborationGroupMember e : allchatsubscriptions) //list of all chatter group
	// 	for(CollaborationGroupMember es : allchatsubscriptions) //list of all subscribers
	// 		if(e.CollaborationGroupId == es.CollaborationGroupId) //if user is a your subscriber, then add to userIdToChatterGroupIds map
	// 		{
	// 			//populate userId to ChatterGroupIds Map
	// 			//if no chatter group id in the map yet, then create one
	// 			if(!userIdToChatterGroupIds.containsKey(e.MemberId))
	// 			{
	// 				List<Id> l = new List<Id>();
	// 				l.add(es.CollaborationGroupId);
	// 				userIdToChatterGroupIds.put(e.MemberId,l);
	// 			}
	// 			else //else just add to the existing one
	// 			{
	// 				//if list does not contain the user yet, then add
	// 				List<Id> listOfFollowing = userIdToChatterGroupIds.get(e.MemberId);
	// 				if( !listContains(listOfFollowing,es.CollaborationGroupId) ) //if it's not in list already
	// 					userIdToChatterGroupIds.get(e.MemberId).add(es.CollaborationGroupId);
	// 			}

	// 			//Populate ChatterGroupId to subscriber User Ids
	// 			//if no chatter group id in the map yet, then create one
	// 			if(!chatterGroupIdToSubscriberIds.containsKey(e.CollaborationGroupId))
	// 			{
	// 				List<Id> l = new List<Id>();
	// 				l.add(es.MemberId);
	// 				chatterGroupIdToSubscriberIds.put(e.CollaborationGroupId,l);
	// 			}
	// 			else //else just add to the existing one
	// 			{
	// 				//if list does not contain the user yet, then add
	// 				List<Id> listOfFollowing = chatterGroupIdToSubscriberIds.get(e.CollaborationGroupId);
	// 				if( !listContains(listOfFollowing,es.MemberId) ) //if it's not in list already
	// 					chatterGroupIdToSubscriberIds.get(e.CollaborationGroupId).add(es.MemberId);
	// 			}
	// 		}

	

	// //go through all globalUsers and map id to name
	// List<User> allU = [select id, name from User where id in :globalUsers.keySet()];
	// List<CollaborationGroup> allChatGrp = [select id, name from CollaborationGroup where id in :globalUsers.keySet()];
	// for(User u : allU)
	// 	idToName.put(u.id,u.name);
	// for(CollaborationGroup g : allChatGrp)
	// 	idToName.put(g.id,g.name);



	var chatterGroupIdToSubscriberIds ={
		"0F9300000001jcUCAQ":[
			"00530000008B7WxAAK",
			"00530000008B7WwAAK",
			"00530000008B7WbAAK",
			"00530000008B7WNAA0",
			"00530000008B7WJAA0"
		],
		"0F9300000001jcSCAQ":[
			"00530000008B7WNAA0",
			"00530000008L9njAAC",
			"00530000008B7WiAAK",
			"00530000008B7WRAA0"
		],
		"0F9300000001jcQCAQ":[
			"00530000008B7WdAAK",
			"00530000008B7WNAA0",
			"00530000008B7WiAAK",
			"00530000008L9njAAC"
		],
		"0F9300000001jcTCAQ":[
			"00530000008B7WNAA0",
			"00530000008L9njAAC",
			"00530000008B7WuAAK",
			"00530000008B7WxAAK",
			"00530000008B7WbAAK",
			"00530000008B7WJAA0"
		],
		"0F9300000001jcVCAQ":[
			"00530000008B7WRAA0",
			"00530000008B7WaAAK",
			"00530000008B7WjAAK",
			"00530000008B7WmAAK"
		],
		"0F9300000001jcPCAQ":[
			"00530000008L9njAAC"
		],
		"0F9300000001jcRCAQ":[
			"00530000008B7WJAA0",
			"00530000008B7WPAA0",
			"00530000008B7XZAA0",
			"00530000008B7WfAAK",
			"00530000008B7WbAAK",
			"00530000008B7WvAAK"
		]};
	return JSON.stringify(chatterGroupIdToSubscriberIds);
};

exports.getUserIdToChatterGroupIds = function(){
	var userIdToChatterGroupIds = {
		"00530000008B7WbAAK":[
			"0F9300000001jcUCAQ",
			"0F9300000001jcRCAQ",
			"0F9300000001jcTCAQ"
		],
		"00530000008B7WJAA0":[
			"0F9300000001jcRCAQ",
			"0F9300000001jcTCAQ",
			"0F9300000001jcUCAQ"
		],
		"00530000008B7WjAAK":[
			"0F9300000001jcVCAQ"
		],
		"00530000008B7WuAAK":[
			"0F9300000001jcTCAQ"
		],
		"00530000008B7WPAA0":[
			"0F9300000001jcRCAQ"
		],
		"00530000008B7WfAAK":[
			"0F9300000001jcRCAQ"
		],
		"00530000008B7WxAAK":[
			"0F9300000001jcUCAQ",
			"0F9300000001jcTCAQ"
		],
		"00530000008B7WiAAK":[
			"0F9300000001jcQCAQ",
			"0F9300000001jcSCAQ"
		],
		"00530000008B7WwAAK":[
			"0F9300000001jcUCAQ"
		],
		"00530000008B7WaAAK":[
			"0F9300000001jcVCAQ"
		],
		"00530000008B7WmAAK":[
			"0F9300000001jcVCAQ"
		],
		"00530000008B7WdAAK":[
			"0F9300000001jcQCAQ"
		],
		"00530000008B7XZAA0":[
			"0F9300000001jcRCAQ"
		],
		"00530000008B7WNAA0":[
			"0F9300000001jcSCAQ",
			"0F9300000001jcTCAQ",
			"0F9300000001jcQCAQ",
			"0F9300000001jcUCAQ"
		],
		"00530000008L9njAAC":[
			"0F9300000001jcSCAQ",
			"0F9300000001jcQCAQ",
			"0F9300000001jcTCAQ",
			"0F9300000001jcPCAQ"
		],
		"00530000008B7WvAAK":[
		"	0F9300000001jcRCAQ"
		],
		"00530000008B7WRAA0":[
			"0F9300000001jcVCAQ",
			"0F9300000001jcSCAQ"
		]};
	return JSON.stringify(userIdToChatterGroupIds);
};

exports.getIdToName = function(){
	var idToName = {
		"00530000008B7WJAA0":"Andrea Admin",
		"00530000008B7WgAAK":"Chet Callaghan",
		"00530000008B7WjAAK":"Ely East",
		"00530000008B7WfAAK":"Cindy Central",
		"0F9300000001jcVCAQ":"Southeast Sales Team",
		"00530000008B7WxAAK":"Linda Support",
		"00530000008B7WwAAK":"Jay Support",
		"00530000008B7WVAA0":"Kasey Central",
		"00530000008B7WmAAK":"Gordon SVP",
		"00530000008B7XZAA0":"Brent Salazar",
		"00530000008LL3BAAW":"Sameer Singhvi",
		"0F9300000001jcQCAQ":"Competitive Experts",
		"0F9300000001jcPCAQ":"Customer Collaboration",
		"0F9300000001jcRCAQ":"DOT Green & Cirrus",
		"00530000008B7WcAAK":"Vince West",
		"00530000008B7WeAAK":"Valerie East",
		"00530000008B7WZAA0":"Sue Market",
		"00530000008B7WNAA0":"Joe Social",
		"00530000008B7WvAAK":"Brenda Support",
		"0F9300000001jcUCAQ":"Support Management Team",
		"0F9300000001jcSCAQ":"Sales Strategy",
		"00530000008B7WbAAK":"Quentin Engineer",
		"00530000008B7WPAA0":"Jason Brennaman",
		"00530000008B7WuAAK":"Tim Support*",
		"00530000008B7WiAAK":"Vanessa Central",
		"00530000008B7WaAAK":"Ricky East",
		"00530000008B7WdAAK":"Wendy West",
		"0F9300000001jcTCAQ":"Product Experts",
		"00530000008L9njAAC":"Henry Liu",
		"00530000008B7WTAA0":"Bill West",
		"00530000008B7WRAA0":"Elliot Executive"
		};
	return JSON.stringify(idToName);
};

angular.module("graphapp").factory('salesforceconnections',function($http){
    // Public API here
    return {
		getUserIdToSubscriberIds: function (){
			return $http({
				url: '/UserIdToSubscriberIds',
				method: 'GET'
			})
		},
		getChatterGroupIdToSubscriberIds: function (){
			return $http({
				url: '/ChatterGroupIdToSubscriberIds',
				method: 'GET'
			})
		},
		getUserIdToChatterGroupIds: function (){
			return $http({
				url: '/UserIdToChatterGroupIds',
				method: 'GET'
			})
		},
		getIdToName: function (){
			return $http({
				url: '/IdToName',
				method: 'GET'
			})
		},
		getOauthObject: function(){
			return $http({
				url: '/oauth',
				method: 'GET'
			});
		},
		
		getSourceUsers : function(){ //go to node server and get users passed from parameters
			$http({
				url: '/sourceUserId',
				method: 'GET'
			}).success(function(data,status,headers,config){
				return data;
			}).error(function(data,status,headers,config){
				console.log('ERROR: at get sourceUserId');
				return null;
			});
		},
		getTargetUsers : function(){ //go to node server and get users passed from parameters
			$http({
				url: '/targetUserId',
				method: 'GET'
			}).success(function(data,status,headers,config){
				return data;
			}).error(function(data,status,headers,config){
				console.log('ERROR: at get targetUserId');
				return null;
			});
		}
	}
});


/********* for debugging *********/
angular.module("debug").factory('salesforceconnections',function($http){
    // Public API here
    return {
		getUserIdToSubscriberIds: function (){
			return $http({
				url: '/UserIdToSubscriberIds',
				method: 'GET'
			})
		},
		getChatterGroupIdToSubscriberIds: function (){
			return $http({
				url: '/ChatterGroupIdToSubscriberIds',
				method: 'GET'
			})
		},
		getUserIdToChatterGroupIds: function (){
			return $http({
				url: '/UserIdToChatterGroupIds',
				method: 'GET'
			})
		},
		getIdToName: function (){
			return $http({
				url: '/IdToName',
				method: 'GET'
			})
		}
	}
});
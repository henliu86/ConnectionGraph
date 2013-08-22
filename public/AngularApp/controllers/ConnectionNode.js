/********
* Own custom Node that stores necessary info to build the Connection Graph
*********/

//constructor
function ConnectionNode(usrId,connNodes)
{
	this.userId = usrId;
	if(connNodes == undefined)
		this.following = [];
	else
		this.following = connNodes;
	this.numberOfHop;
	this.toDesiredNode = new Array();
    this.isChatterGroup = (this.userId.substring(0,3) == '0F9') ? true : false;
}

//functions
ConnectionNode.prototype = {
	addFollowing : function(newNode)
	{
		this.following.push(newNode);
	},
	print : function()
	{
		console.log( 'userId:' + this.userId + ' following:' + this.following + ' numberOfHop:' + this.numberOfHop + ' toDesiredNode' + this.toDesiredNode + ' isChatterGroup:'+ this.isChatterGroup);
	} 
}                   


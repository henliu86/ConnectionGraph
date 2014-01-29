ConnectionGraph
===============

####1. Create a Canvas App in Visualforce page
```html
<apex:page showHeader="false" controller="GraphMyFollowerCtrl">
    <apex:canvasApp developerName="Graph_Connection" 
    				applicationName="Graph Connections" 
    				maxWidth="750" 
    				scrolling="true"
    				parameters="{'sourceUserId':'{!myUserId}','targetUserId':'{!currentFocusUserId}'}"/>
</apex:page>
```

####2. With the following controller
```java
public class GraphMyFollowerCtrl
{
    public String myUserId {get;set;}
    public String currentFocusUserId {get;set;}
    public GraphMyFollowerCtrl()
    {
        myUserId = UserInfo.getUserId();
        currentFocusUserId = ApexPages.currentPage().getParameters().get('sfdc.userId');
        //this is so we get id with last 3 characters
        currentFocusUserId = [select id from user where id = :currentFocusUserId limit 1].id;
    }
}
```

###3. Create Connected App in Salesforce

- **Connected App Name:** Graph Connection
- **API Name:** Graph_Connection
- **Enable OAuth Setting:** true
- **Callback URL:** https://damp-castle-2728.herokuapp.com/oauth/callback?
- **Selected OAuth Scopes:** all
- **Force.com Canvas:** true
- **Canvas App URL:** https://damp-castle-2728.herokuapp.com
- **Access Method:** Signed Request (POST)
- **Locations:** [Chatter Tab,Visualforce Page]


###4. Add to Subtab
Setup->Create->Apps->Subtab for others-> add "Graph User Connections"

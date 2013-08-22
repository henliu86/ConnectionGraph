angular.module("debug").directive("enter",function(){
	return function(scope,element,attrs){
		console.log('debug directive');
		element.bind("mouseenter",function(){
			element.addClass(attrs.enter);
			scope.$apply("mouseEntered()");
		});
		element.bind("mouseleave",function(){
			element.removeClass(attrs.enter);
			scope.$apply("mouseLeaved()");
		});

		//add css to debug
		element.addClass("panel");
	}
});
angular.module("debug").directive("mydebugjson",function(){
	return {
		restrict: "A",
		controller: "debugCtrl",
		link: function(scope,element){
			//console.log(scope.userIdToSubscriberIds);
		}
	}
});
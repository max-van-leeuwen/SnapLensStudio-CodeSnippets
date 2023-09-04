// Max van Leeuwen
// twitter      @maksvanleeuwen
// instagram    @max.van.leeuwen
// maxvanleeuwen.com
//
// Smooth following SceneObjects or Numbers.



// Example showing all properties
//
//		var follower = new SmoothFollow()				Create instance
//		follower.smoothing								Property, determines how smoothly it follows! The lower, the more instant (0 is instant), default is 1
//
// 	-> SceneObjects
//		follower.follow = sceneObjectToFollow			SceneObject to follow
//		follower.apply = sceneObjectToApplyTo			SceneObject to apply the following to
//		follower.start()
//		follower.stop()
//
// 		Optional properties
//			follower.doInstant							Function, jump without smoothing to the target on this frame
//			follower.rotation = true					Follow rotation, default is true
//			follower.scale = true						Follow scale, default is true
//			follower.translation = true					Follow position, default is true
//			follower.translationX = true				Follow position X, default is true
//			follower.translationY = true				Follow position Y, default is true
//			follower.translationZ = true				Follow position Z, default is true
//
//
// 	-> Numbers
//		follower.addValue								Function, 1st argument is the new value to interpolate to (Number), and 2nd arguement is an optional bool 'instant', to discard smoothing for this specific value
//		follower.getValue								Function, returns the current value
//		follower.onValueChange							Bind to this function to get a callback every time the value has changed during interpolation (the 1st argument is the current value), the update event stops when very close to the target number



//@ui {"widget":"label", "label":"Simple smooth-following setup,"}
//@ui {"widget":"label", "label":"works with SceneObjects (transforms) and Numbers"}
//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"Open this script for more info!"}
//@ui {"widget":"label", "label":"by Max van Leeuwen"}



global.SmoothFollow = function(){

	// placeholders
	var self = this;
	var followingEvent;

	/**
	 * @type {SceneObject}
	 * @description Property, determines how smoothly it follows! The lower, the more instant (0 is instant), default is 1
	*/
	this.smoothing = 1;




	// --- 3D Transform following

	/**
	 * @type {Function}
	 * @description Jump without smoothing to the target on this frame
	*/
	this.doInstant = doInstant;

	/**
	 * @type {SceneObject}
	 * @description SceneObject to follow
	*/
	this.follow = null;

	/**
	 * @type {SceneObject}
	 * @description SceneObject to apply the following to
	*/
	this.apply = null;

	/**
	 * @type {Bool}
	 * @description Follow position, default is true
	*/
	this.translation = true;

	/**
	 * @type {Bool}
	 * @description Follow position X, default is true
	*/
	this.translationX = true;

	/**
	 * @type {Bool}
	 * @description Follow position Y, default is true
	*/
	this.translationY = true;

	/**
	 * @type {Bool}
	 * @description Follow position Z, default is true
	*/
	this.translationZ = true;

	/**
	 * @type {Bool}
	 * @description Follow rotation, default is true
	*/
	this.rotation = true;

	/**
	 * @type {Bool}
	 * @description Follow scale, default is true
	*/
	this.scale = true;


	// placeholders
	var followTrf;
	var applyTrf;

	
	function init(){
		followTrf = self.follow.getTransform();
		applyTrf = self.apply.getTransform();
	}

	this.start = function(){
		// stop previous, if any
		self.stop();
		init();
	
		followingEvent = script.createEvent("UpdateEvent");
		followingEvent.bind(following);
	}

	function doInstant(){
		init();
		if(self.translation){
			var p1 = applyTrf.getWorldPosition();
			var p2 = followTrf.getWorldPosition();
			if(!self.translationX) p2.x = p1.x;
			if(!self.translationY) p2.y = p1.y;
			if(!self.translationZ) p2.z = p1.z;
			applyTrf.setWorldPosition(p2);
		}
		if(self.rotation) applyTrf.setWorldRotation(followTrf.getWorldRotation());
		if(self.scale) applyTrf.setWorldScale(followTrf.getWorldScale());
	}

	// following event on update
	function following(){
		// delta
		var d = clamp(getDeltaTime() / self.smoothing);

		if(self.translation){
			var p1 = applyTrf.getWorldPosition();
			var p2 = followTrf.getWorldPosition();
			if(!self.translationX) p2.x = p1.x;
			if(!self.translationY) p2.y = p1.y;
			if(!self.translationZ) p2.z = p1.z;
			var newPos = vec3.lerp(p1, p2, d);
			applyTrf.setWorldPosition(newPos);
		}
		if(self.rotation){
			var p1 = applyTrf.getWorldRotation();
			var p2 = followTrf.getWorldRotation();
			var newRot = quat.slerp(p1, p2, d);
			applyTrf.setWorldRotation(newRot);
		}
		if(self.scale){
			var p1 = applyTrf.getWorldScale();
			var p2 = followTrf.getWorldScale();
			var newScale = vec3.lerp(p1, p2, d);
			applyTrf.setWorldScale(newScale);
		}
	}

	this.stop = function(){
		if(followingEvent){
			script.removeEvent(followingEvent);
			followingEvent = null;
		}
	}




	// -- Number following

	/**
	 * @type {Number}
	 * @description Function, 1st argument is the new value to interpolate to (Number), and 2nd arguement is an optional bool 'instant', to discard smoothing for this specific value
	*/
	this.addValue = addValue;

	/**
	 * @type {Function}
	 * @description Function, returns the current value
	*/
	this.getValue = getValue;

	/**
	 * @type {Function}
	 * @description Bind to this function to get a callback every time the value has changed during interpolation (the 1st argument is the current value), the update event stops when very close to the target number
	*/
	this.onValueChange = function(value){};

	// number following
	var numberValue;
	var nextValue;

	function addValue(v, instant){
		stopFollowing();
		nextValue = v;
		if(instant){
			numberValue = v;
		}else{
			followingEvent = script.createEvent("UpdateEvent");
			followingEvent.bind(numberFollowing);
		}
	}

	function getValue(){
		return numberValue;
	}

	function stopFollowing(){
		if(followingEvent){
			script.removeEvent(followingEvent);
			followingEvent = null;
		}
	}

	var EPS = 0.001; // small threshold to stop update event at
	function numberFollowing(){
		var d = clamp(getDeltaTime() / self.smoothing);
		if(numberValue == null){
			numberValue = nextValue;
		}else{
			numberValue = lerp(numberValue, nextValue, d);
		}
		if(Math.abs(nextValue - numberValue) < EPS){
			numberValue = nextValue;
			stopFollowing();
		}
		self.onValueChange(numberValue);
	}
}



// clamp to [0, 1]
function clamp(value){
	return Math.max(Math.min(value, Math.max(0, 1)), Math.min(0, 1));
}



// linear lerp
function lerp(a, b, d){
	return a + (b-a)*d;
}
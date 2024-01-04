// Max van Leeuwen
// twitter      @maksvanleeuwen
// instagram    @max.van.leeuwen
// maxvanleeuwen.com
//
// Smooth following SceneObjects or custom values (Number, vec2, vec3).



// How to use:
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
// 	-> Custom value
//		follower.addValue								Function, 1st argument is the new value to interpolate to (Number, vec2, or vec3), and 2nd arguement is an optional bool 'instant', to discard smoothing for this specific value
//		follower.getValue								Function, returns the current value
//		follower.onValueChange							Bind to this function to get a callback every time the value has changed during interpolation (the 1st argument is the current value), the update event stops when very close to the target number
// 		follower.firstValueInstant						Make the first added value instant. Default is false.
// 		follower.EPS									The distance to the target value at which it is considered 'close enough', and the animation ends (and snaps to this target value). Default is 0.001.



// Example:
//
//	var follower = new SmoothFollow()
//	follower.onValueChange = function(v){ screenTransform.anchors.setCenter(v) }
//
//	function updateEvent(){
//		follower.addValue( newScreenTransformPosition );
//	}






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




	// -- Custom following

	/**
	 * @type {Function}
	 * @description Function, 1st argument is the new value to interpolate to (Number, vec2 or vec3), and 2nd arguement is an optional bool 'instant', to discard smoothing for this specific value
	*/
	this.addValue = addValue;

	/**
	 * @type {Function}
	 * @description Function, returns the current value
	*/
	this.getValue = getValue;

	/**
	 * @type {Function}
	 * @description Bind to this function to get a callback every time the value has changed during interpolation (the 1st argument is the current value), the update event stops when very close to the target value
	*/
	this.onValueChange = function(value){};

	/**
	 * @type {bool}
	 * @description Make the first added value instant. Default is false.
	*/
	this.firstValueInstant = false;

	/**
	 * @type {Number}
	 * @description The distance to the target value at which it is considered 'close enough', and the animation ends (and snaps to this target value). Default is 0.001.
	*/
	this.EPS = 0.001;


	// placeholders
	var customValue;
	var nextValue;
	var dataType;
	var firstValue = true;

	function addValue(v, instant){
		// prepare if first value instant
		if(firstValue){
			firstValue = false;
			if(self.firstValueInstant) instant = true;
		}

		// get the kind of data (Number, vec2 or vec3)
		if(!dataType) dataType = getDataType(v);

		// apply new value
		stopFollowing();
		nextValue = v;

		// instant
		if(instant){
			customValue = v;
		}else{
			followingEvent = script.createEvent("UpdateEvent");
			followingEvent.bind(customFollowing);
		}
	}

	function getValue(){
		return customValue;
	}

	function stopFollowing(){
		if(followingEvent){
			script.removeEvent(followingEvent);
			followingEvent = null;
		}
	}

	function customFollowing(){
		var d = clamp(getDeltaTime() / self.smoothing);
		if(customValue == null){
			customValue = nextValue;
		}else{
			switch(dataType){
				case 'Number':
					customValue = lerp(customValue, nextValue, d);
					break;
				case 'vec2':
					customValue = vec2.lerp(customValue, nextValue, d);
					break;
				case 'vec3':
					customValue = vec3.lerp(customValue, nextValue, d);
					break;
			}
		}

		// stop when close
		switch(dataType){
			case 'Number':
				if(Math.abs(nextValue - customValue) < self.EPS){
					customValue = nextValue;
					stopFollowing();
				}
				break;
			default: // vec2 and vec3
				if(nextValue.distance(customValue) < self.EPS){
					customValue = nextValue;
					stopFollowing();
				}
				break;
		}

		// custom callback
		self.onValueChange(customValue);
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



// returns whether this is a number, vec2, or vec3
function getDataType(x){
	if(typeof x == 'number'){
		return 'Number';
	}else{ // assume vec2 or vec3
		if(x.z == undefined){
			return 'vec2';
		}else{
			return 'vec3';
		}
	}
}
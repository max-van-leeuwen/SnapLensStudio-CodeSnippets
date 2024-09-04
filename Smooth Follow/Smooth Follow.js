// Max van Leeuwen
//  maxvanleeuwen.com



// Requires LSQuickScripts 2.30
if(!global.lsqs) throw("LSQuickScripts is missing! Install it from maxvanleeuwen.com/lsquickscripts");



//@ui {"widget":"label"}
//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"<big><b>Smooth Follow</b> <small>by Max van Leeuwen"}
//@ui {"widget":"label", "label":"Smoothly follow SceneObjects, or blur"}
//@ui {"widget":"label", "label":"continuous values (number, vec2, vec3, quat)!"}
//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"Requires LSQuickScripts"}
//@ui {"widget":"separator"}

//@ui {"widget":"label"}
//@ui {"widget":"group_start", "label":"<b>Usage"}
    //@ui {"widget":"label", "label":"<small>creating an instance"}
    //@ui {"widget":"label", "label":"<font color='#56b1fc'>new SmoothFollow()"}
    //@ui {"widget":"label", "label":"<font color='#56b1fc'>.smoothing </font><i><small>= 1"}
    //@ui {"widget":"label"}
    //@ui {"widget":"label", "label":"<small>following a SceneObject"}
    //@ui {"widget":"label", "label":" • <font color='#56b1fc'>.follow </font><i><small>= SceneObject to take motion from"}
    //@ui {"widget":"label", "label":" • <font color='#56b1fc'>.apply </font><i><small>= SceneObject to apply motion to"}
    //@ui {"widget":"label", "label":" • <font color='#56b1fc'>.start()"}
    //@ui {"widget":"label", "label":" • <font color='#56b1fc'>.stop()"}
    //@ui {"widget":"label", "label":" • <font color='#56b1fc'>.doInstant() </font><i><small>jump once"}
    //@ui {"widget":"label", "label":" • <font color='#56b1fc'>.rotation </font><i><small>= true"}
    //@ui {"widget":"label", "label":" • <font color='#56b1fc'>.scale </font><i><small>= true"}
    //@ui {"widget":"label", "label":" • <font color='#56b1fc'>.translation </font><i><small>= true"}
    //@ui {"widget":"label", "label":" • <font color='#56b1fc'>.translationX </font><i><small>= true"}
    //@ui {"widget":"label", "label":" • <font color='#56b1fc'>.translationY </font><i><small>= true"}
    //@ui {"widget":"label", "label":" • <font color='#56b1fc'>.translationZ </font><i><small>= true"}
    //@ui {"widget":"label"}
	//@ui {"widget":"label", "label":"<small>alternatively, follow a custom value"}
	//@ui {"widget":"label", "label":" • <font color='#56b1fc'>.addValue(</font>v, *instant<font color='#56b1fc'>)</font><i><small> smoothly move towards v"}
	//@ui {"widget":"label", "label":" • <font color='#56b1fc'>.getValue() </font><i><small>returns current value"}
	//@ui {"widget":"label", "label":" • <font color='#56b1fc'>.EPS </font><i><small>= .001"}
    //@ui {"widget":"label"}
    //@ui {"widget":"label", "label":"<small>callbacks, bind using <font color='#56b1fc'><i>.add(</font><i>f<font color='#56b1fc'>)</i></font> and <font color='#56b1fc'><i>.remove(</font><i>f<font color='#56b1fc'>)</i></font>"}
	//@ui {"widget":"label", "label":" • <font color='#56b1fc'>.onUpdate </font><i><small>called on each smoothing frame"}
//@ui {"widget":"group_end"}

//@ui {"widget":"label"}
//@ui {"widget":"group_start", "label":"<b>Examples"}
    //@ui {"widget":"label", "label":"<small><font color='#4cad50'>// - following a SceneObject's transform"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>var follower = new SmoothFollow()"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>follower.smoothing = .3"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>follower.follow = script.toFollow <font color='#4cad50'>// SceneObject"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>follower.apply = script.toApply <font color='#4cad50'>// SceneObject"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>follower.start()"}
    //@ui {"widget":"label"}
	//@ui {"widget":"label", "label":"<small><font color='#4cad50'>// - smoothing 'handPos' (vec2)"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>var follower = new SmoothFollow()"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>follower.smoothing = .3"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>follower.onUpdate.add(function(smoothHandPos){"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'><p>&nbsp;&nbsp;&nbsp;&nbsp;print(smoothHandPos) <font color='#4cad50'>// print smooth value"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>}"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>follower.addValue(handPos) <font color='#4cad50'>// call on each frame"}
//@ui {"widget":"group_end"}
//@ui {"widget":"label"}



global.SmoothFollow = function(){
	// placeholders
	var self = this;
	var followingEvent;

	/**
	 * @type {number}
	 * @description following smoothness.
	 * 0 = no smoothing, default is 1
	*/
	this.smoothing = 1;



	// --- Transform following

	/**
	 * @description jump transform once without smoothing to the target
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
	 * @type {boolean}
	 * @description follow transform's position, default is true
	*/
	this.translation = true;

	/**
	 * @type {boolean}
	 * @description follow transform's position X (if following position), default is true
	*/
	this.translationX = true;

	/**
	 * @type {boolean}
	 * @description follow transform's position Y (if following position), default is true
	*/
	this.translationY = true;

	/**
	 * @type {boolean}
	 * @description follow transform's position Z (if following position), default is true
	*/
	this.translationZ = true;

	/**
	 * @type {boolean}
	 * @description follow transform's rotation, default is true
	*/
	this.rotation = true;

	/**
	 * @type {boolean}
	 * @description follow transform's scale, default is true
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

		// custom callback
		self.onUpdate.callback();
	}

	this.stop = function(){
		if(followingEvent){
			script.removeEvent(followingEvent);
			followingEvent = null;
		}
	}




	// -- Custom value following

	/**
	 * @description add a value
	 * @param {(number|vec2|vec3|quat)} value value to smooth towards (number/vec2/vec3/quat, make sure this is consistent)
	 * @param {boolean} instant (optional) discard smoothing for this frame
	*/
	this.addValue = addValue;

	/**
	 * @description get the current value
	 * @returns {(number|vec2|vec3|quat)} value
	*/
	this.getValue = getValue;

	/**
	 * @description bind to this function (using .add or .remove, see LSQS Callback() for more info) to trigger each frame smoothing was applied.
	 * the callback's returned argument is the current value (if using value following).
	 * the callbacks stop when the value or transform is very close to the target value (< self.EPS).
	*/
	this.onUpdate = new Callback();

	/**
	 * @type {number}
	 * @description the distance to the target value at which it is considered 'close enough', and the animation ends (and snaps to target value).
	 * default is 0.001 (this is distance for vectors and numbers, and quat.angleBetween for quats).
	*/
	this.EPS = 0.001;


	// placeholders
	var customValue;
	var nextValue;
	var dataType;



	function addValue(v, instant){
		// get data type
		if(!dataType) dataType = getDataType(v);

		// apply new value
		stopFollowing();
		nextValue = v;

		// instant
		if(instant){
			customValue = v;
			self.onUpdate.callback(customValue); // instantly apply custom callback
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
				case 'number':
					customValue = interp(customValue, nextValue, d);
					break;
				case 'vec2':
					customValue = vec2.lerp(customValue, nextValue, d);
					break;
				case 'vec3':
					customValue = vec3.lerp(customValue, nextValue, d);
					break;
				case 'quat':
					customValue = quat.slerp(customValue, nextValue, d);
					break;
			}
		}

		// stop when close
		switch(dataType){
			case 'number':
				if(Math.abs(nextValue - customValue) < self.EPS){
					customValue = nextValue;
					stopFollowing();
				}
				break;
			case 'quat':
				if(quat.angleBetween(customValue, nextValue) < self.EPS){
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
		self.onUpdate.callback(customValue);
	}
}



// returns whether this is a number, vec2, vec3 or quat
function getDataType(x){
	if(typeof x == 'number'){
		return 'number';
	}else{ // assume vec2 or vec3
		if(x.z == undefined){
			return 'vec2';
		}else if(x.w == undefined){
			return 'vec3';
		}else{
			return 'quat';
		}
	}
}
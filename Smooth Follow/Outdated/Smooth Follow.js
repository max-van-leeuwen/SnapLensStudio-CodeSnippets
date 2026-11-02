// Max van Leeuwen
//  maxvanleeuwen.com



// Requires LSQuickScripts 2.35
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
    //@ui {"widget":"label", "label":"<font color='#56b1fc'>.useLateUpdate </font><i><small>= false"}
    //@ui {"widget":"label"}
    //@ui {"widget":"label", "label":"<small>following a SceneObject"}
    //@ui {"widget":"label", "label":" • <font color='#56b1fc'>.target </font><i><small>= SceneObject to take motion from"}
    //@ui {"widget":"label", "label":" • <font color='#56b1fc'>.follow </font><i><small>= SceneObject to apply motion to"}
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
    //@ui {"widget":"label"}
    //@ui {"widget":"label", "label":"<small><font color='#4cad50'>// - following a SceneObject's transform"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>var follower = new SmoothFollow()"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>follower.target = script.toFollow <font color='#4cad50'>// SceneObject"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>follower.follow = script.toApply <font color='#4cad50'>// SceneObject"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>follower.start()"}
    //@ui {"widget":"label"}
    //@ui {"widget":"label"}
	//@ui {"widget":"label", "label":"<small><font color='#4cad50'>// - smoothing 'handPos' (vec2)"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>var follower = new SmoothFollow()"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>follower.smoothing = .3"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>follower.useLateUpdate = true <font color='#4cad50'>// callback event"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>follower.onUpdate.add(function(smoothHandPos){"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'><p>&nbsp;&nbsp;&nbsp;&nbsp;print(smoothHandPos) <font color='#4cad50'>// print on each frame"}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>}"}
    //@ui {"widget":"label", "label":""}
    //@ui {"widget":"label", "label":"<small><font color='#ffd059'>follower.addValue(handPos) <font color='#4cad50'>// call on each frame"}
//@ui {"widget":"group_end"}
//@ui {"widget":"label"}



global.SmoothFollow = function(){
	// placeholders
	var self = this;
	var followingEvent;

	/**
	 * @type {number}
	 * @description filtering the input.
	 * 0 = no filtering, default is 1.
	*/
	this.smoothing = 1;

    /**
	 * @description use LateUpdateEvent instead of UpdateEvent.
	*/
	this.useLateUpdate = false;



	// --- Transform following

	/**
	 * @type {SceneObject}
	 * @description SceneObject to follow.
	*/
	this.target = null;

	/**
	 * @type {SceneObject}
	 * @description SceneObject to apply the following to.
	*/
	this.follow = null;

	/**
	 * @type {boolean}
	 * @description follow transform's position.
     * default is true.
	*/
	this.translation = true;

	/**
	 * @type {boolean}
	 * @description follow transform's position X (if following position).
     * default is true.
	*/
	this.translationX = true;

	/**
	 * @type {boolean}
	 * @description follow transform's position Y (if following position).
     * default is true.
	*/
	this.translationY = true;

	/**
	 * @type {boolean}
	 * @description follow transform's position Z (if following position).
     * default is true.
	*/
	this.translationZ = true;

	/**
	 * @type {boolean}
	 * @description follow transform's rotation.
     * default is true.
	*/
	this.rotation = true;

	/**
	 * @type {boolean}
	 * @description follow transform's scale.
     * default is true.
	*/
	this.scale = true;


	this.start = function(){
		// stop previous, if any
		self.stop();
	
		followingEvent = script.createEvent(self.useLateUpdate ? "LateUpdateEvent" : "UpdateEvent");
		followingEvent.bind(following);
	}

    /**
	 * @description jump transform to target immediately without smoothing.
	*/
	this.doInstant = function doInstant(){
		if(self.translation){
			var targetPos = self.target.getTransform().getWorldPosition();
			var followPos = self.follow.getTransform().getWorldPosition();
			if(self.translationX) followPos.x = targetPos.x;
			if(self.translationY) followPos.y = targetPos.y;
			if(self.translationZ) followPos.z = targetPos.z;
			self.follow.getTransform().setWorldPosition(followPos);
		}
		if(self.rotation) self.follow.getTransform().setWorldRotation(self.target.getTransform().getWorldRotation());
		if(self.scale) self.follow.getTransform().setWorldScale(self.target.getTransform().getWorldScale());
	}

	this.stop = function(){
		if(followingEvent){
			script.removeEvent(followingEvent);
			followingEvent = null;
		}
	}


	// following event on update
	function following(){
        const alpha = self.smoothing == 0 ? 1 : 1 - Math.exp(-getDeltaTime() / self.smoothing);

        // position
		if(self.translation){
            const currentPos = self.follow.getTransform().getWorldPosition();
            const targetPos = self.target.getTransform().getWorldPosition();
            var axisTargetPos = new vec3(currentPos.x, currentPos.y, currentPos.z);
            if(self.translationX) axisTargetPos.x = targetPos.x; // constraints
            if(self.translationY) axisTargetPos.y = targetPos.y;
            if(self.translationZ) axisTargetPos.z = targetPos.z;

            // filtering
            var filteredPos = alpha == 1 ? axisTargetPos : vec3.lerp(currentPos, axisTargetPos, alpha);

            self.follow.getTransform().setWorldPosition(filteredPos);
		}

        // rotation
		if(self.rotation){
            const currentRot = self.follow.getTransform().getWorldRotation();
            const targetRot = self.target.getTransform().getWorldRotation();
            const nextRot = quat.slerp(currentRot, targetRot, alpha);
            self.follow.getTransform().setWorldRotation(nextRot);
		}

        // scale
		if(self.scale){
            const currentScale = self.follow.getTransform().getWorldScale();
            const targetScale = self.target.getTransform().getWorldScale();
            const nextScale = vec3.lerp(currentScale, targetScale, alpha);
            self.follow.getTransform().setWorldScale(nextScale);
		}

		// custom callback
		self.onUpdate.callback();
	}



	// -- Custom value following

	/**
	 * @description add a value
	 * @param {(number|vec2|vec3|quat)} value value to smooth towards (number/vec2/vec3/quat, make sure this is consistent)
	 * @param {boolean} instant (optional) discard smoothing on this frame
	*/
	this.addValue = addValue;

	/**
	 * @description get the current value
	 * @returns {(number|vec2|vec3|quat)} value
	*/
	this.getValue = getValue;

	/**
	 * @description bind to this function (using .add or .remove, see LSQuickScripts Callback()). triggers on each smoothed frame.
	 * callback argument: current value.
	 * the callbacks stop when the value or transform is very close to the target.
	*/
	this.onUpdate = new Callback();

	/**
	 * @type {number}
	 * @description the distance to the target value at which it is considered 'close enough' and the smoothing automatically stops (and snaps to target).
	 * default is 0.001 (this is a distance for vectors and numbers, and an angle (rad) between quats ).
	*/
	this.EPS = 0.001;


	// store
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
			followingEvent = script.createEvent(self.useLateUpdate ? "LateUpdateEvent" : "UpdateEvent");
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
        const alpha = self.smoothing == 0 ? 1 : 1 - Math.exp(-getDeltaTime() / self.smoothing);

		if(customValue == null){
			customValue = nextValue;
		}else{
			switch(dataType){
				case 'number':
					customValue = alpha==1 ? nextValue : interp(customValue, nextValue, alpha);
					break;
				case 'vec2':
					customValue = alpha==1 ? nextValue : vec2.lerp(customValue, nextValue, alpha);
					break;
				case 'vec3':
					customValue = alpha==1 ? nextValue : vec3.lerp(customValue, nextValue, alpha);
					break;
				case 'quat':
					customValue = alpha==1 ? nextValue : quat.slerp(customValue, nextValue, alpha);
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
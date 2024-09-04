// Max van Leeuwen
//  maxvanleeuwen.com



// Requires LSQuickScripts 2.30
if(!global.lsqs) throw("LSQuickScripts is missing! Install it from maxvanleeuwen.com/lsquickscripts");



//@ui {"widget":"label"}
//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"<big><b>World Placement</b> <small>by Max van Leeuwen"}
//@ui {"widget":"label", "label":"Easily place a scene in front of the user!"}
//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"Requires LSQuickScripts"}
//@ui {"widget":"separator"}

//@ui {"widget":"label"}
//@ui {"widget":"group_start", "label":"<b>Usage"}
	//@ui {"widget":"label"}
	//@ui {"widget":"label", "label":"Use <font color='#56b1fc'>new WorldPlacement(</font><small>moveObject</small><font color='#56b1fc'>)"}
	//@ui {"widget":"label"}
    //@ui {"widget":"label", "label":"<b>Animating once"}
	//@ui {"widget":"label", "label":"• <font color='#56b1fc'>.start(</font><small>doInstant</small><font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getFinalTransformData()</font><small> → {pos, rot}"}
	//@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onAnimatonStep </font><small><i>bind using <font color='#56b1fc'>.add(</font>f<font color='#56b1fc'>)</font> and <font color='#56b1fc'>.remove(</font>f<font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onEnd </font><small><i>bind using <font color='#56b1fc'>.add(</font>f<font color='#56b1fc'>)</font> and <font color='#56b1fc'>.remove(</font>f<font color='#56b1fc'>)"}
	//@ui {"widget":"label", "label":"• <font color='#56b1fc'>.rankedPriority</font><small> <i>= 10 (use null to disable)"}

	//@ui {"widget":"label"}
	//@ui {"widget":"label", "label":"<b>Continuous in-your-face following"}
	//@ui {"widget":"label", "label":"<small><font color='orange'>Requires SmoothFollow"}
	//@ui {"widget":"label", "label":"• <font color='#56b1fc'>.smoothing</font><small> <i>= .25"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.startContinuous()"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.stopContinuous()"}

	//@ui {"widget":"label"}
	//@ui {"widget":"label", "label":"<b>Overall Parameters"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.moveObject</font> <small><i>SceneObject"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.cameraObject</font> <small><i>Component.Camera"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.distanceFromCamera</font><small> <i>= 100"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.height</font><small> <i>= -30"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.rotation</font><small> <i>= true"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.duration</font><small> <i>= .4"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.spherical</font><small> <i>= false"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.lookAt</font><small> <i>= false"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.easeFunction</font><small> <i>= EaseFunctions.Cubic.InOut"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.process</font><small> <i>= function(data){}"}
//@ui {"widget":"group_end"}
//@ui {"widget":"label"}
//@ui {"widget":"separator"}

//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"<b>Overall Parameter Defaults"}
//@input Component.Camera defaultCameraObject
//@input float defaultDistanceFromCamera = 100
//@input float defaultHeight = -30
//@input float defaultDuration = .4
//@input bool defaultSpherical = false
//@ui {"widget":"label"}



// action priority settings
const rankedLabel = 'interactables'; // the priority pool name (should be same for other interactables)



global.WorldPlacement = function(moveObject){
	var self = this;

	/**
	 * @description Starts the animation. If first argument is true, the animation will be skipped and placement will be instant. */
	this.start = function(doInstant){
		if(self.rankedPriority==null){
			start(doInstant);
		}else{
			rankedAction(rankedLabel, self.rankedPriority, ()=>start(doInstant) ); // rankedAction makes sure other interactables are prioritized correctly
		}
	}
	
	/**
	 * @description Gets the final transform information, an object containing 'pos' (vec3) and 'rot' (quat). */
	this.getFinalTransformData = getFinalTransformData;

	/**
	 * @description Callback called on every animation frame, with first argument 0-1 linear normalized time. */
	this.onAnimatonStep = new Callback();
	
	/**
	 * @description Function to call on animation end. */
	this.onEnd = new Callback();

	/**
	 * @type {number}
	 * @description If using LSQuickScripts' Ranked Priority system, this is the assigned priority (pool: 'interactables'). Use null to disable. Default is 10. */
	this.rankedPriority = 10;

	/**
	 * @type {number}
	 * @description Continuous movement smoothing. Default is 0.25. */
	this.smoothing = .25;

	/**
	 * @description Starts continuously following. */
	this.startContinuous = startContinuous;

	/**
	 * @description Stops continuously following. */
	this.stopContinuous = clearSmoothFollowing;

	/**
	 * @type {SceneObject}
	 * @description The SceneObject to move to the user's visible space. */
	this.moveObject = moveObject;

	/**
	 * @type {Component.Camera}
	 * @description The SceneObject of the camera to move the object to. */
	this.cameraObject = script.defaultCameraObject;

	/**
	 * @type {number}
	 * @description Distance from camera (world units, cm). Default is 100. */
	this.distanceFromCamera = script.defaultDistanceFromCamera;

	/**
	 * @type {number}
	 * @description Height offset from eye-height (world units, cm). Default is -30. */
	this.height = script.defaultHeight;

	/**
	 * @type {boolean}
	 * @description Animate rotation. Default is true. */
	this.rotation = true;

	/**
	 * @type {number}
	 * @description Length of animation (s). Default is 0.4. */
	this.duration = script.defaultDuration;

    /**
	 * @type {boolean}
	 * @description Places world at look-at position, instead of just in front of user at eye-height. Default is false. */
	this.spherical = script.defaultSpherical;

	/**
	 * @type {boolean}
	 * @description Does a true look-at rotation, instead of only around the y-axis. Default is false. */
	this.lookAt = false;

	/**
	 * @type {function}
	 * @description Animation curve. Use EaseFunctions, or a custom callback. */
	this.easeFunction = EaseFunctions.Cubic.InOut;

	/**
	 * @type {function}
	 * @description on each getFinalTransformData call, process it using this function first. For example: if you want resulting world positions to always be rounded. */
	this.process = function(data){return data};



	// once



	function getFinalTransformData(){
		// get transformation info
		var camTrf = self.cameraObject.getTransform();
		var camPos = camTrf.getWorldPosition();
		var camFwd = camTrf.forward;
		var cursorPos = camPos.add(camFwd);
		var camPosXZ = new vec3(camPos.x, 0, camPos.z);
		var cursorPosXZ = new vec3(cursorPos.x, 0, cursorPos.z);
		var fwdXZ = camPosXZ.sub(cursorPosXZ).normalize();

		// positioned in front of user at correct height
		var camHeight = new vec3(0, camPos.y, 0);
		var sphericalHeight = 0;
		if(self.spherical) sphericalHeight = -camFwd.uniformScale(self.distanceFromCamera).y;
		var heightOffset = new vec3(0, self.height + sphericalHeight, 0);
		var newPos = camPosXZ.add(fwdXZ.uniformScale(self.distanceFromCamera));
		newPos = newPos.add(heightOffset).add(camHeight);

		// get look-at rotation
		var newRot;
		if(self.lookAt){ // facing user, y-axis only
			newRot = quat.lookAt(camPos.sub(newPos).normalize(), vec3.up());
		}else{
			const angle = Math.atan2(fwdXZ.x, fwdXZ.z);
			newRot = quat.angleAxis(angle + Math.PI, vec3.up());
		}

		const result = self.process({pos:newPos, rot:newRot});
		return result;
	}

	function start(doInstant){
		// get move object transform, if any
		if(self.moveObject) var sceneTrf = self.moveObject.getTransform();

		// get position and rotation to move towards
		const finalTransformData = getFinalTransformData();

		// animate properties
		if(sceneTrf){
			var curPos = sceneTrf.getWorldPosition();
			if(self.rotation) var curRot = sceneTrf.getWorldRotation();
		}

		function animationStep(v, vLinear){
			self.onAnimatonStep.callback(vLinear);

			// apply (if moveObject was given)
			if(sceneTrf){
				var pos = vec3.lerp(curPos, finalTransformData.pos, v);
				sceneTrf.setWorldPosition(pos);
				
				if(self.rotation){
					var rot = quat.slerp(curRot, finalTransformData.rot, v);
					sceneTrf.setWorldRotation(rot);
				}
			}
		}

		if(self.duration === 0 || doInstant){ // instant
			animationStep(1);
			self.onEnd.callback();

		}else{ // start animation
			var anim = new global.AnimateProperty();
			anim.duration = self.duration;
			anim.updateFunction = animationStep;
			anim.easeFunction = self.easeFunction;
			anim.endFunction = self.onEnd.callback;
			anim.start();
		}
	}



	// continuous



	var updateEvent;
	var continuousPos;
	var continuousRot;
	function startContinuous(){
		// Requires Smooth Follow
		if(!global.SmoothFollow) throw("SmoothFollow is missing! Install it from https://github.com/max-van-leeuwen/SnapLensStudio-CodeSnippets/tree/main/Smooth%20Follow");

		// clear previous smooth follow setup
		clearSmoothFollowing();

		// smoothly follow position
		continuousPos = new SmoothFollow();
		continuousPos.smoothing = self.smoothing;
		continuousPos.onUpdate.add(function(){
			const p = continuousPos.getValue(); // get current smoothened position
			self.moveObject.getTransform().setWorldPosition(p); // apply position
		});

		// smoothly follow rotation
		if(self.rotation){
			continuousRot = new SmoothFollow();
			continuousRot.smoothing = self.smoothing;
			continuousRot.onUpdate.add(function(){
				const r = continuousRot.getValue(); // get current smoothened rotation
				self.moveObject.getTransform().setWorldRotation(r); // apply rotation
			});
		}

		// on every frame, give the SmoothFollowers new values to work with
		function frameUpdate(){
			const noSmoothing = self.smoothing==0; // instant if no smoothing
			const finalTransformData = getFinalTransformData();
			continuousPos.addValue(finalTransformData.pos, noSmoothing);
			if(self.rotation) continuousRot.addValue(finalTransformData.rot, noSmoothing);
		}
		updateEvent = script.createEvent("UpdateEvent");
		updateEvent.bind(frameUpdate);

		// do first frame already
		const finalTransformData = getFinalTransformData();
		self.moveObject.getTransform().setWorldPosition(finalTransformData.pos);
		if(self.rotation) self.moveObject.getTransform().setWorldRotation(finalTransformData.rot);
	}

	function clearSmoothFollowing(){
		if(updateEvent){
			script.removeEvent(updateEvent);
			updateEvent = null;
		}
		if(continuousPos){
			continuousPos.stop();
			continuousPos = null;
		}
		if(continuousRot){
			continuousRot.stop();
			continuousRot = null;
		}
	}
}
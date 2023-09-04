// Max van Leeuwen
// twitter      @maksvanleeuwen
// instagram    @max.van.leeuwen
// maxvanleeuwen.com
//
// Places and orients a scene in front of the user, handy when using World Tracking.
//
// Requires:
//  LSQuickScripts 2.0+     https://github.com/max-van-leeuwen/SnapLensStudio-CodeSnippets/tree/main/LSQuickScripts



//	To use, make a new instance like so
// 		var worldPlacementAnim = new global.WorldPlacement();
//
//	Then start it with
//		worldPlacementAnim.start();
//
//	To read the final transform information (an object containing the keys 'pos' (vec3), 'rot' (quat)), use
//		worldPlacementAnim.getFinalTransformData();
//
//	This function can be used after start() was called. No moveObject is necessary in this case!



// defaults, used if not overwritten in the new instance of this class
//@input SceneObject cameraObject
//@input SceneObject moveObject
//@input float distanceFromCamera = 100
//@input float height = 0



global.WorldPlacement = function(){
	var self = this;

	/**
	 * @type {SceneObject}
	 * @description The SceneObject of the camera to move the object to. */
	this.cameraObject = script.cameraObject;

	/**
	 * @type {SceneObject}
	 * @description The SceneObject to move to the user's visible space. */
	this.moveObject = script.moveObject;

	/**
	 * @type {Number}
	 * @description Distance from camera (world units, cm). Default is 100. */
	this.distanceFromCamera = script.distanceFromCamera;

	/**
	 * @type {Number}
	 * @description Height offset (world units, cm). Default is 0. */
	this.height = script.height;

	/**
	 * @type {Number}
	 * @description Length of animation (s). Default is 0.5. */
	this.duration = .5;

    /**
	 * @type {Boolean}
	 * @description Places world at look-at position, instead of just in front of user at eye-height. Default is false. */
	this.spherical = false;

    /**
	 * @type {Function}
	 * @description Function to call on animation end. */
	this.callback = function(){};

	/**
	 * @type {String}
	 * @description Animation curve. Use EaseFunctions, or a custom callback. */
	this.easeFunction = EaseFunctions.Cubic.InOut;

    /**
	 * @type {Function}
	 * @description Gets the final transform information - an object containing the keys 'pos' (vec3) and 'rot' (quat). Can only be called once 'start' was called. */
	this.getFinalTransformData = function(){
		return finalTransformData;
	}
	var finalTransformData;



	/**
	 * @type {Function} 
	 * @description Starts the animation. If first argument is true, the animation will be skipped and placement will be instant. */
	this.start = function(doInstant){
		// get transformation info
		var camTrf = self.cameraObject.getTransform();
		if(self.moveObject) var sceneTrf = self.moveObject.getTransform();
	
		var camPos = camTrf.getWorldPosition();
		var camFwd = camTrf.forward;
		var cursorPos = camPos.add(camFwd);
		var camPosXZ = new vec3(camPos.x, 0, camPos.z);
		var cursorPosXZ = new vec3(cursorPos.x, 0, cursorPos.z);
		var fwdXZ = camPosXZ.sub(cursorPosXZ).normalize();
	
		// facing user, y-axis only
		var newRot = quat.angleAxis( Math.atan2(fwdXZ.x, fwdXZ.z) + Math.PI, vec3.up());
	
		// positioned in front of user at correct height
		var camHeight = new vec3(0, camPos.y, 0);
		var sphericalHeight = 0;
		if(self.spherical) sphericalHeight = -camFwd.uniformScale(self.distanceFromCamera).y;
		var heightOffset = new vec3(0, self.height + sphericalHeight, 0);
		var newPos = camPosXZ.add(fwdXZ.uniformScale(self.distanceFromCamera));
		newPos = newPos.add(heightOffset).add(camHeight);
	
		// animate properties
		if(sceneTrf){
			var curPos = sceneTrf.getWorldPosition();
			var curRot = sceneTrf.getWorldRotation();
		}

		finalTransformData = {pos:newPos, rot:newRot};
		
		function animationStep(v){
			// apply (if moveObject was given)
			if(sceneTrf){
				var pos = vec3.lerp(curPos, newPos, v);
				var rot = quat.slerp(curRot, newRot, v);
				sceneTrf.setWorldPosition(pos);
				sceneTrf.setWorldRotation(rot);
			}
		}

		if(self.duration === 0 || doInstant){ // instant
			animationStep(1);

		}else{ // start animation
			var anim = new global.AnimateProperty();
			anim.duration = self.duration;
			anim.updateFunction = animationStep;
			anim.easeFunction = self.easeFunction;
			anim.endFunction = self.callback;
			anim.start();
		}
	}
}
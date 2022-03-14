// Max van Leeuwen
//
// Places and orients a sceneobject in front of the user, handy when using World Tracking.
// Requires LSQuickScripts! Get it at https://github.com/max-van-leeuwen/SnapLensStudio-LSQuickScripts, and place the script somewhere in your project.
//
//
//
// To use, make a new class instance like so
// 	var worldPlacementAnim = new WorldPlacement();
//
// You can customize this instance, for example by changing the duration to 10 seconds (really slow)
//	worldPlacementAnim.duration = 10;
//
// Now, each time you run the following line of code, the scene will be centered towards the user
//	worldPlacementAnim.start();



// defaults
// @input SceneObject cameraObject
// @input SceneObject moveObject



if(!global.AnimateProperty) throw('World Placement needs LSQuickScripts! Get it from\nhttps://github.com/max-van-leeuwen/SnapLensStudio-LSQuickScripts');



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
	this.distanceFromCamera = 100;

	/**
	 * @type {Number}
	 * @description Height offset (world units, cm). Default is 0. */
	this.height = 0;

	/**
	 * @type {Number}
	 * @description Length of animation (s). Default is 0.5. */
	this.duration = .5;

    /**
	 * @type {Boolean}
	 * @description Places world at look-at position, instead of just in front of user at eye-height. Default is 'true'. */
	this.spherical = true;

    /**
	 * @type {Function}
	 * @description Function to call on animation end. */
	this.callback = function(){};

	/**
	 * @type {String}
	 * @description Animation curve. Default is "Cubic".
	 * All possible inputs:
	 * "Linear"
	 * "Quadratic"
	 * "Cubic"
	 * "Quartic"
	 * "Quintic"
	 * "Sinusoidal"
	 * "Exponential"
	 * "Circular"
	 * "Elastic"
	 * "Back"
	 * "Bounce" */
	this.easeFunction = "Cubic";

    /**
	 * @type {String}
	 * @description Determines where curve is applied. Default is "Out".
	 * All possible inputs:
	 * "In"
	 * "Out"
	 * "InOut" */
	this.easeType = "Out";



	/**
	 * @type {Function} 
	 * @description Starts the animation. */
	this.start = function(){
		// get transformation info
		var camTrf = self.cameraObject.getTransform();
		var sceneTrf = self.moveObject.getTransform();
	
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
		var curPos = sceneTrf.getWorldPosition();
		var curRot = sceneTrf.getWorldRotation();
		
		function animationStep(v){
			// apply
			var pos = vec3.lerp(curPos, newPos, v);
			var rot = quat.slerp(curRot, newRot, v);
			sceneTrf.setWorldPosition(pos);
			sceneTrf.setWorldRotation(rot);
		}

		if(self.duration === 0){ // instant
			animationStep(1);

		}else{ // start animation
			var anim = new global.AnimateProperty();
			anim.duration = self.duration;
			anim.updateFunction = animationStep;
			anim.easeFunction = self.easeFunction;
			anim.easeType = self.easeType;
			anim.endFunction = self.callback;
			anim.start();
		}
	}
}
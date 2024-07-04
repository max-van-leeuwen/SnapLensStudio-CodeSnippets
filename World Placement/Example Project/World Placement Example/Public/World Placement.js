// Max van Leeuwen
//  @maksvanleeuwen
//  links.maxvanleeuwen.com

// World Placement

// Requires LSQuickScripts 2.26
if(!global.lsqs) throw("LSQuickScripts is missing! Install it from maxvanleeuwen.com/lsquickscripts");



//@ui {"widget":"label"}
//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"<big><b>World Placement</b> <small>by Max van Leeuwen"}
//@ui {"widget":"label", "label":"Place and orient a scene in front of the user."}
//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"Requires LSQuickScripts"}
//@ui {"widget":"separator"}

//@ui {"widget":"label"}
//@ui {"widget":"group_start", "label":"<b>Usage"}
	//@ui {"widget":"label"}
    //@ui {"widget":"label", "label":"Use <font color='#56b1fc'>new WorldPlacement(</font><small>moveObject</small><font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.cameraObject</font> <small><i>SceneObject"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.moveObject</font> <small><i>SceneObject"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.distanceFromCamera</font><small> = <i>100"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.height</font><small> = <i>0"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.duration</font><small> = <i>.4"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.spherical</font><small> = <i>false"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.callback </font><small><i>bind using <font color='#56b1fc'>.add(</font>f<font color='#56b1fc'>)</font> and <font color='#56b1fc'>.remove(</font>f<font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.easeFunction</font><small> = <i>EaseFunctions.Cubic.InOut"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.start(</font><small>doInstant</small><font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getFinalTransformData()</font><small> → {pos, rot}, no <font color='#56b1fc'>.moveObject</font> needed"}
//@ui {"widget":"group_end"}
//@ui {"widget":"label"}
//@ui {"widget":"separator"}

//@ui {"widget":"label"}
//@input Component.Camera defaultCam
//@input float defaultHeight = -30
//@input float defaultDistanceFromCamera = 100
//@input float defaultDuration = .4
//@input bool defaultSpherical = false
//@ui {"widget":"label"}



// action priority settings
script.rankedPriority = 10; // priority level for interactions created by this button (only relevant if other action ranking scripts with the same label are used in this project)
const rankedLabel = 'interactables'; // the priority pool name (should be same for other interactables)



global.WorldPlacement = function(moveObject){
	var self = this;

	/**
	 * @type {SceneObject}
	 * @description The SceneObject of the camera to move the object to. */
	this.cameraObject = script.defaultCam;

	/**
	 * @type {SceneObject}
	 * @description The SceneObject to move to the user's visible space. */
	this.moveObject = moveObject;

	/**
	 * @type {Number}
	 * @description Distance from camera (world units, cm). Default is 100. */
	this.distanceFromCamera = script.defaultDistanceFromCamera;

	/**
	 * @type {Number}
	 * @description Height offset from eye-height (world units, cm). Default is -30. */
	this.height = script.defaultHeight;

	/**
	 * @type {Number}
	 * @description Length of animation (s). Default is 0.4. */
	this.duration = script.defaultDuration;

    /**
	 * @type {Boolean}
	 * @description Places world at look-at position, instead of just in front of user at eye-height. Default is false. */
	this.spherical = script.defaultSpherical;

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
		rankedAction(rankedLabel, script.rankedPriority, ()=>start(doInstant) ); // rankedAction makes sure other interactables (if there are any) are prioritized correctly
	}

	function start(doInstant){
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
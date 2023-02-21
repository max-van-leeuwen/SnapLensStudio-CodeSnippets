//@ui {"widget":"label", "label":"LSQuickScripts v1.9"}
//@ui {"widget":"label", "label":"By Max van Leeuwen"}
//@ui {"widget":"label", "label":"-"}
//@ui {"widget":"label", "label":"Place on top of scene ('On Awake')."}
//@ui {"widget":"label", "label":"For more info, open this script or see:"}
//@ui {"widget":"label", "label":"github.com/max-van-leeuwen/SnapLensStudio-LSQuickScripts"}


// Max van Leeuwen
// LSQuickScripts - A cheat sheet of Lens Studio-ready JS stuff I often use.
// 
// maxvanleeuwen.com
// twitter 	@maksvanleeuwen
// ig 		@max.van.leeuwen
//
// github.com/max-van-leeuwen/SnapLensStudio-LSQuickScripts
//
//
//
// CREDITS:
// -------------------
// Snap Inc.
//
// Tween.js - Licensed under the MIT license
// https://github.com/tweenjs/tween.js
// See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
// Thank you all, you're awesome!
// -------------------
//
//
//
//
// 
// ALL FUNCTIONS:
// -------------------
//
//
// global.lsqs : Script Component
//  Returns the Script component this script is on.
//
//
//
// -
//
//
// global.LS_BOX_SCALE : Number
//  Default box mesh scale in Lens Studio.
//
//
//
// -
//
//
// global.interp(startValue [Number], endValue [Number], t [Number], easing (optional) [string], type (optional) [string], unclamped (optional) [bool]) : Number
// 	Returns the value of t interpolated using Tween functions between the start and end values. Set the easing function and type (optional) by string, use the below list as reference.
//	Using only startValue, endValue, and t, is identical to a linear (unclamped) lerp.
// 
// 		Easing:
// 			Linear (default)
// 			Quadratic
// 			Cubic
// 			Quartic
// 			Quintic
// 			Sinusoidal
// 			Exponential
// 			Circular
// 			Elastic
// 			Back
// 			Bounce
//
// 		Type:
// 			InOut (default)
// 			In
// 			Out
//
// 		Examples:
// 			global.interp(0, 1, 0.1, "Elastic", "In");
// 			global.interp(-5, 5, x, "Cubic");
//
//
//
// -
//
//
// global.AnimateProperty() : animateProperty object
// 	Creates an easy-to-use animation 'class' instance. Can be used to easily animate any property in just a couple lines of code!
//
//		All properties:
//			var anim = new global.animateProperty();						// create a new animation instance called 'anim'.
//			anim.startFunction = function(){};								// Function to call on animation start.
//			anim.updateFunction = function(v){ /* your callback here */ };	// Function to call on each animation frame, with animation value (0-1) as its first argument. This range is exclusive for the first step and inclusive for the last step of the animation (for example: when playing in reverse, the range is <1, 0]).
//			anim.endFunction = function(){ /* your callback here */ };		// Function to call on animation end.
//			anim.duration = 1;												// Duration in seconds. Default is 1.
//			anim.reverseDuration = 1;										// Duration in seconds when reversed. If no value assigned, default is equal to duration.
//			anim.delay = 0;													// Delay after starting animation. Default is 0.
//			anim.easeFunction = "Cubic";									// Determines curve. Default is "Cubic", all Tween functions can be used!
//			anim.easeType = "InOut";										// Determines how animation curve is applied. Default is "InOut". All possible inputs: "In", "Out", "InOut".
//			anim.pulse(newTimeRatio);										// Updates the animation once, stops the currently running animation. Sets the time value to newTimeRatio (linear 0-1).
//			anim.getTimeRatio();											// The current linear normalized animation time, 0-1.
//			anim.setReversed(reverse);										// If reversed, the animation plays backwards. The easeType will be swapped if it isn't 'InOut'. 'reverse' should be of type bool.
//			anim.getReversed();												// Returns true if the animation is currently reversed.
//			anim.isPlaying();												// Returns true if the animation is currently playing.
//			anim.start(newTimeRatio); 										// Starts the animation (resumes where last play ended, starts from beginning if last play was finished). Optional 'atTime' argument starts at normalized linear 0-1 time ratio.
//			anim.stop(callEndFunction);										// Stop the animation at its current time. With an optional argument to call the endFunction (argument should be of type bool).
//
//
//
// global.StopAllAnimateProperties() : array
//	Instantly stops all animate property-instances created using 'global.AnimateProperty'. This is useful if you want to create a quick reset function for your lens without managing all the created animations throughout your project.
//
//
//
// -
//
//
// global.degToRad(degrees [Number/vec3]) : Number/vec3
// 	Converts Number or vec3 of degrees to Number or vec3 of radians.
//
//
//
// global.radToDeg(radians [Number/vec3]) : Number/vec3
// 	Converts Number or vec3 of radians to Number or vec3 of degrees.
//
//
//
// -
//
//
// global.isInFront(objFront [SceneObject], objBehind [SceneObject] ) : bool
// 	Checks if objFront is in front of objBehind.
//
//
//
// global.isInBox(object [SceneObject], box [SceneObject]) : bool
// 	Checks if object is within the boundaries of a default Lens Studio box.
//
//
//
// global.planeRay(rayP, rayD, planeP, planeN) : vec3
//	Checks if a line starting at rayP with normalized direction vector rayD, intersects a plane at position planeP with normalized normal planeN. Returns position if it does, returns null otherwise.
//
//
//
// -
//
//
// global.HSVtoRGB(h [Number], s [Number], v [Number]) : vec3
// 	Returns the RGB color for a Hue, Saturation, and Value. All inputs and outputs are in range 0-1.
//
//
//
// global.RGBtoHSV(rgb [vec3/vec4]) : vec3
// 	Returns the Hue, Saturation, and Value values for the specified color. Inputs and outputs are in range 0-1.
//
//
//
// -
//
//
// global.DoDelay( function (Function, optional), arguments (Array, optional) ) : doDelay object
//	An object that makes it easy to schedule a function to run in the future (by frames or by seconds).
//
//		Example, showing all properties:
//			var delayed = new global.doDelay();
//			delayed.func = function(arg){print(arg)}; 		// test function, this will print its first argument
//			delayed.args = ['hello!'];						// arguments should be given as an array
//			delayed.byFrame(10);							// this will print 'hello!' in 10 frames (function is called on the next frame, if no argument given)
//			delayed.byTime(10);								// this will print 'hello!' in 10 seconds
//			delayed.stop();									// this will stop the scheduled function
//
//		One-liner for convenience:
//			new global.doDelay(func, args).byTime(5);		// calls function func with arguments args (array) after 5 seconds
//
//
//
// global.StopAllDelays() : array of delays
//	Instantly stops all delays created using 'global.DoDelay'. This is useful if you want to create a quick reset function for your lens without managing all the created delays throughout your project.
//
//
//
// -
//
//
// global.instSound(audioAsset [Asset.AudioTrackAsset], volume (optional) [Number], fadeInTime (optional) [Number], fadeOutTime (optional) [Number], offset (optional) [Number], mixToSnap (optional) [bool]) : AudioComponent
// 	Plays a sound on a new (temporary) sound component, which allows multiple plays simultaneously without the audio clipping when it restarts.
// 	This function returns the AudioComponent! But be careful, the instance of this component will be removed when done playing
//
//
//
// global.StopAllSoundInstances() : array of sound instances
// 	Instantly stops all sound instances created using 'global.instSound'. This is useful if you want to create a quick reset function for your lens without managing all the created sounds throughout your project.
//
//
//
// -
//
//
// global.instSoundPooled(listOfAssets [List of Asset.AudioTrackAsset], poolSize [Number], waitTime [Number] ) : Object
// 	Create a pool of audio components, one component for each given asset, times the size of the pool (so the total size is listOfAssets.length * poolSize).
//	The 'waitTime', if given, makes sure the next sound instance can only be played after this many seconds, to prevent too many overlaps. Useful, for example, to make a bouncing sound for physics objects.
//	This function does essentially same as 'instSound', except in a much more performant when playing lots of sounds (poolSize determines the amount of overlap allowed before looping back to the start of the pool).
//
//		Example, if you want to randomly pick laser sounds coming from a gun. Note how it has a maximum of 10 plays with 0.2 seconds inbetween, before looping back to the first sound component:
//			var soundPool = new global.instSoundPooled( [script.laserSound1, script.laserSound2, script.laserSound3], 10, 0.2 );
//			function onLaserShoot(){
//				var laserIndex = Math.floor( Math.random() * 3 );
//				soundPool.instance(laserIndex);
//			}
//
//
//
// -
//
//
// global.clamp(value [Number], low [Number] (optional, default 0), high [Number] (optional, default 1)) : Number
// 	Returns the clamped value between the low and high values.
//
//
//
// -
//
//
// global.randSeed(seed [int]) : Number
// 	Returns a random value (0-1) based on an input seed. Uses mulberry32.
//
//
//
// -
//
//
// global.remap(value [Number], low1 [Number], high1 [Number], low2 [Number], high2 [Number], clamp [Bool]) : Number
// 	Returns value remapped from range low1-high1 to range low2-high2.
//
//
// -
//
//
// global.encodeFloat(data [Number], min [Number], max [Number]) : vec4
// 	Equivalent of the 'Pack' node in the material graph editor (32-bits).
//
//
//
// global.decodeToFloat(encoded data [vec4], min [Number], max [Number]) : Number
// 	Equivalent of the 'Unpack' node in the material graph editor (32-bits).
//
//
//
// -
//
//
// global.screenToScrTransform(screenPos [vec2]) : vec2
// 	Returns ScreenTransform anchor center position (range -1 - 1) from screen coordinates (0-1, inversed y-axis).
//	Inverse of global.scrTransformToScreen().
//
//
//
// global.scrTransformToScreen(scrTransfCenter [vec2]) : vec2
// 	Returns screen coordinates (range 0-1) of Screen Transform anchors center.
//	Inverse of global.screenToScrTransform().
//
//
//
// -
//
//
// global.worldMeshClassify() : string
// 	Returns the name of the world mesh classification index.
//
//		Examples:
//			global.worldMeshClassify(2) : "Floor"
//
//
//
// -
//
//
// global.shuffleArray(array [array]) : array
// 	Returns a randomly shuffled copy of the array.
//
//
//
// global.concatArrays(array [any], array [any]) : array
// 	Concatinates two arrays (of same type) and returns the new one.
//
//
//
// -
//
//
// global.MovingAverage() : movingAverage Object
// 	An object that makes it easy to keep track of a moving/rolling average.
//
//		Example, showing all properties:
//			var avg = new global.movingAverage();
//			avg.add(v);									// usually the only thing you need, returns the new average and updates the sampleCount.
//			avg.average;								// gets/sets the current average value (usually read-only, but in some cases you might want to set this to a starting value)
//			avg.sampleCount; 							// gets/sets the current sample count value (usually read-only, but in some cases you might want to set this to a starting value)
//			
//
//
// -
//
//
// global.Stopwatch() : stopwatch Object
// 	Does precise time measuring to see how well a function performs.
// 	Starting and stopping the stopwatch more than once will make it keep track of a moving average! Which is more reliable than measuring just once, as frames in Lens Studio are also dependent on other factors.
//
//		Example, showing all properties:
//			var stopwatch = new global.Stopwatch();		// create new stopwatch object
//			stopwatch.start();							// starts the stopwatch
//			// < do something else on this line >
//			stopwatch.stop();							// stops the stopwatch, prints the results to the console
//
//
// -
//
//
//
// global.setAllChildrenToLayer(sceneObj [sceneObject], layer [LayerSet])
// 	Sets the sceneObject and all of its child objects and sub-child objects to a specific render layer (by LayerSet).
//
//
//
// -
//
//
// global.rotateCoords(point [vec2], pivot [vec2], angle [Number]) : vec2
// 	Rotate a 2D point around a pivot with specified angle (radians). Returns new 2D position.
//
//
//
// -
//
//
// global.circularDistance(a [Number], b [Number], mod [Number]) : Number
// 	Returns the closest distance from a to b if the number line of length mod is a circle. For example: if the mod is 1, the distance between 0.9 and 0.1 is 0.2.
//
//
//
// -
//
//
// global.mod(a [Number], b [Number]) : Number
// 	Modulo (%), but keeps negative numbers into account. For example, mod(-1, 3) returns 2. Whereas -1%3 returns -1.
//
//
//
// -
//
//
// global.measureWorldPos(screenPos [vec2], region [Component.ScreenTransform], cam [Component.Camera], dist [Number]) : vec3
// 	Returns the world position of a [-1 - 1] screen space coordinate, within a screen transform component, at a distance from the camera.
//	Useful, for example, to measure out where to place a 3D model in the Safe Region, so it won't overlap with Snapchat's UI.
//
//
//
// -
//
//
// global.getAllComponents(componentName [string], startObj (optional) [SceneObject]) : Array (Components)
// 	Returns an array containing all components of type componentNames, also those on child objects.
//	If no startObj is given, it searches the whole scene.
//
// 		Example:
//			var component = global.getAllComponents("Component.VFXComponent")
//				components = [ARRAY OF ALL VFX COMPONENTS IN SCENE],
//
//
//
// -
//
//
// global.parseNewLines(txt [string], customSplit (optional) [string]) : String
// 	Takes a string passed in through an input string field containing '\n', and returns the same string but with real newlines (for use in a Text Component, for example).
//	If customSplit is given, it replaces the '\n'-lookup with other character(s).
//
//
//
// -
//
//
// global.median(arr [Array]) : Number
//	Takes an array of Numbers, and returns the median value.
//
//
//
// -
//
//
// global.lookAtUp(posA [vec3], posB [vec3], offset) : quat
//	Takes two positions, returns the look-at rotation for A to look at B with Y axis locked. Useful when objects have to face the user, but they are not allowed to rotate facing up or down.
//	Use the optional 'offset' for a 0 - 2PI rotation offset.
//
//
//
// -
//
//
// global.isInSpectaclesDisplay(pos [vec3], cam [Component.Camera]) : bool
//	Returns true if the world position is visible in the square Spectacles (2021) display. Handy for optimization sometimes.
//
//
//
// -
//
//
// global.mat4FromDescription(matDescription [string]) : mat4
//	Returns a mat4, based on a mat4's string 'description'. Useful when trying to store it in a JSON, for example.
//
//
//
// -
//
//
// global.wrapFunction(originalFunction [Function], newFunction [Function]) : Function
//	Wrap two functions into one.
//
//
//
// -
//
//
// global.VisualizePositions(scale (optional) [Number]) : VisualizePositions object
//	A class that places cubes on each position in the 'positions' array, for quick visualizations.
//
//		Example, showing all properties:
//			var vis = new VisualizePositions();
//			vis.scale;								// (Optional) Set the scale of the cubes (world size, default is 1)
//			vis.continuousRotation;					// (Optional) Make the cubes do a rotate animation (boolean, default is true)
//			vis.material;							// (Optional) set material property of the cubes ([Asset.Material])
//			vis.update([Vec3 Array]);				// places cubes on new array of positions, returns the array of cube SceneObjects if needed!
//			vis.remove();							// clears all created visualization
//
//		One-liner for convenience:
//			var positions = [new vec3(0, 0, 0), new vec3(1, 0, 0)]; 	// make a list of positions
//			new VisualizePositions(10).update(positions); 				// instantly creates boxes of size 10 at those positions
//
//
//
// -------------------




// access
global.lsqs = script;




// box mesh world scale
global.LS_BOX_SCALE = 15.14;




// ---
// Tween functions
// Tween.js - Licensed under the MIT license
// https://github.com/tweenjs/tween.js
// See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.

var easingFunctions = {
	Linear: {
		In: function (k) {
			return k;
		},
		Out: function (k) {
			return k;
		},
		InOut: function (k) {
			return k;
		}
	},
	Quadratic: {
		In: function (k) {
			return k * k;
		},
		Out: function (k) {
			return k * (2 - k);
		},
		InOut: function (k) {
			if ((k *= 2) < 1) {
				return 0.5 * k * k;
			}
			return - 0.5 * (--k * (k - 2) - 1);
		}
	},
	Cubic: {
		In: function (k) {
			return k * k * k;
		},
		Out: function (k) {
			return --k * k * k + 1;
		},
		InOut: function (k) {
			if ((k *= 2) < 1) {
				return 0.5 * k * k * k;
			}
			return 0.5 * ((k -= 2) * k * k + 2);
		}
	},
	Quartic: {
		In: function (k) {
			return k * k * k * k;
		},
		Out: function (k) {
			return 1 - (--k * k * k * k);
		},
		InOut: function (k) {
			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k;
			}
			return - 0.5 * ((k -= 2) * k * k * k - 2);
		}
	},
	Quintic: {
		In: function (k) {
			return k * k * k * k * k;
		},
		Out: function (k) {
			return --k * k * k * k * k + 1;
		},
		InOut: function (k) {
			if ((k *= 2) < 1) {
				return 0.5 * k * k * k * k * k;
			}
			return 0.5 * ((k -= 2) * k * k * k * k + 2);
		}
	},
	Sinusoidal: {
		In: function (k) {
			return 1 - Math.cos(k * Math.PI / 2);
		},
		Out: function (k) {
			return Math.sin(k * Math.PI / 2);
		},
		InOut: function (k) {
			return 0.5 * (1 - Math.cos(Math.PI * k));
		}
	},
	Exponential: {
		In: function (k) {
			return k === 0 ? 0 : Math.pow(1024, k - 1);
		},
		Out: function (k) {
			return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k);
		},
		InOut: function (k) {
			if (k === 0) {
				return 0;
			}
			if (k === 1) {
				return 1;
			}
			if ((k *= 2) < 1) {
				return 0.5 * Math.pow(1024, k - 1);
			}
			return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);
		}
	},
	Circular: {
		In: function (k) {
			return 1 - Math.sqrt(1 - k * k);
		},
		Out: function (k) {
			return Math.sqrt(1 - (--k * k));
		},
		InOut: function (k) {
			if ((k *= 2) < 1) {
				return - 0.5 * (Math.sqrt(1 - k * k) - 1);
			}
			return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
		}
	},
	Elastic: {
		In: function (k) {
			if (k === 0) {
				return 0;
			}
			if (k === 1) {
				return 1;
			}
			return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
		},
		Out: function (k) {
			if (k === 0) {
				return 0;
			}
			if (k === 1) {
				return 1;
			}
			return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
		},
		InOut: function (k) {
			if (k === 0) {
				return 0;
			}
			if (k === 1) {
				return 1;
			}
			k *= 2;
			if (k < 1) {
				return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
			}
			return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
		}
	},
	Back: {
		In: function (k) {
			var s = 1.70158;
			return k * k * ((s + 1) * k - s);
		},
		Out: function (k) {
			var s = 1.70158;
			return --k * k * ((s + 1) * k + s) + 1;
		},
		InOut: function (k) {
			var s = 1.70158 * 1.525;
			if ((k *= 2) < 1) {
				return 0.5 * (k * k * ((s + 1) * k - s));
			}
			return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
		}
	},
	Bounce: {
		In: function (k) {
			return 1 - easingFunctions.Bounce.Out(1 - k);
		},
		Out: function (k) {
			if (k < (1 / 2.75)) {
				return 7.5625 * k * k;
			} else if (k < (2 / 2.75)) {
				return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
			} else if (k < (2.5 / 2.75)) {
				return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
			} else {
				return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
			}
		},
		InOut: function (k) {
			if (k < 0.5) {
				return easingFunctions.Bounce.In(k * 2) * 0.5;
			}
			return easingFunctions.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
		}
	}
};

// ---




global.interp = function(startValue, endValue, t, easing, type, unclamped){
	// set defaults
	if(typeof easing === 'undefined'){ // if no easing, return linear remap (lerp)
		return global.clamp(t) * (endValue-startValue) + startValue;
	}
	if(typeof type === 'undefined'){
		type = "InOut";
	}

	// don't overshoot
	if(!unclamped) t = global.clamp(t);

	// get easing function + type
	var easingFunction = easingFunctions[easing];
	if(typeof easingFunction === 'undefined'){
		var trace = new Error().stack;
		throw new Error("Easing function: '" + easing + "' does not exist!" + '\n' + trace.toString());
	}
	var easingType = easingFunction[type];
	if(typeof easingType === 'undefined'){
		var trace = new Error().stack;
		throw new Error("Easing type: '" + type + "' does not exist!" + '\n' + trace.toString());
	}

	// remap
	return easingType(t) * (endValue-startValue) + startValue;
}



var animatedProperties = [];
global.AnimateProperty = function(){
	var self = this;

	/**
	 * @type {Function} 
	 * @description Function to call on animation start. */
	this.startFunction = function(){};

	/**
	 * @type {Function}
	 * @description Function to call on each animation frame, with animation value (0-1) as its first argument. */
	this.updateFunction = function(v){};

	/**
	 * @type {Function} 
	 * @description Function to call on animation end. */
	this.endFunction = function(){};

	/**
	 * @type {Number}
	 * @description Duration in seconds. Default is 1. */
	this.duration = 1;

	/**
	 * @type {Number}
	 * @description Reverse duration in seconds. Default is equal to duration. */
	this.reverseDuration;

	/**
	 * @type {Number}
	 * @description Delay after starting animation. Default is 0. */
	this.delay = 0;

    /**
	 * @type {String}
	 * @description Determines curve. Default is "Cubic".
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
	 * @description Determines how animation curve is applied. Default is "InOut".
	 * 
	 * All possible inputs:
	 * "In"
	 * "Out"
	 * "InOut" */
	this.easeType = "InOut";

	/**
	 * @type {Function} 
	 * @argument {Number} newTimeRatio
	 * @description Updates the animation once, stops the currently running animation. Sets the time value to newTimeRatio (linear 0-1). */
	this.pulse = function(newTimeRatio){
		if(reversed) newTimeRatio = 1-newTimeRatio;
		stopAnimEvent();
		timeRatio = newTimeRatio; // reset animation time
		setValue( getInterpolated() );
	}

	/**
	 * @type {Number} 
	 * @description The current linear normalized animation time, 0-1. */
	this.getTimeRatio = function(){
		var reversedTimeRatio = reversed ? 1-timeRatio : timeRatio;
		return global.clamp(reversedTimeRatio);
	}

	/**
	 * @type {Function} 
	 * @description If reversed, the animation plays backwards. The easeType will be swapped if it isn't 'InOut'. 'reverse' arg is of type Bool. */
	this.setReversed = function(reverse){
		if(typeof reverse === 'undefined'){ // toggle reverse if no argument given
			reversed = !reversed;
		}else{
			reversed = reverse;
		}
	}

	/**
	 * @type {Function} 
	 * @description Returns true if the animation is currently reversed. */
	this.getReversed = function(){
		return reversed;
	}

	/**
	 * @type {Boolean} 
	 * @description Returns true if the animation is currently playing. */
	this.isPlaying = function(){
		return isPlaying;
	}

	/**
	 * @type {Function} 
	 * @argument {Number} atTime
	 * @description Starts the animation. Optional 'atTime' argument starts at normalized linear 0-1 time ratio. */
	this.start = function(newTimeRatio){
		stopDelayedStart();

		function begin(){
			if(newTimeRatio != null){ // custom time ratio given
				self.pulse(newTimeRatio);
			}else{
				if(self.getTimeRatio() === 1) self.pulse(0);
			}
			updateDuration();
			animation();
			startAnimEvent();
			if(self.startFunction) self.startFunction();
		}

		if(self.delay > 0){ // start after delay (if any)
			delayedStart = new global.DoDelay(begin)
			delayedStart.byTime(self.delay);
		}else{
			begin();
		}

		// force isPlaying to true, as it otherwise takes until the delay is over (delayed animation also counts as playing)
		isPlaying = true;
	}
	
	/**
	 * @type {Function} 
	 * @description Stop the animation at its current time. With an optional argument to call the endFunction (bool). */
	this.stop = function(callEndFunction){
		stopAnimEvent();
		var atAnimationEnd = (timeRatio === 0 && reversed) || (timeRatio === 1 && !reversed);
		if(callEndFunction || atAnimationEnd) self.endFunction(); // only call endFunction if an animation was stopped at end
	}


	// private

	var animEvent;
	var reversed = false;
	var isPlaying = false;
	var delayedStart;
	var duration;
	var timeRatio = 0;

	function setValue(v){
		self.updateFunction(v);
	}

	function updateDuration(){
		duration = reversed ? (typeof self.reverseDuration === 'number' ? self.reverseDuration : self.duration) : self.duration; // set duration, checks if reversed is unique otherwise uses forward duration
	}
	
	function animation(){
		if(duration === 0){ // if instant
			timeRatio = reversed ? 0 : 1; // set to limit of allowed range to make the animation stop right away (1 tick of update function will be sent)
		}else{
			var dir = reversed ? -1 : 1;
			timeRatio += (getDeltaTime() / duration) * dir;
		}
		if(reversed ? (timeRatio <= 0) : (timeRatio >= 1)){ // on last step
			setValue(reversed ? 0 : 1);
			self.stop(true);
		}else{ // on animation step
			var v = getInterpolated();
			setValue(v);
		}
	}

	function getInterpolated(){
		return global.interp(0, 1, timeRatio, self.easeFunction, getEaseType());
	}
	
	function startAnimEvent(){
		stopAnimEvent(); // stop currently playing (if any)
		animEvent = script.createEvent("UpdateEvent");
		animEvent.bind(animation);
		isPlaying = true;
	}
	
	function stopAnimEvent(){
		if(animEvent){
			script.removeEvent(animEvent);
			animEvent = null;
		}
		isPlaying = false;

		stopDelayedStart();
	}

	function stopDelayedStart(){
		if(delayedStart){
			delayedStart.stop();
			delayedStart = null;
		}
	}

	function getEaseType(){
		var easeType = self.easeType;
		if(reversed) easeType = oppositeEaseType(easeType); // check animation direction
		return easeType;
	}

	function oppositeEaseType(easeType){
		switch(easeType){ // swap In/Out direction
			case "In":
				return "Out";
			case "Out":
				return "In";
			default: // if InOut, direction doesn't matter
				return "InOut"
		}
	}

	animatedProperties.push(this);
}




global.StopAllAnimateProperties = function(){
	for(var i = 0; i < animatedProperties.length; i++){
		var anim = animatedProperties[i];
		if(anim && anim.stop) anim.stop();
	}
	return animatedProperties;
}




global.degToRad = function(degrees){
	if(typeof degrees === 'number'){
		return degrees * Math.PI/180;
	// assume vec3
	}else{
		var _x = degrees.x * Math.PI/180;
		var _y = degrees.y * Math.PI/180;
		var _z = degrees.z * Math.PI/180;
		return new vec3(_x, _y, _z);
	}
}




global.radToDeg = function(radians){
	if(typeof radians === 'number'){
		return radians * 180/Math.PI;
	// assume vec3
	}else{
		var _x = radians.x * 180/Math.PI;
		var _y = radians.y * 180/Math.PI;
		var _z = radians.z * 180/Math.PI;
		return new vec3(_x, _y, _z);
	}
}




global.isInFront = function(objFront, objBehind){
	var frontPos = objFront.getTransform().getWorldPosition();
	var behindTransf = objBehind.getTransform();
	var behindPos = behindTransf.getWorldPosition();
	var target = new vec3(behindPos.x - frontPos.x,
						  behindPos.y - frontPos.y,
						  behindPos.z - frontPos.z);
	target = target.normalize();
	var dir = target.dot(behindTransf.forward);
	return dir < 0;
}




global.isInBox = function(obj, box){
	// lens studio box size
	var meshNormalize = global.LS_BOX_SCALE;

	// get world bounds of collision box
	var collisionTransf = box.getTransform();
	var collisionScale = collisionTransf.getWorldScale();
	var collisionPos = collisionTransf.getWorldPosition();
	collisionPos.x /= meshNormalize;
	collisionPos.y /= meshNormalize;
	collisionPos.z /= meshNormalize;

	var xMin = collisionPos.x - collisionScale.x/2;
	var xMax = collisionPos.x + collisionScale.x/2;
	var yMin = collisionPos.y - collisionScale.y/2;
	var yMax = collisionPos.y + collisionScale.y/2;
	var zMin = collisionPos.z - collisionScale.z/2;
	var zMax = collisionPos.z + collisionScale.z/2;

	// get comparison pos
	var currPos = obj.getTransform().getWorldPosition();

	// normalize for box mesh scale
	currPos.x /= meshNormalize;
	currPos.y /= meshNormalize;
	currPos.z /= meshNormalize;

	// check if in bounds
	return ((currPos.x < xMax && currPos.x > xMin) &&
			(currPos.y < yMax && currPos.y > yMin) &&
			(currPos.z < zMax && currPos.z > zMin) );
}




global.planeRay = function(rayP, rayD, planeP, planeN){
	var denom = planeN.dot(rayD);
	if(Math.abs(denom) > 0.0001){
		var t = (planeP.sub(rayP)).dot(planeN) / denom;
		if (t < 0){ // if hitting plane
			return rayP.add(rayD.uniformScale(t));
		}
	}
	return null;
}




global.HSVtoRGB = function(h, s, v){
	h = h % 1;
	s = global.clamp(s);
	v = global.clamp(v);
	var r;
	var g;
	var b;

	var i = Math.floor(h * 6);
	var f = h * 6 - i;
	var p = v * (1 - s);
	var q = v * (1 - f * s);
	var t = v * (1 - (1 - f) * s);

	switch (i % 6) {
		case 0: 
			r = v, g = t, b = p;
			break;
		case 1: 
			r = q, g = v, b = p;
			break;
		case 2: 
			r = p, g = v, b = t;
			break;
		case 3: 
			r = p, g = q, b = v;
			break;
		case 4: 
			r = t, g = p, b = v;
			break;
		case 5: 
			r = v, g = p, b = q;
			break;
	}

	return new vec3(r, g, b);
}




global.RGBtoHSV = function(rgb){
	var r = global.clamp(rgb.x);
	var g = global.clamp(rgb.y);
	var b = global.clamp(rgb.z);

	var v = Math.max(r, g, b)
	var n = v - Math.min(r,g,b);
	var h = n && ( (v == r) ? (g - b) / n : ( (v == g) ? 2 + (b - r) / n : 4 + (r - g) / n) );
	
	return new vec3( 60 * (h < 0 ? h + 6 : h) / 360,
					 v && n / v,
					 v);
}




var allDelays = [];
global.DoDelay = function(func, args){
	var self = this;

	/**
	 * @type {Function}
	 * @description Set the function to delay. */
	this.func = func;

	/**
	 * @type {Array}
	 * @description Array of arguments to pass on to the function*/
	this.args = args;

	/**
	 * @type {Function} 
	 * @argument {Number} n
	 * @description Schedule a function by n frames (int Number, will be rounded). */
	this.byFrame = function(n){
		if(!this.func){
			var trace = new Error().stack;
			throw new Error("No function set to delay!" + '\n' + trace.toString());
		}

		const keepAlive = {
			exec: function(){
				var _args = self.args;
				self.func.apply(null, _args);
			}
		}

		var wait = n === undefined ? 1 : Math.round(n); // if no arg n given, do on next frame
		function onUpdate(){
			if(wait <= 0){
				script.removeEvent(waitEvent);
				keepAlive.exec();
			}
			wait--;
		}

		stopWaitEvent();

		if(wait === 0){
			keepAlive.exec();
		}else{
			waitEvent = script.createEvent("UpdateEvent");
			waitEvent.bind(onUpdate);
		}
	}

	/**
	 * @type {Function} 
	 * @argument {Number} t
	 * @description Schedule a function by t seconds (Number). */
	this.byTime = function(t){
		const keepAlive = {
			exec: function(){
				var _args = self.args;
				self.func.apply(null, _args);
			}
		}

		stopWaitEvent();

		var wait = t;
		if(wait === 0){
			keepAlive.exec();
		}else{
			waitEvent = script.createEvent("DelayedCallbackEvent");
			waitEvent.bind(keepAlive.exec.bind(keepAlive));
			waitEvent.reset(wait);
		}
	}

	// the event running in the background
	var waitEvent;
	function stopWaitEvent(){
		if(waitEvent){
			script.removeEvent(waitEvent);
			waitEvent = null;
		}
	}

	/**
	 * @type {Function} 
	 * @description Stop the scheduled delay. */
	this.stop = function(){
		stopWaitEvent();
	}

	allDelays.push(this);
}




global.StopAllDelays = function(){
	for(var i = 0; i < allDelays.length; i++){
		var delay = allDelays[i];
		if(delay && delay.stop) delay.stop();
	}
	return allDelays;
}




var allSoundInstances = [];
global.instSound = function(audioAsset, volume, fadeInTime, fadeOutTime, offset, mixToSnap){
	var audioComp = script.getSceneObject().createComponent("Component.AudioComponent");
	audioComp.audioTrack = audioAsset;

	if(volume === 0 || volume) audioComp.volume = volume;
	if(fadeInTime) 	audioComp.fadeInTime = fadeInTime;
	if(fadeOutTime) audioComp.fadeOutTime = fadeOutTime;

	if(offset){
		audioComp.position = offset;
		audioComp.pause();
		audioComp.resume();
	}

	if(mixToSnap) audioComp.mixToSnap = true;

	audioComp.play(1);

	function destroyAudioComponent(audioComp){
		audioComp.stop(false); // stop playing
		new global.DoDelay(function(){ audioComp.destroy(); }).byFrame(); // delete on next frame
	}
	new global.DoDelay( destroyAudioComponent, [audioComp]).byTime(audioComp.duration + .1); // stop playing after audio asset duration

	allSoundInstances.push(audioComp);
	return audioComp;
}




global.StopAllSoundInstances = function(){
	for(var i = 0; i < allSoundInstances.length; i++){
		var soundInstance = allSoundInstances[i];
		if(soundInstance && !isNull(soundInstance)){
			soundInstance.stop(false);
			soundInstance.destroy();
		}
	}
	return allSoundInstances;
}




global.instSoundPooled = function(listOfAssets, poolSize, waitTime){
	var self = this;

	var pool = [];
	var poolIndex = 0;
	var lastTime;

	function init(){
		// create sceneobject to create components on
		self.soundInstancesObject = global.scene.createSceneObject("soundInstancesObject");

		// create instances
		for(var i = 0; i < poolSize; i++){
			var components = [];
			for(var j = 0; j < listOfAssets.length; j++){
				var thisAudioComp = self.soundInstancesObject.createComponent("Component.AudioComponent");
				thisAudioComp.audioTrack = listOfAssets[j];
				components.push(thisAudioComp);
			}
			pool.push(components);
		}
	}
	init();

	/**
	 * @type {SceneObject} 
	 * @description SceneObject that contains all the sound components for this pool (read-only). */
	this.soundInstancesObject;

	/**
	 * @type {Function} 
	 * @description Call with audio asset index to play pooled sound. */
	this.instance = function(indexToPlay){
		if(waitTime != null){
			if(lastTime == null){
				lastTime = getTime()-waitTime-1; // first shot is always allowed
			}else{
				if(getTime() - lastTime < waitTime) return;
				lastTime = getTime();
			}
		}

		var component = pool[poolIndex][indexToPlay];
		component.play(1);

		// increment
		poolIndex++;
		if(poolIndex >= pool.length) poolIndex = 0;
	}
}




global.clamp = function(value, low, high){
	if(!low && low !== 0) low = 0;
	if(!high && high !== 0) high = 1;
	return Math.max(Math.min(value, Math.max(low, high)), Math.min(low, high));
}




global.randSeed = function(a){
	var t = a += 0x6D2B79F5;
	t = Math.imul(t ^ t >>> 15, t | 1);
	t ^= t + Math.imul(t ^ t >>> 7, t | 61);
	return ((t ^ t >>> 14) >>> 0) / 4294967296;
}




global.remap = function(value, low1, high1, low2, high2, clamp){
	var remapped = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	return clamp ? global.clamp(remapped, low2, high2) : remapped;
}




// ---
// Material Graph Pack/Unpack
// From Snap - LiDAR enabled template, Instanced Object Controller - v0.0.1

const ENCODE_MAX_VALUE = 0.99;
const MIN_POS_BITS_TO_FLOAT_CONSTANT = new vec4(1.0,1.0/255.0,1.0/65025.0,1.0/16581375.0);

function fract(float) {
	var n = Math.abs(float); 
	var decimal = n - Math.floor(n);
	return decimal;
}

function floatToBits(float) {
	var x = fract(1 * float),
		y = fract(255 * float),
		z = fract(65025 * float),
		w = fract(16581375 * float);
	
	var a = y / 255,
		b = z / 255,
		c = w / 255,
		d = 0;

	return new vec4(x-a, y-b, z-c, w-d);
}

function bitsToFloat(raw) {
	var v = raw;
	
	if (raw.w === undefined) {
		var a = [raw.x,raw.y, raw.z].map(function(v) {
			return Math.floor(v * 65025 + 0.5) /65025; 
		});
		v = new vec4(a[0], a[1], a[2], 0);
	}

	return v.dot(MIN_POS_BITS_TO_FLOAT_CONSTANT);
}

global.encodeFloat = function(value, min, max) {
	return floatToBits(global.remap(global.clamp(value, min, max), min, max, 0.0, ENCODE_MAX_VALUE));
}

global.decodeToFloat = function(value, min, max) {
	return global.remap(bitsToFloat(value), 0.0, ENCODE_MAX_VALUE, min, max);
}

// ---




global.screenToScrTransform = function(screenPos){
	return new vec2( (screenPos.x - .5)*2,
					 (1-screenPos.y - .5)*2);
}




global.scrTransformToScreen = function(scrTransfCenter){
	return new vec2( scrTransfCenter.x/2 + .5,
					 1-(scrTransfCenter.y/2 + .5) );
}




global.worldMeshClassify = function(n){
	switch (n){
		case 0:
			return "None";
		case 1:
			return "Wall";
		case 2:
			return "Floor";
		case 3:
			return "Ceiling";
		case 4:
			return "Table";
		case 5:
			return "Seat";
		case 6:
			return "Window";
		case 7:
			return "Door";
		default:
			return null;
	}
}




global.shuffleArray = function(array) {
	var curIndex = array.length;
	var tmpValue;
	var rndIndex;
	while (0 !== curIndex) {
		rndIndex = Math.floor(Math.random() * curIndex);
		curIndex -= 1;
		tmpValue = array[curIndex];
		array[curIndex] = array[rndIndex];
		array[rndIndex] = tmpValue;
	}
	return array;
}




global.concatArrays = function(a, b) {
	var c = new (a.constructor)(a.length + b.length);
	c.set(a, 0);
	c.set(b, a.length);
	return c;
}




global.MovingAverage = function(){
	var self = this;

	/**
	 * @type {Function} 
	 * @argument {Number} value
	 * @description Add a sample to the moving average. */
	this.add = function(value){
		self.sampleCount++;
		if(self.average === null){
			self.average = value;
		}else{
			self.average = getNewAverage(value);
		}
		return self.average;
	}

	/**
	 * @type {Number} 
	 * @description The current average (get/set). */
	this.average = null;

	/**
	 * @type {Number} 
	 * @description The current sample count (get/set). */
	this.sampleCount = 0;

	function getNewAverage(newValue){
		if(this.sampleCount === 0) return null; // no values yet, so no valid average can be given
		var newAvg = ((self.average*(self.sampleCount-1)) + newValue)/self.sampleCount;
		return newAvg
	}
}




global.Stopwatch = function(){
	var stopwatchStart;
	var avg = new global.MovingAverage();

	/**
	 * @type {Function} 
	 * @description Starts this stopwatch. */
	this.start = function(){
		stopwatchStart = performance.now();
	}

	/**
	 * @type {Function} 
	 * @description Stops this stopwatch, prints the result to the console. */
	this.stop = function(){
		var diff = (performance.now() - stopwatchStart)/1000; // differents in seconds
		var thisAvg = avg.add(diff);
		print('duration: ' + diff.toString() + '\n' + 'avg: ' + thisAvg.toString());
	}
}




global.setAllChildrenToLayer = function(sceneObj, layer) {
	for (var i = 0; i < sceneObj.getChildrenCount(); i++) {
		sceneObj.getChild(i).layer = layer;
		global.setAllChildrenToLayer(sceneObj.getChild(i), layer); // recursive
	}
};




global.rotateCoords = function(point, pivot, angle){
	var _x = Math.cos(angle) * (point.x-pivot.x) - Math.sin(angle) * (point.y-pivot.y) + pivot.x;
	var _y = Math.sin(angle) * (point.x-pivot.x) + Math.cos(angle) * (point.y-pivot.y) + pivot.y;
	return new vec2(_x, _y);
}




global.circularDistance = function(a, b, mod){
	function absMod(x, m){
		var mAbs = Math.abs(m);
		var v = x % mAbs;
		if(v < 0){
			return v+mAbs;
		}else{
			return v;
		}
	}
	var m1 = absMod(a-b, mod);
	var m2 = absMod(b-a, mod);
	return Math.min(m1, m2);
}




global.mod = function(a, b){
	if(a >= 0){
		return a%b;
	}else{
		return b-(Math.abs(a)%b);
	}
}




global.measureWorldPos = function(screenPos, region, cam, dist){
	var pos2D = region.localPointToScreenPoint(screenPos);
	return cam.screenSpaceToWorldSpace(pos2D, dist);
}




global.getAllComponents = function(componentName, startObj){
    var found = [];

    function scanSceneObject(obj){
		var comps = obj.getComponents(componentName);
		for(var j = 0; j < comps.length; j++){ // add all to list
			found.push(comps[j]);
		}
    }

    function iterateObj(obj){
        for(var i = 0; i < obj.getChildrenCount(); i++){
            var child = obj.getChild(i);
            scanSceneObject(child)
			iterateObj(child);
        }
    }

	if(startObj){ // start at specific object if it exists
		if(isNull(startObj)){
			var trace = new Error().stack;
			throw("Object to get all components of does not exist anymore! It might have been deleted." + '\n' + trace.toString()); // warn user if chosen object doesn't exist
		}
		scanSceneObject(startObj);
		iterateObj(startObj);
	}else{ // go through whole scene
		var rootObjectsCount = global.scene.getRootObjectsCount();
		for(var i = 0; i < rootObjectsCount; i++){
			var rootObj = global.scene.getRootObject(i);
			scanSceneObject(rootObj);
			iterateObj(rootObj);
		}
	}
    
    return found;
}




global.parseNewLines = function(txt, customSplit){
	var parsed = "";
	var txtSplits = txt.split(customSplit ? customSplit : '\\n');
	for(var i = 0; i < txtSplits.length; i++){
		parsed += txtSplits[i] + '\n';
	}
	return parsed;
}




global.median = function(arr){
	var clone = [];
	for (var i = 0; i < arr.length; i++) {
		clone[i] = arr[i];
	}
    clone.sort();
    var c = Math.floor(clone.length/2);
    return clone.length % 2 === 0 ? clone[c] : (clone[c - 1] + clone[c]) / 2;
}




global.lookAtUp = function(posA, posB, offset){
	if(!offset) offset = 0;
	var angle = Math.atan2(posA.x - posB.x, posA.z - posB.z);
	return quat.angleAxis(angle + offset, vec3.up());
}




global.mat4FromDescription = function(matDescription){
	var lines = matDescription.split('\n');
	var lines1 = lines[1].split(' ');
	var lines2 = lines[2].split(' ');
	var lines3 = lines[3].split(' ');
	var lines4 = lines[4].split(' ');
	var c0 = new vec4(Number(lines1[0]), Number(lines2[0]), Number(lines3[0]), Number(lines4[0]));
	var c1 = new vec4(Number(lines1[1]), Number(lines2[1]), Number(lines3[1]), Number(lines4[1]));
	var c2 = new vec4(Number(lines1[2]), Number(lines2[2]), Number(lines3[2]), Number(lines4[2]));
	var c3 = new vec4(Number(lines1[3]), Number(lines2[3]), Number(lines3[3]), Number(lines4[3]));
	var m = new mat4();
	m.column0 = c0;
	m.column1 = c1;
	m.column2 = c2;
	m.column3 = c3;
	return m;
}




global.wrapFunction = function(originalFunction, newFunction){
	if (!originalFunction) {
        return newFunction;
    }
    return function() {
        originalFunction();
        newFunction();
    };
}




global.VisualizePositions = function(scale){
	var self = this;

	/**
	 * @type {Number}
	 * @description Size of objects. Default is 1. */
	this.scale = scale ? scale : 1;

	/**
	 * @type {Boolean}
	 * @description If constantly rotating. */
	this.continuousRotation = true;

	/**
	 * @type {Material}
	 * @description Material to place on box mesh. */
	this.material;

	/**
	 * @type {Function}
	 * @description Call to create objects. */
	this.update = function(positions){
		// remove existing
		self.remove();

		// add new
		for(var i = 0; i < positions.length; i++){
			// create
			var obj = global.scene.createSceneObject("visualizeCube_" + i.toString());
			var rmv = obj.createComponent("Component.RenderMeshVisual");
			rmv.mesh = cube;

			// material
			if(self.material) rmv.addMaterial(self.material);

			// position, scale
			var trf = obj.getTransform();
			trf.setWorldPosition(positions[i]);
			trf.setWorldScale(vec3.one().uniformScale(self.scale));
			if(self.continuousRotation) trf.setLocalRotation()

			// register
			objs.push(obj);
		}

		// do continuous rotation
		if(self.continuousRotation){
			if(!keepRotatingEvent){ // if no rotating event yet, create new
				function keepRotating(){
					rot = quat.angleAxis(getTime(), vec3.up());
					for(var i = 0; i < objs.length; i++){
						objs[i].getTransform().setWorldRotation(rot);
					}
				}
				keepRotatingEvent = script.createEvent("UpdateEvent");
				keepRotatingEvent.bind(keepRotating);
			}
		}else{ // delete existing rotation (if any)
			stopEvents();
		}

		return objs;
	};

	/**
	 * @type {Function}
	 * @description Call to clear objects. */
	this.remove = function(){
		for(var i = 0; i < objs.length; i++){
			objs[i].destroy();
		}
		objs = [];
	}


	// private
	var objs = []; // list of created sceneobjects
	var keepRotatingEvent; // rotation animation event
	var cube = makeCube(); // get mesh
	var rot = quat.angleAxis(0, vec3.up()); // starting rotation

	// stops animation event
	function stopEvents(){
		if(keepRotatingEvent){
			script.removeEvent(keepRotatingEvent);
			keepRotatingEvent = null;
		}
	}

	// generated mesh to be used on created objects
	function makeCube(){
		
		// Cube from MeshBuilder documentation

		var builder = new MeshBuilder([
			{ name: "position", components: 3 },
			{ name: "normal", components: 3, normalized: true },
			{ name: "texture0", components: 2 },
		]);
		builder.topology = MeshTopology.Triangles;
		builder.indexType = MeshIndexType.UInt16;
		
		// UVs of quad: top left, bottom left, bottom right, top right
		var QUAD_UVS = [[0,1], [0,0], [1,0], [1,1]];
		
		// append data for 4 vertices in a quad shape
		function addQuadVerts(meshBuilder, normal, positions){
			for(var i=0; i<positions.length; i++){
				meshBuilder.appendVertices([positions[i], normal, QUAD_UVS[i]]);
			}
		}
		
		// append the indices for two triangles, forming a quad
		function addQuadIndices(meshBuilder, topLeft, bottomLeft, bottomRight, topRight){
			meshBuilder.appendIndices([
				topLeft, bottomLeft, bottomRight, // 1st triangle
				bottomRight, topRight, topLeft // 2nd triangle
			]);
		}
		
		// define normal direction and vertex positions for each side of the cube
		var right 	=   .5;
		var left 	= - .5;
		var top 	=   .5;
		var bottom 	= - .5;
		var front 	=   .5;
		var back 	= - .5;
		var sides = [
			{ normal: [0,0,1], // front
			  positions: [[left,top,front], [left,bottom,front], [right,bottom,front], [right,top,front]] },
			{ normal: [0,0,-1], // back
			  positions: [[right,top,back], [right,bottom,back], [left,bottom,back], [left,top,back]] },
			{ normal: [1,0,0], // right
			  positions: [[right,top,front], [right,bottom,front], [right,bottom,back], [right,top,back]] },
			{ normal: [-1,0,0], // left
			  positions: [[left,top,back], [left,bottom,back], [left,bottom,front], [left,top,front]] },
			{ normal: [0,1,0], // top
			  positions: [[left,top,back], [left,top,front], [right,top,front], [right,top,back]] },
			{ normal: [0,-1,0], // bottom
			  positions: [[left,bottom,front], [left,bottom,back], [right,bottom,back], [right,bottom,front]] }, ];
		
		// for each side, append vertex data and indices
		for(var i=0; i<sides.length; i++){
			var index = i * 4;
			addQuadVerts(builder, sides[i].normal, sides[i].positions);
			addQuadIndices(builder, index, index+1, index+2, index+3);
		}

		// return generated mesh
		builder.updateMesh();
		return builder.getMesh();
	}
}
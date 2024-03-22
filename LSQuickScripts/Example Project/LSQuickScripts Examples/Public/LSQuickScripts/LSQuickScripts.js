//@ui {"widget":"label", "label":"LSQuickScripts v2.16"}
//@ui {"widget":"label", "label":"By Max van Leeuwen"}
//@ui {"widget":"label", "label":"-"}
//@ui {"widget":"label", "label":"Place on top of scene ('On Awake')"}
//@ui {"widget":"label", "label":"For more info, open this script! Or go to:"}
//@ui {"widget":"label", "label":"maxvanleeuwen.com/LSQuickScripts"}



// Max van Leeuwen
// twitter      @maksvanleeuwen
// instagram    @max.van.leeuwen
// maxvanleeuwen.com



// LSQuickScripts - A cheat sheet of Lens Studio Javascript snippets that I often use.
//
//
//
//
//
//
// CREDITS
// -------------------
// Snap Inc.
//
// chatGPT :)
//
// Tween.js - Licensed under the MIT license
// https://github.com/tweenjs/tween.js
// See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
// -------------------
//
//
//
//
//
// 
// HOW TO USE
// -------------------
//
//
// lsqs : Script Component
//  Returns the Script component this script is on.
//
//
//
// -
//
//
// EaseFunctions : object
//	Contains all Tween Easing Functions, with their In/Out/InOut types.
//	Use it on any number to get its lookup-value back.
// 	These functions can be used with Interp and AnimateProperty.
//
//		All types, don't forget to add In/Out/InOut
//			Linear
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
//		Usage example
//			var n = 0.3
//			var n_eased = global.Easing.Cubic.In(n)
//				n_eased == 0.027
//
//
//
// interp(startValue [number], endValue [number], t [number], easing (optional) [function], unclamped (optional) [bool]) : number
// 	Returns the value of t interpolated using an Easing Function, remapped to start and end values.
//	Is identical to a linear lerp() when no Easing Function is given.
//	Use one of the Easing Functions in global.EaseFunctions, or use your own!
//
// 		Examples, [-5, 5] at position x
// 			Cubic in/out	interp(-5, 5, x, EaseFunctions.Cubic.InOut)
// 			Linear (lerp)	interp(-5, 5, x)
//			Custom			interp(-5, 5, x, function(v){ return v })
//
//
//
// AnimateProperty() : AnimateProperty object
// 	Creates an easy-to-use animation instance. Can be used to quickly animate any property, using just a couple lines of code!
//
//		Example, showing all possible properties
//
//			var anim = new AnimateProperty( updateFunction (optional) )		// create a new animation instance called 'anim'.
//			anim.startFunction = function(){}								// function to call on animation start.
//			anim.updateFunction = function(v, vLinear){}					// function to call on each animation frame, with animation value (0-1, inclusive) as its first argument. The second argument is the linear animation value. These ranges are exclusive for the first step, and inclusive for the last step of the animation (so when playing in reverse, the range becomes (1, 0]).
//			anim.endFunction = function(){}									// function to call on animation end.
//			anim.duration = 1												// duration in seconds. Default is 1.
//			anim.reverseDuration = 1										// duration in seconds when reversed. If no value assigned, default is equal to duration.
//			anim.delay = 0													// delay after starting animation. Default is 0.
//			anim.reverseDelay = 0											// delay after starting animation in reverse. Uses anim.delay if none is given.
//			anim.easeFunction = EaseFunctions.Cubic.In						// determines curve. Default is Cubic.InOut. All EaseFunctions can be used, or use a custom function.
//			anim.reverseEaseFunction = EaseFunctions.Cubic.Out				// determines curve on reverse playing. Uses anim.easeFunction if none is given.
//			anim.pulse(newTimeRatio)										// updates the animation once, stops the currently running animation. Sets the time value to newTimeRatio (linear 0-1).
//			anim.getTimeRatio()												// the current linear, normalized animation time (0 on animation start, 1 on animation end, regardless of whether animation is reversed).
//			anim.setReversed(reverse)										// if reversed, the animation plays backwards. 'Reverse' arg should be of type Bool.
//			anim.getReversed()												// returns true if the animation is currently reversed.
//			anim.isPlaying()												// returns true if the animation is currently playing.
//			anim.setCallbackAtTime(v, function)								// registers a callback function on the first frame that v >= t (or v <= t if playing reversed). Call without arguments to clear.
//			anim.start(newTimeRatio, skipDelay)								// starts the animation (resumes where last play ended, starts from beginning if last play was finished). Optional 'atTime' argument starts at normalized linear 0-1 time ratio. Optional skipDelay bool skips the delay on this animation once.
//			anim.stop(callEndFunction)										// stop the animation at its current time. With an optional argument to call the endFunction (argument should be a bool, default is false).
//
//		Example, smoothly animating transform 'trf' one unit to the right (default duration is 1 second)
//
// 			var anim = new AnimateProperty()
// 			anim.updateFunction = function(v){
// 				trf.setLocalPosition(new vec3(v, 0, 0))
// 			}
// 			anim.start()
//
//
//
// getAllAnimateProperty() : AnimateProperty array
//	Get a list of all instances created using 'AnimateProperty'. Useful, for example, when you want to stop all instances running in your lens.
//
//
//
// -
//
//
// degToRad(degrees [Number/vec3]) : number/vec3
// 	Converts number or vec3 of degrees to number or vec3 of radians.
//
//
//
// radToDeg(radians [Number/vec3]) : number/vec3
// 	Converts number or vec3 of radians to number or vec3 of degrees.
//
//
//
// -
//
//
// isInFront(pos1 [vec3], pos2 [vec3], fwd [vec3]) : bool
// 	Checks if pos1 is in front of pos2, assuming pos2 has normalized forward vector fwd.
//
//
//
// pointInBox(point [vec3], unitBoxTrf [Transform], getRelativePosition (optional) [Bool] ) : vec3
// 	Checks if a world position is within the boundaries of a unit box (by its Transform). The box can be moved, rotated, and scaled non-uniformly.
//	Returns an object with two values:
//		'isInside': boolean
//		'relativePosition': (only if getRelativePosition is true) a vec3 with normalized positions relative to the box (-1 to 1, unclamped)
//
//
//
// planeRay(point [vec3], dir [vec3], planePos [vec3], planeFwd [vec3]) : vec3
//	Checks if a line ('point' with normalized direction 'dir') intersects a plane (position 'planePos' with normal 'planeFwd'). Returns world position (vec3) if it does, returns null otherwise.
//
//
//
// projectPointToPlane(point [vec3], planePos [vec3], planeFwd [vec3], planeScale [vec3]) : vec2
// 	Projects a 3D point onto a plane with custom position, orientation, and non-uniform scale. Returns normalized 2D coordinates on plane at this position.
//
//
//
// distanceAlongVector(pos1 [vec3], pos2 [vec3], fwd [vec3]) : vec3
//	Returns the distance between two 3D points along a normalized vector.
//
//
//
// -
//
//
// hsvToRgb(h [number], s [number], v [number]) : vec3
// 	Returns the RGB color for a Hue, Saturation, and Value. Inputs and outputs are in range 0-1.
//
//
//
// rgbToHsv(rgb [vec3/vec4]) : vec3
// 	Returns the Hue, Saturation, and Value for the specified color (can be vec3 or vec4). Inputs and outputs are in range 0-1.
//
//
//
// -
//
//
// DoDelay(function (optional) [function], arguments (optional) [Array] ) : DoDelay object
//	An object that makes it easy to schedule a function to run in the future (by frames or by seconds).
//
//		Example, showing all properties
//
//			var delayed = new doDelay()
//			delayed.func = function(){} 					// the function to call after a delay
//			delayed.args = []								// function arguments should be given as an array
//			delayed.byFrame(10)								// this will call the function in 10 frames (function is called on the next frame if no argument given, or instantly if arg is '0')
//			delayed.byTime(10)								// this will call the function in 10 seconds (function is called instantly if no argument given or if arg is '0')
//			delayed.now()									// call the function with the given arguments now
//			delayed.stop()									// this will cancel the scheduled function
//
//		In one-liner format
//
//			new doDelay(func, args).byTime(5)				// calls function with arguments (array) after 5 seconds
//
//
//
// stopAllDelays() : DoDelay array
//	Instantly stops all delays created using 'DoDelay'. This is useful if you want to create a quick reset function for your lens without managing all the created delays throughout your project.
//
//
//
// -
//
//
// instSound(audioAsset [Asset.AudioTrackAsset], volume (optional) [number], fadeInTime (optional) [number], fadeOutTime (optional) [number], offset (optional) [number], mixToSnap (optional) [bool]) : AudioComponent
// 	Plays a sound on a new (temporary) AudioComponent, which allows multiple plays simultaneously without the audio clipping when it restarts.
// 	This function returns the AudioComponent! But be careful, the instance of this component will be removed when done playing
//
//
//
// stopAllSoundInstances() : AudioComponent array
// 	Instantly stops all sound instances created using 'instSound'. This is useful if you want to create a quick reset function for your lens without managing all the created sounds throughout your project.
//
//
//
// -
//
//
// InstSoundPooled(listOfAssets [List of Asset.AudioTrackAsset], poolSize [number], waitTime (optional) [number]) : InstSoundPooled Object
// 	Create a pool of audio components, one component for each given asset, times the size of the pool (so the total size is listOfAssets.length * poolSize).
//	This function does essentially the same as 'instSound', except in a much more performant way when playing lots of sounds (poolSize determines the amount of overlap allowed before looping back to the start of the pool).
//	The 'waitTime', if given, makes sure the next sound instance can only be played after this many seconds, to prevent too many overlaps. This is useful when making a bouncing sound for physics objects.
//
//	The 'instance' function has two optional arguments: the first is the index of the sound to be played (a random index is picked if it is null). The second is the volume (0-1 number).
//
//		For example, if you want to randomly pick laser sounds coming from a gun.
//		The following parameters give it a maximum of 10 plays, with 0.2 seconds inbetween, before looping back to the first sound component:
//
//			var soundPool = new InstSoundPooled( [script.laserSound1, script.laserSound2, script.laserSound3], 10, 0.2 )
//			function onFiringLaser(){
//				soundPool.instance() 	// call 'onFiringLaser()' whenever you want to hear one of the laser sound samples!
//			}
//
//
//
// -
//
//
// clamp(value [number], low (optional, default 0) [number] ), high (optional, default 1) [number] ) : number
// 	Returns the clamped value between the low and high values.
//
//
//
// -
//
//
// randSeed(seed [int]) : number
// 	Returns a random value (0-1) based on an input seed. Uses mulberry32.
//
//
//
// randInt(min [int], max [int]) : number
// OR
// randInt(array [size 2]) : number
//	Returns a random rounded integer between min and max (inclusive).
//	The two arguments can be replaced by a single array argument, for example [0, 10] for a random int between 0-10.
//
//
//
// randFloat(min [number], max [number]) : number
// OR
// randFloat(array [size 2]) : number
//	Returns a random number within a range min (inclusive) and max (exclusive).
//	The two arguments can be replaced by a single array argument, for example [0, 1] for a random value between 0-1.
//
//
//
// randArray(array [Array]) : Object
//	Returns one random object from the given array
//
//
//
// pickRandomDistributed(objects [Object]) : Object
// 	Picks one of the items in an object, and looks at the item's property called 'chance' to determine the odds of the one to pick.
//	Provide it with an object looking like the example below.
//	The 'chance' properties don't have to add up to 1! Their values are normalized before picking a random index.
//
//		var list = {
//			item1 : {name:'item1', chance:0.1}, // this item has a 10% chance of being chosen
//			item2 : {name:'item2', chance:0.6}, // 60% chance
//			item3 : {name:'item3', chance:0.3}, // 30% chance
//		}
//		var picked = pickRandomDistributed(list)
//		picked.name == 'item1', 'item2' or 'item3', based on chance
//
//
//
// -
//
//
// remap(value [number], low1 [number], high1 [number], low2 (optional, default 0) [number], high2 (optional, default 1) [number], clamped (optional, default false) [Bool]) : number
// 	Returns value remapped from range low1-high1 to range low2-high2.
//
//
//
// centerRemap(value [number], center (optional, default 0.5) [number], width (optional, default 0) [number]) : Object
//	Remaps the value (0-1) to 0-1-0, with a custom center and a width for the center.
//	Returns an object containing 'remapped' [number] and 'passedCenter' [int] (0=not passed, 1=within center width, 2=after center).
//
//
// -
//
//
// encodeFloat(data [number], min [number], max [number]) : vec4
// 	Equivalent of the 'Pack' node in the material graph editor (32-bits).
//
//
//
// decodeToFloat(encoded data [vec4], min [number], max [number]) : number
// 	Equivalent of the 'Unpack' node in the material graph editor (32-bits).
//
//
//
// -
//
//
// screenToScreenTransform(screenPos [vec2]) : vec2
// 	Returns ScreenTransform anchor center position (range -1 - 1) from screen coordinates (0-1, inversed y-axis).
//	Inverse of scrTransformToScreen().
//
//
//
// screenTransformToScreen(screenTransformCenter [vec2]) : vec2
// 	Returns screen coordinates (range 0-1) of Screen Transform anchors center.
//	Inverse of screenToScrTransform().
//
//
//
// -
//
//
// shuffleArray(array [array]) : array
// 	Returns a randomly shuffled copy of the array.
//
//
//
// concatArrays(array [any], array [any]) : array
// 	Concatinates two arrays and returns the new one.
//
//
//
// -
//
//
// MovingAverage() : MovingAverage Object
// 	An object that makes it easy to keep track of a 'rolling' average.
//
//		Example, showing all properties
//
//			var avg = new movingAverage()
//			avg.add(v)									// usually the only thing you need, returns the new average and updates the sampleCount.
//			avg.average									// gets/sets the current average value (usually read-only, but in some cases you might want to set this to a starting value)
//			avg.sampleCount 							// gets/sets the current sample count value (usually read-only, but in some cases you might want to set this to a starting value)
//			
//
//
// -
//
//
// PerformanceStopwatch() : PerformanceStopwatch object
// 	Debugging tool. Prints precise time measures to see how well a function performs. Has built-in rolling average!
//
//		Example, showing all properties
//			var stopwatch = new PerformanceStopwatch()		// create new PerformanceStopwatch object
//			stopwatch.start()								// starts the stopwatch
//			// < do something to measure on this line >
//			stopwatch.stop()								// stops the stopwatch, prints the result (and a rolling average of previous results) to the console
//
//
// -
//
//
//
// setAllChildrenToLayer(sceneObj [sceneObject], layer [LayerSet])
// 	Sets the sceneObject and all objects underneath it to a specific render layer (by LayerSet).
//
//
//
// -
//
//
// rotateCoords(point [vec2], pivot [vec2], angle [number]) : vec2
// 	Rotate a 2D point around a pivot with specified angle (radians). Returns new 2D position.
//
//
//
// -
//
//
// circularDistance(a [number], b [number], mod [number]) : number
// 	Returns the closest distance from a to b if the number line is a circle with radius 'mod'. For example: if mod is 1, the distance between 0.9 and 0.1 would be 0.2.
//
//
//
// -
//
//
// mod(a [number], b [number]) : number
// 	Modulo, like the % operator, but this respects negative numbers.
//	For example, mod(-1, 3) returns 2. Whereas -1%3 would return -1.
//
//
//
// -
//
//
// measureWorldPos(screenPos [vec2], screenTrf [Component.ScreenTransform], cam [Component.Camera], dist [number]) : vec3
// 	Returns the world position of a [-1 - 1] screen space coordinate, within a screen transform component, at a distance from the camera.
//	Useful, for example, to measure out where to place a 3D model in the Safe Region, so it won't overlap with Snapchat's UI.
//
//
//
// -
//
//
// getAllComponents(componentName (optional) [string], startObj (optional) [SceneObject], dontIncludeStartObj (optional) [bool], maxCount (optional) [number]) : Array (Components)
// 	Returns an array containing all components of type componentNames, also those on child objects.
//	If no componentName is given, it returns SceneObjects instead.
//	If no startObj is given, it searches the whole scene.
//	If dontIncludeStartObj is true, the startObj will not be included in the final list.
//  If maxCount is given, the search stops after having found a specific amount of components.
//
// 		Example
//			var components = getAllComponents("Component.VFXComponent")
//				components == [Array of all VFX Component in the scene]
//
//
//
// -
//
//
// parseNewLines(txt [string], customSplit (optional) [string]) : string
// 	Takes a string passed in through an input string field containing '\n', and returns the same string but with real newlines (for use in a Text Component, for example).
//	If customSplit is given, it replaces the '\n'-lookup with other character(s).
//
//
//
// pad(num [number], size [number]) : string
// 	Takes a number and a padding amount, and returns a padded string of the number.
//
//		Example
//			var s = pad(30, 4)
//				s == "0030"
//
//
//
// -
//
//
// median(arr [Array]) : number
//	Takes an array of Numbers, and returns the median value.
//
//
//
// -
//
//
// lookAtUp(posA [vec3], posB [vec3], offset) : quat
//	Takes two positions, returns the look-at rotation for A to look at B with the Y axis locked.
//	Useful when objects have to face the user, but they are not allowed to rotate facing up or down.
//	Use the optional 'offset' for a 0 - 2PI rotation offset.
//
//
//
// -
//
//
// mat4FromDescription(matDescription [string]) : mat4
//	Returns a mat4, based on a mat4's string description. Useful when trying to retrieve one stored as JSON format.
//
//
//
// -
//
//
// wrapFunction(originalFunction [function], newFunction [function]) : function
//	Wrap two functions into one. Works with arguments.
//
//
//
// makeSignal(callback [function]) : object
//	Makes a function into a signal that you can bind functions to. Returns an object containing a 'callback', an 'add' and a 'remove' function.
//	Bind using 'add' and 'remove', and call the 'callback' to execute.
//
//	Example
// 		script.signal = makeSignal(); 								// in another script, bind a function using 'script.signal.add(function)' or 'script.signal.remove(function)'
// 		if(somethingHappens) script.signal.callback(args);
//
//
//
// -
//
//
// VisualizePoints() : VisualizePoints object
//	An instanced function that places a mesh on each point in the given array. Useful for quick visualization of 3D points in your scene.
//	For a one-liner (optional), pass the array of points as the first argument.
//
//		Points can be defined in 3 ways: positions (vec3), Objects (position, rotation, scale, text label), or transformation matrices (mat4)
//			points = [ vec3 ]
// 			points = [ {position: vec3, (optional) rotation: quat, (optional) scale: vec3, (optional) label: string} ]
// 			points = [ transform (mat4) ]
//
//		Example, showing all properties
//
//			var v = new VisualizePoints(points))						// create instance ('points' argument is optional, this will invoke .show(points) right away)
//			v.parent													// (optional) SceneObject to parent the points to (default is LSQS' SceneObject)
//			v.scale														// (optional) scale multiplier for the mesh when created (vec3)
//			v.material													// (optional) the material on the mesh (Asset.Material)
//			v.mesh														// (optional) the mesh to show on each point (Asset.RenderMesh, default is a unit box)
//			v.maxCount													// (optional) maximum amount of points to show, starts cutting off indices at 0 (default is null for unlimited)
//			v.show(points)												// show an array of points, returns the array of created SceneObjects for further customization
//			v.getTransforms()											// get an array of transform components
//			v.clear()													// destroy all objects
//
//
//
// -------------------




// access
global.lsqs = script;




// --- Tween functions
// Tween.js - Licensed under the MIT license
// https://github.com/tweenjs/tween.js
// See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.

var EaseFunctions = {
	Linear: {
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
			return k == 0 ? 0 : Math.pow(1024, k - 1);
		},
		Out: function (k) {
			return k == 1 ? 1 : 1 - Math.pow(2, - 10 * k);
		},
		InOut: function (k) {
			if (k == 0) {
				return 0;
			}
			if (k == 1) {
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
			if (k == 0) {
				return 0;
			}
			if (k == 1) {
				return 1;
			}
			return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
		},
		Out: function (k) {
			if (k == 0) {
				return 0;
			}
			if (k == 1) {
				return 1;
			}
			return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
		},
		InOut: function (k) {
			if (k == 0) {
				return 0;
			}
			if (k == 1) {
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
			return 1 - EaseFunctions.Bounce.Out(1 - k);
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
				return EaseFunctions.Bounce.In(k * 2) * 0.5;
			}
			return EaseFunctions.Bounce.Out(k * 2 - 1) * 0.5 + 0.5;
		}
	}
};
global.EaseFunctions = EaseFunctions;

// ---




global.interp = function(startValue, endValue, t, easing, unclamped){
	// set defaults
	if(typeof easing == 'undefined'){ // if no easing, do simple linear remap (lerp)
		return clamp(t) * (endValue-startValue) + startValue;
	}else if(typeof easing !== 'function'){
		throw new Error('No valid Easing Function given for interp!');
	}

	// don't overshoot
	if(!unclamped) t = clamp(t);

	// ease and remap
	return easing(t) * (endValue-startValue) + startValue;
}



var animateProperties = []; // keep a list of all instances
global.AnimateProperty = function(updateFunction){
	var self = this;

	/**
	 * @type {Function} 
	 * @description Function to call on animation start. */
	this.startFunction = function(){};

	/**
	 * @type {Function}
	 * @description Function to call on each animation frame, with animation value (0-1) as its first argument. The second argument is the linear animation value. These ranges are exclusive for the first step, and inclusive for the last step of the animation (so when playing in reverse, the range becomes (1, 0]). */
	this.updateFunction = updateFunction ? updateFunction : function(v, vLinear){};

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
	 * @type {Number}
	 * @description Delay after starting animation on reverse. Default is same as delay. */
	this.reverseDelay;

    /**
	 * @type {Function}
	 * @description Determines curve. Default is EaseFunctions.Cubic.InOut. */
	this.easeFunction = EaseFunctions.Cubic.InOut;

	/**
	 * @type {Function}
	 * @description Determines curve on reverse. If none is given, it uses the same as easeFunction. */
	this.reverseEaseFunction;

	/**
	 * @type {Function} 
	 * @argument {Number} newTimeRatio
	 * @description Updates the animation once, stops the currently running animation. Sets the time value to newTimeRatio (linear 0-1). */
	this.pulse = function(newTimeRatio){
		stopAnimEvent();
		timeRatio = reversed ? 1-newTimeRatio : newTimeRatio; // reset animation time
		setValue(getInterpolated());
	}

	/**
	 * @type {Number} 
	 * @description The current linear normalized animation time, 0-1. */
	this.getTimeRatio = function(){
		var reversedTimeRatio = reversed ? 1-timeRatio : timeRatio;
		return clamp(reversedTimeRatio);
	}

	/**
	 * @type {Function} 
	 * @description If reversed, the animation plays backwards. 'Reverse' arg should be of type Bool. */
	this.setReversed = function(reverse){
		if(typeof reverse == 'undefined'){ // toggle reverse if no argument given
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
	 * @type {Boolean} 
	 * @description Returns true if the animation is currently playing. */
	this.setCallbackAtTime = function(v, f){
		callbackAtTime = {
			v : v,
			f : f,
			called : false,
		}
	}

	/**
	 * @type {Function} 
	 * @argument {Number} atTime
	 * @description Starts the animation. Resumes where last play ended, starts from beginning if last play was finished. Optional 'atTime' argument starts at linear 0-1 time ratio. Optional skipDelay bool skips the delay on this animation. */
	this.start = function(newTimeRatio, skipDelay){
		stopDelayedStart();

		function begin(){
			if(newTimeRatio != null){ // custom time ratio given
				self.pulse(newTimeRatio);
			}else{
				// pulse first frame of animation already, next frame the animation event will take over
				if(self.getTimeRatio() == 1){
					self.pulse(0);
				}else{
					self.pulse(self.getTimeRatio());
				}
			}
			updateDuration();
			startAnimEvent();
			if(self.startFunction) self.startFunction();
		}

		var delay = self.delay;
		if(reversed && typeof(self.reverseDelay) != 'undefined') delay = self.reverseDelay; // if reverse, use custom delay (if any)
		if(!skipDelay && delay > 0){ // start after delay (if any)
			delayedStart = new global.DoDelay(begin)
			delayedStart.byTime(delay);
		}else{
			begin();
		}

		// force isPlaying to true (delayed animation also counts as playing)
		isPlaying = true;
	}
	
	/**
	 * @type {Function} 
	 * @description stop the animation at its current time. With an optional argument to call the endFunction (argument should be a bool, default is false). */
	this.stop = function(callEndFunction){
		stopAnimEvent();
		if(callEndFunction) self.endFunction();
	}


	// private

	var animEvent;
	var reversed = false;
	var isPlaying = false;
	var delayedStart;
	var duration;
	var timeRatio = 0;
	var callbackAtTime = {
		v : null,
		f : null,
		called : false,
	}

	function setValue(v, lastFrame){
		self.updateFunction(v, lastFrame ? v : timeRatio); // on last frame, take animation end value
	}

	function updateDuration(){
		duration = reversed ? (typeof self.reverseDuration == 'number' ? self.reverseDuration : self.duration) : self.duration; // set duration, checks if reversed is unique otherwise uses forward duration
	}
	
	function animation(){
		if(!animEvent) return; // if update event was already stopped, prevent this function from being run again

		if(duration == 0){ // if instant
			timeRatio = reversed ? 0 : 1; // set to limit of allowed range to make the animation stop right away (1 tick of update function will be sent)
		}else{
			var dir = reversed ? -1 : 1;
			timeRatio += (getDeltaTime() / duration) * dir;
			timeRatio = clamp(timeRatio); // when a frame takes really long to load, the animation could get weird if this is not clamped
		}
		if(reversed ? (timeRatio <= 0) : (timeRatio >= 1)){ // on last step
			setValue(reversed ? 0 : 1, true);
			self.stop(true);
			return;
		}else{ // on animation step
			var v = getInterpolated();
			setValue(v);
		}

		if(!callbackAtTime.called && callbackAtTime.v && callbackAtTime.f){
			if(reversed){
				if(timeRatio <= callbackAtTime.v){
					callbackAtTime.called = true;
					callbackAtTime.f();
				}
			}else{
				if(timeRatio >= callbackAtTime.v){
					callbackAtTime.called = true;
					callbackAtTime.f();
				}
			}
		}
	}

	function getInterpolated(){
		var easeFunction = self.easeFunction;
		if(reversed && self.reverseEaseFunction) easeFunction = self.reverseEaseFunction; // if reverse, use custom ease function (if any)
		return global.interp(0, 1, timeRatio, easeFunction);
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

		// reset callback
		callbackAtTime.called = false;
	}

	function stopDelayedStart(){
		if(delayedStart){
			delayedStart.stop();
			delayedStart = null;
		}
	}

	animateProperties.push(this);
}




global.getAllAnimateProperty = function(){
	return animateProperties;
}




global.degToRad = function(degrees){
	if(typeof degrees == 'number'){
		return degrees * Math.PI/180;
	}else{ // assume vec3 if not number
		var _x = degrees.x * Math.PI/180;
		var _y = degrees.y * Math.PI/180;
		var _z = degrees.z * Math.PI/180;
		return new vec3(_x, _y, _z);
	}
}




global.radToDeg = function(radians){
	if(typeof radians == 'number'){
		return radians * 180/Math.PI;
	}else{ // assume vec3 if not number
		var _x = radians.x * 180/Math.PI;
		var _y = radians.y * 180/Math.PI;
		var _z = radians.z * 180/Math.PI;
		return new vec3(_x, _y, _z);
	}
}




global.isInFront = function(pos1, pos2, fwd){
	var target = new vec3(pos2.x - pos1.x,
						  pos2.y - pos1.y,
						  pos2.z - pos1.z);
	target = target.normalize();
	var dir = target.dot(fwd);
	return dir < 0;
}




global.pointInBox = function(point, unitBoxTrf, getRelativePosition){
	var center = unitBoxTrf.getWorldPosition();
	var worldScale = unitBoxTrf.getWorldScale();
	var rotation = unitBoxTrf.getWorldRotation();

	var localPoint = point.sub(center);
	var inverseRotation = mat4.fromRotation(rotation.invert());
	var rotatedPoint = inverseRotation.multiplyPoint(localPoint);

	var isInside = (
		Math.abs(rotatedPoint.x) <= worldScale.x/2 &&
		Math.abs(rotatedPoint.y) <= worldScale.y/2 &&
		Math.abs(rotatedPoint.z) <= worldScale.z/2
  	);

	return {
		isInside : isInside,
		relativePosition : !getRelativePosition ? null : new vec3(
			(rotatedPoint.x / worldScale.x) * 2,
			(rotatedPoint.y / worldScale.y) * 2,
			(rotatedPoint.z / worldScale.z) * 2
		)
	}
}




global.planeRay = function(point, dir, planePos, planeFwd){
	var denom = planeFwd.dot(dir);
	if(Math.abs(denom) < 1e-6) return; // ray is parallel to plane

	var t = (planePos.sub(point)).dot(planeFwd) / denom;
	if(t >= 0) return point.add(dir.uniformScale(t));
}




global.projectPointToPlane = function(point, planePos, planeFwd, planeScale) {
    var relativePosition = point.sub(planePos);
    var projection = planeFwd.uniformScale(planeFwd.dot(relativePosition))
    var positionInPlane = relativePosition.sub(projection);
    
    var right = new vec3(-planeFwd.z, 0, planeFwd.x).normalize();
    var up = right.cross(planeFwd).normalize();

    var xProjectionLength = positionInPlane.dot(right);
    var yProjectionLength = positionInPlane.dot(up);
    
    var uv = new vec2(
        1 - ((xProjectionLength / planeScale.x) + 0.5),
        (yProjectionLength / planeScale.y) + 0.5
    );
    
    return uv;
}




global.distanceAlongVector = function(pos1, pos2, fwd){
	var dir = pos2.sub(pos1);
	return dir.dot(fwd);
}




global.hsvToRgb = function(h, s, v){
	h = h % 1;
	s = clamp(s);
	v = clamp(v);
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




global.rgbToHsv = function(rgb){
	var r = clamp(rgb.x);
	var g = clamp(rgb.y);
	var b = clamp(rgb.z);

	var v = Math.max(r, g, b)
	var n = v - Math.min(r,g,b);
	var h = n && ( (v == r) ? (g - b) / n : ( (v == g) ? 2 + (b - r) / n : 4 + (r - g) / n) );
	
	return new vec3( 60 * (h < 0 ? h + 6 : h) / 360,
					 v && n / v,
					 v);
}




var allDelays = []; // keep a list of all instances
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

		var wait = n == undefined ? 1 : Math.round(n); // if no arg n given, do on next frame, otherwise round n to whole frames for delay time
		function onUpdate(){
			if(wait <= 0){
				script.removeEvent(waitEvent);
				keepAlive.exec();
			}
			wait--;
		}

		stopWaitEvent();

		if(wait == 0){ // instant if n is 0
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
		if(wait == 0 || wait == undefined){
			keepAlive.exec();
		}else{
			waitEvent = script.createEvent("DelayedCallbackEvent");
			waitEvent.bind(keepAlive.exec.bind(keepAlive));
			waitEvent.reset(wait);
		}
	}

	/**
	 * @type {Function}
	 * @description Call the function now. */
	this.now = function(){
		const keepAlive = {
			exec: function(){
				var _args = self.args;
				self.func.apply(null, _args);
			}
		}
		keepAlive.exec();
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




global.stopAllDelays = function(){
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

	if(volume == 0 || volume) audioComp.volume = volume;
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
		new global.DoDelay(function(){
			if(audioComp && !isNull(audioComp)) audioComp.destroy(); // destroy if it still exists (might have been deleted using stopAllSoundInstances)
		}).byFrame(); // delete on next frame
	}
	new global.DoDelay( destroyAudioComponent, [audioComp]).byTime(audioComp.duration + .1); // stop playing after audio asset duration

	allSoundInstances.push(audioComp);
	return audioComp;
}




global.stopAllSoundInstances = function(){
	for(var i = 0; i < allSoundInstances.length; i++){
		var soundInstance = allSoundInstances[i];
		if(soundInstance && !isNull(soundInstance)){
			soundInstance.stop(false);
			soundInstance.destroy();
		}
	}
	return allSoundInstances;
}




global.InstSoundPooled = function(listOfAssets, poolSize, waitTime){
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
	this.instance = function(indexToPlay, volume){
		if(waitTime != null){
			if(lastTime == null){
				lastTime = getTime()-waitTime-1; // first shot is always allowed
			}else{
				if(getTime() - lastTime < waitTime) return;
				lastTime = getTime();
			}
		}

		if(indexToPlay == null) indexToPlay = Math.floor(Math.random() * listOfAssets.length); // if no index is given, pick at random
		var component = pool[poolIndex][indexToPlay];
		component.volume = volume ? volume : 1;
		component.play(1);

		// increment
		poolIndex++;
		if(poolIndex >= pool.length) poolIndex = 0;
	}
}




global.clamp = function(value, low, high){
	if(!low && low !== 0) low = 0; // assume low, high to be 0, 1 if not given
	if(!high && high !== 0) high = 1;
	return Math.max(Math.min(value, Math.max(low, high)), Math.min(low, high));
}




global.randSeed = function(seed){
	var t = seed += 0x6D2B79F5;
	t = Math.imul(t ^ t >>> 15, t | 1);
	t ^= t + Math.imul(t ^ t >>> 7, t | 61);
	return ((t ^ t >>> 14) >>> 0) / 4294967296;
}




global.randInt = function(min, max){
	var _min = min;
	var _max = max;
	if(typeof min != 'number'){
		_min = min[0];
		_max = min[1];
	}
    _min = Math.ceil(_min);
    _max = Math.floor(_max);
    return Math.floor(Math.random() * (_max - _min + 1)) + _min;
}




global.randFloat = function(min, max){
	if(typeof min != 'number') return remap(Math.random(), 0, 1, min[0], min[1]); // assume array instead of numbers
    return remap(Math.random(), 0, 1, min, max);
}




global.randArray = function(array){
	return array[Math.floor(Math.random()*array.length)];
}




global.pickRandomDistributed = function(obj){
	var totalChance = 0;
	var keys = Object.keys(obj);
	for(var i = 0; i < keys.length; i++) {
		totalChance += obj[keys[i]].chance;
	}
	var rand = Math.random() * totalChance;
	
	var sum = 0;
	for(var key in obj) {
		var item = obj[key];
		sum += item.chance;
		if(rand < sum) return item;
	}
}




global.remap = function(value, low1, high1, low2, high2, clamped){
	low2 = low2 == null ? 0 : low2;
	high2 = high2 == null ? 1 : high2;
	var remapped = low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	return clamped ? clamp(remapped, low2, high2) : remapped;
}




global.centerRemap = function(value, center, width){
	if(center == null && width == null){ // simple 0-1-0 remap
		const remapped = value < .5 ? value*2 : 1-((value-.5)*2);
		const passedCenter = (value > .5) * 2; // 0 or 2 are only possible outcomes
		return {remapped:remapped, passedCenter:passedCenter};
	}
	if(center == null) center = .5;
	if(width == null) width = 0;
    const halfWidth = width/2;
    const left = center - halfWidth;
    const right = center + halfWidth;
    const remapped = value < left ? remap(value, 0, left) : value > right ? remap(value, right, 1, 1, 0) : 1;
    const passedCenter = value < left ? 0 : value < right ? 1 : 2;
    return {remapped:remapped, passedCenter:passedCenter};
}




// --- Material Graph Pack/Unpack
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
	
	if (raw.w == undefined) {
		var a = [raw.x,raw.y, raw.z].map(function(v) {
			return Math.floor(v * 65025 + 0.5) /65025; 
		});
		v = new vec4(a[0], a[1], a[2], 0);
	}

	return v.dot(MIN_POS_BITS_TO_FLOAT_CONSTANT);
}

global.encodeFloat = function(value, min, max) {
	return floatToBits(remap(clamp(value, min, max), min, max, 0.0, ENCODE_MAX_VALUE));
}

global.decodeToFloat = function(value, min, max) {
	return remap(bitsToFloat(value), 0.0, ENCODE_MAX_VALUE, min, max);
}

// ---




global.screenToScreenTransform = function(screenPos){
	return new vec2( (screenPos.x - .5)*2,
					 (1-screenPos.y - .5)*2);
}




global.screenTransformToScreen = function(screenTransformCenter){
	return new vec2( screenTransformCenter.x/2 + .5,
					 1-(screenTransformCenter.y/2 + .5) );
}




global.shuffleArray = function(array) {
	var shuffledArray = array.slice();

	for (var i = shuffledArray.length - 1; i > 0; i--){
		var j = Math.floor(Math.random() * (i + 1));
		[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
	}

	return shuffledArray;
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
		if(self.average == null){
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
		if(this.sampleCount == 0) return null; // no values yet, so no valid average can be given
		var newAvg = ((self.average*(self.sampleCount-1)) + newValue)/self.sampleCount;
		return newAvg
	}
}




global.PerformanceStopwatch = function(){
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
		print('duration: ' + diff.toString() + '\n' + 'rolling avg: ' + thisAvg.toString());
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
		const m = Math.abs(a)%b;
		if(m == 0) return 0;
		return b-m;
	}
}




global.measureWorldPos = function(screenPos, screenTrf, cam, dist){
	var pos2D = screenTrf.localPointToScreenPoint(screenPos);
	return cam.screenSpaceToWorldSpace(pos2D, dist);
}




global.getAllComponents = function(componentName, startObj, dontIncludeStartObj, maxCount){
    var found = [];
    if(maxCount == null) maxCount = Infinity;

    function scanSceneObject(obj){
		if(dontIncludeStartObj && obj.isSame(startObj)) return;

		// sceneobject instead of component
		if(!componentName){
			found.push(obj);
			return;
		}

		// get all components on this sceneobject
		var comps = obj.getComponents(componentName);
		for(var j = 0; j < comps.length; j++){
			found.push(comps[j]);
            if(found.length >= maxCount) return;
		}
    }

    function iterateObj(obj){
        for(var i = 0; i < obj.getChildrenCount(); i++){
            var child = obj.getChild(i);
            scanSceneObject(child);
            if(found.length >= maxCount) return;
			iterateObj(child);
        }
    }

	if(startObj){ // start at specific object if it exists
		if(isNull(startObj)) return found; // no starting object, return empty list
		scanSceneObject(startObj);
        if(found.length >= maxCount.length) return found;
		iterateObj(startObj);
	}else{ // go through whole scene
		var rootObjectsCount = global.scene.getRootObjectsCount();
		for(var i = 0; i < rootObjectsCount; i++){
			var rootObj = global.scene.getRootObject(i);
			scanSceneObject(rootObj);
            if(found.length >= maxCount) return found;
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




global.pad = function(num, size){
	var paddedString = num.toString();
	while(paddedString.length < size){
		paddedString = '0' + paddedString;
	}
	return paddedString;
}




global.median = function(arr){
	if(arr.length == 0) return;
	if(arr.length == 1) return arr[0];
	var clone = [];
	for(var i = 0; i < arr.length; i++){
		clone[i] = arr[i];
	}
    clone.sort(function(a, b){return a - b});
    var c = Math.floor(clone.length/2);
    return clone.length % 2 != 0 ? clone[c] : (clone[c - 1] + clone[c]) / 2;
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
    return function() {
        var args = Array.prototype.slice.call(arguments);
        if (originalFunction) originalFunction.apply(this, args);
        newFunction.apply(this, args);
    };
};




global.makeSignal = function(){
	var callbacks = [];
	function add(f){
		callbacks.push(f);
	}
	function remove(f){
		for(let i = callbacks.length - 1; i >= 0; i--){
			if(callbacks[i] === f){
				callbacks.splice(i, 1);
			}
		}
	}
	function callback(...args){
		for(var i = 0; i < callbacks.length; i++){
			callbacks[i](...args);
		}
	}
	return {add, remove, callback};
}




global.VisualizePoints = function(showPointsOnStart){
	var self = this;

	/**
	 * @type {SceneObject}
	 * @description (optional) SceneObject to parent the points to (default is LSQS' SceneObject) */
	this.parent = script.getSceneObject();

	/**
	 * @type {vec3}
	 * @description (optional) scale multiplier for the mesh when created (vec3) */
	this.scale;

	/**
	 * @type {Material}
	 * @description (optional) the material on the mesh (Asset.Material) */
	this.material;

	/**
	 * @type {Asset.RenderMesh}
	 * @description (optional) the mesh to show on each point (Asset.RenderMesh, default is a unit box) */
	this.mesh;

	/**
	 * @type {Number}
	 * @description (optional) maximum amount of points to show, starts cutting off indices at 0 (default is null for unlimited) */
	this.maxCount;

	/**
	 * @type {Function}
	 * @description show an array of points, returns the array of created SceneObjects for further customization */
	this.show = function(allPoints){
		// remove existing
		self.clear();

		if(allPoints.length == 0) return;
		var points = [...allPoints]; // make copy of list
		if(self.maxCount != null){
			if(allPoints.length > self.maxCount){
				points = allPoints.slice(-self.maxCount);
			}
		}

		const pointType = getPointType(points[0]); // get point type (string: vec3, object, mat4)

		// add new
		for(var i = 0; i < points.length; i++){
			// get this point (could be vec3, object, or mat4)
			const p = points[i];
			
			// create mesh
			var obj = global.scene.createSceneObject("point " + i.toString());
			obj.setParent(self.parent);
			var rmv = obj.createComponent("Component.RenderMeshVisual");
			rmv.mesh = self.mesh ? self.mesh : cube;
			if(self.material) rmv.addMaterial(self.material);

			// set transform
			var trf = obj.getTransform();
			if(pointType == 'vec3'){ // position only
				trf.setWorldPosition(p);
				trf.setWorldRotation(quat.quatIdentity());
				trf.setWorldScale(self.scale ? self.scale : vec3.one());
			}else if(pointType == 'object'){ // position, rotation, scale manual object
				trf.setWorldPosition(p.position);
				if(p.rotation != null) trf.setWorldRotation(p.rotation);
				if(p.scale == null){
                    trf.setWorldScale(self.scale != null ? self.scale : vec3.one());
                }else{
                    trf.setWorldScale(self.scale != null ? p.scale.mult(self.scale) : p.scale);
                }
                if(p.label != null) setLabel(p, obj);
			}else{ // world transform
				trf.setWorldTransform(p);
				if(self.scale) trf.setWorldScale(trf.getWorldScale().mult(self.scale));
			}

			// register
			allSceneObjects.push(obj);
			allTransforms.push(trf);
		}

		return allSceneObjects;
	};



	/**
	 * @type {Function}
	 * @description get all objects' transform components (<Transform> array) */
	this.getTransforms = function(){
		return allTransforms;
	}



	/**
	 * @type {Function}
	 * @description destroy all objects */
	this.clear = function(){
		// delete objects
		for(var i = 0; i < allSceneObjects.length; i++){
			allSceneObjects[i].destroy();
		}

		// reset lists
		allSceneObjects = [];
		allTransforms = [];
	}



	// private
	var allSceneObjects = [];
	var allTransforms = [];
	const cube = function(){ // generate cube mesh (once on start)
		// simple cube with texture and normals
		var builder = new MeshBuilder([
			{name: "position", components: 3},
			{name: "normal", components: 3, normalized: true},
			{name: "texture0", components: 2},
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

		// return mesh only
		builder.updateMesh();
		return builder.getMesh();
	}();



	// creates label on top of rendered point
	function setLabel(point, obj){
		var txtComp = obj.createComponent("Component.Text");
		txtComp.getMaterial(0).mainPass.twoSided = true;
		txtComp.text = point.label;
	}



	// returns 'vec3', 'object' or 'mat4' depending on type
	function getPointType(p){
		if(p.x != null) return 'vec3';
		if(p.position != null) return 'object';
		return 'mat4';
	}



	// start right away if array given
	if(showPointsOnStart) self.show(showPointsOnStart);
}
//@ui {"widget":"label"}
//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"<big><b>📜 LSQuickScripts 2.31</b> <small>by Max van Leeuwen"}
//@ui {"widget":"label", "label":"See this script for more info!"}
//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"<small><a href=\"https://www.maxvanleeuwen.com/lsquickscripts\">maxvanleeuwen.com/LSQuickScripts</a>"}
//@ui {"widget":"separator"}
//@ui {"widget":"label"}



// Max van Leeuwen
//  maxvanleeuwen.com



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
//
// lsqs : Script Component
//  Returns the Script component this script is on.
//
//
//
// -
//
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
// -
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
// -
//
//
//
// AnimateProperty() : AnimateProperty object
// 	Creates an easy-to-use animation instance. Can be used to quickly animate any property, using just a couple lines of code!
//
//		Example, showing all possible properties
//
//			var anim = new AnimateProperty( updateFunction (optional) )		// create a new animation instance called 'anim'
//			anim.startFunction = function(inAnim){}							// called on animation start ('inAnim' is a bool, true when getReversed() is false)
//			anim.updateFunction = function(v, vLinear, runtime){}			// called on each animation frame, with animation value (0-1) as its first argument. the second argument is the linear animation value. these ranges are exclusive for the first step, and inclusive for the last step of the animation (so when playing in reverse, the range becomes (1, 0]). the third argument is runtime (seconds).
//			anim.endFunction = function(inAnim){}							// called on animation end ('inAnim' is a bool, true when getReversed() is false)
//			anim.onReverseChange = function(){}								// called when the forwards direction of the animation is changed
//			anim.duration = 1												// duration in seconds, default is 1. tip: for a continuous animation, set duration to Infinity and use the 'runtime' argument in the updateFunction
//			anim.reverseDuration = 1										// reverse duration in seconds, default is .duration
//			anim.delay = 0													// delay before starting animation, default is 0
//			anim.reverseDelay = 0											// delay before starting animation when reversed, default is .delay
//			anim.easeFunction = EaseFunctions.Cubic.In						// animation look-up curve, default is EaseFunctions.Cubic.InOut
//			anim.reverseEaseFunction = EaseFunctions.Cubic.Out				// animation look-up curve when reversed, default is .easeFunction
//			anim.pulse(newTimeRatio)										// sets the animation once to this linear time ratio (0-1), stops current animation
//			anim.getTimeRatio()												// get current linear animation time (0-1)
//			anim.setReversed(reverse)										// set animation direction, toggles if no argument given. reverse: 'true' to set to reverse.
//			anim.getReversed()												// returns true if the animation is currently reversed
//			anim.isPlaying()												// returns true if the animation is currently playing (waiting for delay also counts as playing)
//			anim.setCallbackAtTime(v, f)									// registers a callback function on the first frame that v >= t (or v <= t if playing reversed). only 1 callback is supported at this time. call without arguments to clear. v: the linear animation time (0-1) at which to call this callback. f: the function to call.
//			anim.start(atTime, skipDelay)									// start the animation. atTime: (optional) time ratio (0-1) to start playing from. skipDelay: (optional) ignore the delay value.
//			anim.stop(callEndFunction)										// stop the animation. callEndFunction: (optional) whether to call the .endFunction (if animation was still playing), default is false.
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
//	Get a list of all AnimateProperty instances. Useful when you want to forcibly stop all instances running in your lens at once, without keeping track of them.
//
//
//
// -
//
//
//
// QuickFlow(obj [SceneObject]) : QuickFlow object
//	- IN BETA: You might encounter unexpected behavior from time to time.
//	A simple way to animate objects with just a single line of code!
//	All animations work for orthographic and perspective objects.
//	Pass 'undefined' for an argument to use its default value.
//		
//		Example:
//
//			var anim = new QuickFlow(script.object)											// create an instance
//			anim.fadeIn(duration, delay, easeFunction)										// start fade-in (if a visual or text component is present), automatically enables the sceneobject.
//
//
//		All animations and their (optional) arguments:
//
//			.fadeIn(delay, duration, easeFunction)											// start fade-in (enables SceneObject on start)
//			.fadeOut(delay, duration, easeFunction)											// start fade-out (disables SceneObject and all running animations on end)
//			.scaleIn(delay, duration, startAtTime, easeFunction)							// start scale-in (enables SceneObject on start)
//			.scaleOut(delay, duration, startAtTime, easeFunction)							// start scale-out (disables SceneObject and all running animations on end)
//			.squeeze(delay, strength, duration)												// do scale squeeze
//			.rotateAround(delay, rotations, axis, duration, easeFunction)					// do rotational swirl
// 			.scaleTo(delay, toScale, isLocal, duration, easeFunction)						// scale towards new size (overrides other rotation animations)
// 			.moveTo(delay, point, isLocal, duration, easeFunction)							// move towards new position (local screen space if ScreenTransform, world space if Transform) (overrides other position animations)
// 			.keepBlinking(delay, interval, strength, easeFunction)							// keep blinking
//			.lookAt(delay, point, duration, easeFunction)									// rotate to look at a point (local screen space if ScreenTransform, world space if Transform) (overrides other rotation animations)
//			.keepRotating(delay, speed, axis)												// keep rotating around an axis
//			.keepBouncingRotation(delay, strength, interval, axis, easeFunction, smoothIn)	// keep bouncing a rotation around an axis
//			.keepBouncingPosition(delay, distance, interval, axis, easeFunction, smoothIn)	// keep bouncing a position up and down along an axis
//			.keepBouncingScale(delay, strength, interval, easeFunction, smoothIn)			// keep bouncing a scale
// 			.stop(delay)																	// stop all active animations (overrides all other animations)
//			.reset(delay, duration, easeFunction)											// stop and undo all animations, back to original (before animations were applied) (overrides all other animations)
//			.loop	 																		// repeats all animations added so far (no animations can be added after this)
//		
//
//		Each animation returns the same QuickFlow object, so they can be easily chained into one-liners like so:
//		
//			- new QuickFlow(object).rotateAround(0, 1)														// instantly do 1 clockwise rotation
//			- new QuickFlow(object).fadeOut(0, .5).scaleOut(0, .5)											// fade-out and scale-out, for 0.5 seconds
//			- new QuickFlow(object).keepBlinking().squeeze(.5)												// blinking alpha, squeeze after half a second
//			- new QuickFlow(object).moveTo(0, new vec3(0,100,0), 1).reset(1, .6, EaseFunctions.Bounce.Out)	// move 1m up for 1s, after 1s reset (go back down) with a bouncing animation of 0.6s
//			- new QuickFlow(object).moveTo(0, new vec2(0,1), 1).reset(1, .6, EaseFunctions.Bounce.Out)		// same as above, but for objects with a ScreenTransform
//			- new QuickFlow(object).keepBouncingPosition().keepBouncingScale().keepBouncingRotation()		// continuous wiggly animation
//
//
//		Tips:
//			- the first argument of any animation is always 'delay', which has a default value of 0
//			- after the last out-animation stops playing, the SceneObject will automatically be disabled
//			- when chaining animations as a one-liner, it's best to chain them chronologically (so their delay values increase from left to right)
//			- the overruling animations that influence others (e.g. 'reset' or 'stop') only stop the animations starting before them
//
//
//
// -
//
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
//
// isInFront(pos1 [vec3], pos2 [vec3], fwd [vec3]) : bool
// 	Checks if pos1 is in front of pos2, assuming pos2 has normalized forward vector fwd.
//
//
//
// -
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
// -
//
//
//
// planeRay(point [vec3], dir [vec3], planePos [vec3], planeFwd [vec3]) : vec3
//	Checks if a line ('point' with normalized direction 'dir') intersects a plane (position 'planePos' with normal 'planeFwd'). Returns world position (vec3) if it does, returns null otherwise.
//
//
//
// -
//
//
//
// projectPointToPlane(point [vec3], planePos [vec3], planeFwd [vec3], planeScale [vec2]) : vec2
// 	Projects a 3D point onto a plane with custom position, orientation, and non-uniform scale. Returns normalized 2D coordinates on plane at this position.
//
//
//
// -
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
//
// distanceToLine(p1 [vec3], p2 [vec3], point [vec3]) : {dist:number, pos:vec3}
//	Returns info about the position on the line (p1-p2) that's closest to the given point (vec3).
//
//
//
// -
//
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
//			delayed.isWaiting()								// returns true if currently counting down to call the function
//			delayed.createdAtTime							// the time at which this instance was created
//			delayed.getTimeLeft()							// get the time left before the function is called (null if unused)
//			delayed.getFramesLeft()							// the frames left before the function is called (null if unused)
//			delayed.getGivenTime()							// get the amount of time that was last given to wait (null if none yet)
//			delayed.getGivenFrames()						// get the amount of frames that was last given to wait (null if none yet)
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
// instSound(
//			audioAsset [Asset.AudioTrackAsset]
//			volume (optional) [number]
//			fadeInTime (optional) [number]
//			fadeOutTime (optional) [number]
//			offset (optional) [number]
//			mixToSnap (optional) [bool]
// ) : AudioComponent
// 	Plays a sound on a new (temporary) AudioComponent, which allows multiple plays simultaneously without the audio clipping when it restarts.
// 	This function returns the AudioComponent! But be careful, the instance of this component will be removed when done playing.
//	Don't use on Spectacles! There is a limit of 32 components, so you should use InstSoundPooled with a small poolSize instead.
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
//
// InstSoundPooled(listOfAssets [List of Asset.AudioTrackAsset], poolSize [number], waitTime (optional) [number], volume (optional, default 1) [number]) : InstSoundPooled Object
// 	Create a pool of audio components, one component for each given asset, times the size of the pool (so the total size is listOfAssets.length * poolSize).
//	This function does essentially the same as 'instSound', except in a much more performant way when playing lots of sounds (poolSize determines the amount of overlap allowed before looping back to the start of the pool).
//	The 'waitTime', if given, makes sure the next sound instance can only be played after this many seconds, to prevent too many overlaps. This is useful when making a bouncing sound for physics objects.
//	'Volume' Sets the AudioComponent's volume (default is 1).
// 	
//
//	The 'instance' function has two optional arguments: the first is the index of the sound to be played (a random index is picked if it is null). The second is the volume override (0-1 number).
//
//		For example, if you want to randomly pick laser sounds coming from a gun.
//		The following parameters give it a maximum of 10 plays, with 0.2 seconds inbetween, before looping back to the first sound component:
//
//			var soundPool = new InstSoundPooled( [script.laserSound1, script.laserSound2, script.laserSound3], 10, 0.2)
//			function onFiringLaser(){
//				soundPool.instance() 	// call 'onFiringLaser()' whenever you want to hear one of the laser sound samples!
//			}
//
//
//
// -
//
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
//
// randSeed(seed [int]) : number
// 	Returns a random value (0-1) based on an input seed. Uses mulberry32.
//
//
//
// -
//
//
//
// randInt(min [int], max [int]) : number
// OR
// randInt(range [array size 2]) : number
// OR
// randInt(range [vec2]) : number
//	Returns a random rounded integer between min (inclusive) and max (exclusive).
//
//
//
// randFloat(min [number], max [number]) : number
// OR
// randFloat(range [array size 2]) : number
// OR
// randFloat(range [vec2]) : number
//	Returns a random number within a range min (inclusive) and max (exclusive).
//
//
//
// -
//
//
//
// randArray(array [Array]) : Object
//	Returns one random object from the given array
//
//
//
// pickRandomDistributed(objects [Object]) : Object
// 	Picks one of the items in an object, based on the odds of a property called 'chance'!
// 	The 'chance' values are automatically normalized, so they don't need to add up to 1 like in this example.
//
//		var list = {
//			item1 : {name:'item1', chance:0.1}, // this item has a 10% chance of being chosen
//			item2 : {name:'item2', chance:0.6}, // 60% chance
//			item3 : {name:'item3', chance:0.3}, // 30% chance
//		}
//		var picked = pickRandomDistributed(list)
//		picked.name == (randomly picked from list)
//
//
//
// -
//
//
//
// remap(
//		value [number]
//		low1 [number]
//		high1 [number]
//		low2 (optional, default 0) [number]
//		high2 (optional, default 1) [number]
//		clamped (optional, default false) [Bool]
// ) : number
// 	Returns value remapped from range low1-high1 to range low2-high2.
//
//
//
// centerRemap(value [number], center (optional, default 0.5) [number], width (optional, default 0) [number]) : Object
//	Remaps the value (0-1) to 0-1-0, with a custom center and a width for the center.
//	Returns an object containing 'remapped' [number] and 'passedCenter' [int] (0=not passed, 1=within center width, 2=after center).
//
//
//
// -
//
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
//
// normalizeMeshScale(rmv [Component.RenderMeshVisual]) : vec3
//	Get a scale multiplier to make a mesh's local scale 1x1x1 in the largest dimension.
//
//		Example
//
//			const scalar = normalizeMeshScale(script.rmv)
//			script.rmv.getTransform().setLocalScale(scalar)
//
//
//
// -
//
//
//
// shuffleArray(array [array]) : array
// 	Returns a randomly shuffled copy of the array.
//
//
//
// -
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
//
// removeFromArray(item [any, or array of any], array [any]) : array
// 	Removes item (or an array of items) from the given array, returns the resulting array.
//
//
//
// -
//
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
//
// circularDistance(a [number], b [number], mod [number]) : number
// 	Returns the closest distance from a to b if the number line is a circle with radius 'mod'. For example: if mod is 1, the distance between 0.9 and 0.1 would be 0.2.
//
//
//
// -
//
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
//
// getAllComponents(componentName (optional) [string]
//					startObj (optional) [SceneObject]
//					dontIncludeStartObj (optional) [bool]
//					maxCount (optional) [number]
// ) : Array (Components)
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
//
// median(arr [Array]) : number
//	Takes an array of Numbers, and returns the median value.
//
//
//
// -
//
//
//
// lookAtUp(posA [vec3], posB [vec3], offset) : quat
//	Takes two world positions, returns the look-at rotation for A to look at B with the Y axis locked (so only .x and .z are used).
//	Useful when objects have to face the user, but they are not allowed to rotate facing up or down.
//	Use the optional 'offset' for a 0 - 2PI rotation offset.
//
//
//
// -
//
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
//
// wrapFunction(originalFunction [function], newFunction [function]) : function
//	Wrap two functions into one. Works with arguments.
//
//
//
// -
//
//
//
// Callback(callback [function]) : Callback object
//	Makes a callback signal that you can bind functions to. Returns an object.
//
//		Example, showing all properties
//
//			function someFunction(arg1, arg2){} 					// a function to be called at a certain time
//
// 			var c = new Callback()									// create instance
//			c.add(someFunction, noAddedCallback)					// add a function to be called when running this.callback(...args), with optional noAddedCallback (default is false)
//			c.remove(someFunction, noRemovedCallback)				// Remove a callback function (if it was added earlier), with optional noRemovedCallback (default is false)
// 			c.callback(a, b)										// call all functions (any arguments will be passed on)
// 			c.getCallbacks()										// get all callback functions
// 			c.onCallbackAdded										// function called when a callback was added (assign to property)
// 			c.onCallbackRemoved										// function called when a callback was removed (assign to property)
//			c.enabled = true										// when false, callback() will not call anything
//			c.clear()												// clear all callbacks (does not call onCallbackRemoved)
//
//
//
// -
//
//
//
// Flags() : Flags object
//	Creates a flags object that you can assign flags with unique names and boolean values to.
//	Each time a flag is added or modified, a 'state' object is returned in the callback function, giving you information about the combined flags.
//
//		Example, showing all properties
//
// 			var flags = new Flags()											// create instance
//			flags.onChange.add(function(state){ print(state.anyTrue) })		// on flag change, print if any of the flags are true
//			flags.set('flag1', false)										// add a flag called 'flag1', value false		-		callback now prints 'false'
//			flags.getState()												// returns current state object
//			flags.getFlags()												// returns flags object
//			flags.clear()													// clears flags object
//
// 		States object contains the following bools:
// 			anyTrue
// 			allTrue
// 			noneTrue
// 			anyFalse
// 			allFalse
// 			noneFalse
//
//
//
// -
//
//
//
// nullish(a, b) : a ?? b
//	Simple replacement for nullish coalescing operator ('??', useful if this operator doesn't exist)
//
//
//
// -
//
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
//			var v = new VisualizePoints(points)							// create instance ('points' argument is optional, this will invoke .show(points) right away)
//			v.parent													// (optional) SceneObject to parent the points to (default is LSQuickScripts SceneObject)
//			v.scale														// (optional) scale multiplier for the mesh when created (vec3)
//			v.material													// (optional) the material on the mesh (Asset.Material)
//			v.mesh														// (optional) the mesh to show on each point (Asset.RenderMesh, default is a unit box)
//			v.maxCount													// (optional) maximum amount of points to show, starts cutting off indices at 0 (default is null for unlimited)
//			v.show(points)												// show points, returns the array of created SceneObjects
//			v.add(points)												// append to points, returns the total array of SceneObjects
//			v.getTransforms()											// get an array of transform components
//			v.clear()													// destroy all objects
//
//
//
// -
//
//
//
// rankedAction(label [string], prio [number], func [function])
//	Ranked Actions make it easy to compare a bunch of features coming from different scripts on the same frame, and only call the one with the highest priority at the end of the frame.
//
//	An example of when this would be useful:
//		Imagine a scene containing a button and another tap event of some kind (like on-screen taps).
//		When the user taps on the button, the other event is also triggered.
//		By having the actions of both interactables pass through rankedAction first, the highest-prio action at the end of each frame is triggered and the other is ignored.
//
//	All actions to be pooled together should have the same label. At the end of each frame, all pools are cleared.
//
//
//
// -------------------




// access
global.lsqs = script;




// returns true if a SceneObject or Component has been destroyed or is null.
// (the usual 'isNull' is not working in LS 5.0.12)
function isNullPatch(obj){
	// regular check
	if(!obj) return true;
	try{ // SceneObject test
		obj.name;
		return false;
	}catch(error){ // Component test
		try{
			obj.getSceneObject();
			return false;
		}catch(error){
			return true;
		}
	}
}




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



var animateProperties = []; // keeping a list of all instances
global.AnimateProperty = function(updateFunction){
	var self = this;

	/**
	 * @description called on animation start
	*/
	this.startFunction = function(inAnim){};

	/**
	 * @type {function}
	 * @description called on each animation frame, with animation value (0-1) as its first argument.
	 * the second argument is the linear animation value.
	 * these ranges are exclusive for the first step, and inclusive for the last step of the animation (so when playing in reverse, the range becomes (1, 0]).
	 * the third argument is runtime (seconds).
	*/
	this.updateFunction = updateFunction ? updateFunction : function(v, vLinear, runtime){};

	/**
	 * @type {function}
	 * @description called on animation end
	*/
	this.endFunction = function(inAnim){};

	/**
	 * @type {function}
	 * @description called when the forwards direction of the animation is changed
	*/
	this.onReverseChange = function(){};

	/**
	 * @type {number}
	 * @description duration in seconds, default is 1.
	 * tip: for a continuous animation, set duration to Infinity and use the 'runtime' argument in the updateFunction
	*/
	this.duration = 1;

	/**
	 * @type {number}
	 * @description reverse duration in seconds, default is .duration
	*/
	this.reverseDuration;

	/**
	 * @type {number}
	 * @description delay before starting animation, default is 0
	*/
	this.delay = 0;

	/**
	 * @type {number}
	 * @description delay before starting animation when reversed, default is .delay
	*/
	this.reverseDelay;

    /**
	 * @type {function}
	 * @description animation look-up curve, default is EaseFunctions.Cubic.InOut
	*/
	this.easeFunction = EaseFunctions.Cubic.InOut;

	/**
	 * @type {function}
	 * @description animation look-up curve when reversed, default is .easeFunction
	*/
	this.reverseEaseFunction;

	/**
	 * @argument {number} newTimeRatio
	 * @description sets the animation once to this linear time ratio (0-1), stops current animation
	*/
	this.pulse = function(newTimeRatio){
		pulse(newTimeRatio, false);
	}

	/**
	 * @type {number} 
	 * @description get current linear animation time (0-1)
	*/
	this.getTimeRatio = function(){
		var reversedTimeRatio = reversed ? 1-timeRatio : timeRatio;
		return clamp(reversedTimeRatio);
	}

	/**
	 * @description set animation direction, toggles if no argument given
	 * @param {boolean} [reverse] 'true' to set to reverse
	*/
	this.setReversed = function(reverse){
		if(typeof reverse == 'undefined'){ // toggle reverse if no argument given
			reversed = !reversed;
		}else{
			reversed = reverse;
		}
		self.onReverseChange()
	}

	/**
	 * @description returns true if the animation is currently reversed
	*/
	this.getReversed = function(){
		return reversed;
	}

	/**
	 * @description returns true if the animation is currently playing (waiting for delay also counts as playing)
	*/
	this.isPlaying = function(){
		return isPlaying;
	}

	/**
	 * @description registers a callback function on the first frame that v >= t (or v <= t if playing reversed).
	 * only 1 callback is supported at this time.
	 * call without arguments to clear.
	 * @param {number} v the linear animation time (0-1) at which to call this callback
	 * @param {function} f the function to call
	*/
	this.setCallbackAtTime = function(v, f){
		callbackAtTime = {
			v : v,
			f : f,
			called : false,
		}
	}

	/**
	 * @description start the animation
	 * @argument {number} atTime (optional) time ratio (0-1) to start playing from
	 * @argument {boolean} skipDelay (optional) ignore the delay value
	*/
	this.start = function(atTime, skipDelay){
		stopDelayedStart();

		function begin(){
			if(self.startFunction) self.startFunction(!reversed);
			if(atTime != null){ // custom time ratio given
				pulse(atTime, true);
			}else{
				// pulse first frame of animation already, next frame the animation event will take over
				if(self.getTimeRatio() == 1){
					pulse(0, true);
				}else{
					pulse(self.getTimeRatio(), true);
				}
			}
			updateDuration();
			startAnimEvent();
		}

		// force isPlaying to true at this point already (delayed animation also counts as playing)
		isPlaying = true;

		var delay = self.delay;
		if(reversed && typeof(self.reverseDelay) != 'undefined') delay = self.reverseDelay; // if reverse, use custom delay (if any)
		if(!skipDelay && delay > 0){ // start after delay (if any)
			delayedStart = new global.DoDelay(begin)
			delayedStart.byTime(delay);
		}else{
			begin();
		}
	}
	
	/**
	 * @description stop the animation
	 * @param {boolean} callEndFunction callEndFunction: (optional) whether to call the .endFunction (if animation was still playing), default is false.
	*/
	this.stop = function(callEndFunction){
		stopAnimEvent();
		var wasPlaying = isPlaying;
		isPlaying = false;
		if(wasPlaying && callEndFunction) self.endFunction(!reversed);
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
	var runtime = 0;

	function setValue(v, lastFrame){
		self.updateFunction(v, lastFrame ? v : timeRatio, runtime); // on last frame, take animation end value
	}

	function updateDuration(){
		duration = reversed ? (typeof self.reverseDuration == 'number' ? self.reverseDuration : self.duration) : self.duration; // set duration, checks if reversed is unique otherwise uses forward duration
	}
	
	function animation(){
		if(!animEvent) return; // if update event was already stopped, prevent this function from running again

		runtime += getDeltaTime();

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

	function pulse(newTimeRatio, isPlayingTrue){
		stopAnimEvent();
		isPlaying = isPlayingTrue;
		timeRatio = reversed ? 1-newTimeRatio : newTimeRatio; // reset animation time
		setValue(getInterpolated());
	}
	
	function startAnimEvent(){
		stopAnimEvent(); // stop currently playing (if any)
		isPlaying = true;
		runtime = 0;
		animEvent = script.createEvent("UpdateEvent");
		animEvent.bind(animation);
	}

	function stopAnimEvent(){
		if(animEvent){
			script.removeEvent(animEvent);
			animEvent = null;
		}

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




global.QuickFlow = function(obj){
	// links
	const trf = obj.getTransform();
    const screenTrf = obj.getComponent("Component.ScreenTransform"); // if it exists
	var visual = obj.getComponent("Component.Visual"); // get visual on obj, if any
	if(visual){
		if(visual.getTypeName() == "Component.Text") visual = null; // text gets its own variable
		else if(visual.mainPass == null) visual = null; // check if valid visual
	}
	if(!visual) var text = obj.getComponent("Component.Text"); // check for text component if no visual so far

	// starting values (some animators update these on animation end)
	var startPosition;
    var startScale;
	var startRotation;
	var startBaseColor;
	var startTextBaseColors;
	updateStartingValues();

	// true starting values (in case of reset)
	const trueEnabled = obj.enabled;
	const truePosition = startPosition;
	const trueScale = startScale;
	const trueRotation = startRotation;
	const trueBaseColor = startBaseColor;
	const trueTextBaseColors = {...startTextBaseColors};

	// applying-transforms-event
	var updateEvent = script.createEvent("LateUpdateEvent"); // after all animators are done
	updateEvent.bind(onUpdate);
	updateEvent.enabled = false;
	var newPosition; // position to apply
	var newScale; // scale
	var newRotation; // rotation
	var newBaseColor; // color/alpha (vec4)
	var newTextBaseColors; // misc text colors (vec4) (object: outline, dropshadow, background)

	// placeholders
	var self = this;
	var allCommands = []; // all given animation commands stored in case of looping
	var looping; // if currently playing the loop

	// in/out animators (reused)
	var fadeAnim;
	var scaleAnim;

	// non-relative animators (reused because it's not possible to run multiple of these simultaneously)
	var nrPositionAnim;
	var nrScaleAnim;
	var nrRotationAnim;
	var nrBaseColorAnim;

	// lists
	var animators; // all animators (one-off animators are assigned in real-time and deleted on end)
	var inOutAnimators; // in/out animators (to check when to enable/disable obj)
	var delays = []; // all current delays

	// checks if properties need to be applied on this frame
	var doPosition;
	var doRotation;
	var doScale;
	var doBaseColor;

	// object persistence check
	var objectWasDeleted = false;



	// initialize
	function init(){
		// initialize start values
		resetNewValues();

		// create in/out animators
		fadeAnim = new AnimateProperty();
		scaleAnim = new AnimateProperty();

		// collect
		inOutAnimators = [fadeAnim, scaleAnim];
		animators = [fadeAnim, scaleAnim]; // all animators (will be updated on runtime)

		// assign fade anim
			fadeAnim.updateFunction = function(v){
				if(newBaseColor){
					newBaseColor = new vec4(newBaseColor.r, newBaseColor.g, newBaseColor.b, newBaseColor.a * v);
					if(newTextBaseColors){ // text components have multiple colors to fade out
						newTextBaseColors.outline = new vec4(newTextBaseColors.outline.r, newTextBaseColors.outline.g, newTextBaseColors.outline.b, newTextBaseColors.outline.a * v);
						newTextBaseColors.dropshadow = new vec4(newTextBaseColors.dropshadow.r, newTextBaseColors.dropshadow.g, newTextBaseColors.dropshadow.b, newTextBaseColors.dropshadow.a * v);
						newTextBaseColors.background = new vec4(newTextBaseColors.background.r, newTextBaseColors.background.g, newTextBaseColors.background.b, newTextBaseColors.background.a * v);
					}
					doBaseColor = true;
				}
			}
			fadeAnim.endFunction = function(){
				if(fadeAnim.getReversed()){ // if end of out-anim
					onUpdate(null, true); // one last frame before stopping event, current transforms state will be starting point for new animations
					stopAnimatorsExcept(inOutAnimators);
					if(!isNullPatch(obj)) obj.enabled = false; // disable this sceneobject
					resetStartingValues(); // reset all values to true values
				}else{ // if in-anim
					if(!areOtherAnimatorsPlaying(animators)){
						updateEvent.enabled = false; // stop update event
					}
				}
			}

		// assign scale anim
			scaleAnim.updateFunction = function(v){
				if(scaleAnim.startAtTime != 0) v = remap(v, 0, 1, scaleAnim.startAtTime, 1);
				newScale = newScale.uniformScale(v);
				doScale = true;
			}
			scaleAnim.endFunction = function(){
				if(scaleAnim.getReversed()){ // if end of out-anim
					onUpdate(null, true); // one last frame before stopping event, current transforms state will be starting point for new animations
					stopAnimatorsExcept(inOutAnimators);
					if(!isNullPatch(obj)) obj.enabled = false; // disable this sceneobject
					resetStartingValues(); // reset all values to true values
				}else{ // if in-anim
					if(!areOtherAnimatorsPlaying(animators)){
						updateEvent.enabled = false; // stop update event
					}
				}
			}
	}
	init();

	// a non-relative animation is an animation that is absolute - it doesn't use values like 'newScale', but instead overwrites the scale completely.
	// running multiple non-relative animations simultaneously will stop/override the previous ones
	function nonRelativeAnimationClear(anim){
		if(anim == nrScaleAnim){ // scale anim
			newScale = startScale; // reset relevant start values
			if(nrScaleAnim){ // stop existing non-relative scale anim
				nrScaleAnim.stop();
				nrScaleAnim.endFunction();
			}
		}
	}

	function animationStarted(anim){
		// start transform apply event
		updateEvent.enabled = true;

		// if a temp animation (not in/out)
		if(!inOutAnimators.includes(anim)){
			animators.push(anim); // register to animators list temporarily
			anim.endFunction = wrapFunction(anim.endFunction, function(){ // wrap extra end function
				removeFromArray(anim, animators); // remove from list
				if(!areOtherAnimatorsPlaying(animators)){ // if no other animators are playing
					updateEvent.enabled = false; // stop the update event
				}
				anim.endFunction = function(){}; // reset on end, so this can only be run once per temporary animation
			});
		}
	}

	// at the end of each animation frame, apply all transformations (doing this once at the end allows chaining the QuickFlow animations)
	function onUpdate(eventArgs, updateStartingValuesInbetween){
		if(!objStillExists()) return;

		// apply transforms
		if(screenTrf){
			if(doPosition) screenTrf.anchors.setCenter(newPosition);
			if(doRotation) screenTrf.rotation = newRotation;
			if(doScale) screenTrf.anchors.setSize(newScale);
		}else{
			if(doPosition) trf.setLocalPosition(newPosition);
			if(doRotation) trf.setLocalRotation(newRotation);
			if(doScale) trf.setLocalScale(newScale);
		}
		if(doBaseColor && newBaseColor){
			if(visual) visual.mainPass.baseColor = newBaseColor;
			if(text){
				text.textFill.color = newBaseColor;
				text.outlineSettings.fill.color = newTextBaseColors.outline;
				text.dropshadowSettings.fill.color = newTextBaseColors.dropshadow;
				text.backgroundSettings.fill.color = newTextBaseColors.background;
			}
		}

		// reset
		doPosition = false;
		doRotation = false;
		doScale = false;
		doBaseColor = false;
		
		// reset to defaults for next frame
		if(updateStartingValuesInbetween) updateStartingValues();
		resetNewValues();
	}

	// returns true if other animations are still playing
	function areOtherAnimatorsPlaying(list){
		for(var i = 0; i < list.length; i++){
			if(list[i].isPlaying()) return true;
		}
		return false;
	}

	// stop list of animators
	function stopAnimators(anims){
		updateEvent.enabled = false;
		for(var i = 0; i < anims.length; i++){
			anims[i].stop();
			anims[i].endFunction(); // always call end function even if not a completed animation
		}
	}

	// stop all animators and update, except for anim (can be array) (prevents endFunction from calling itself repeatedly)
	function stopAnimatorsExcept(anim){
		var animatorsList = removeFromArray(anim, animators); // all except for anim(s)
		stopAnimators(animatorsList)
	}

	// stop all current delays
	function stopDelays(fromBeforeTime){
		fromBeforeTime = nullish(fromBeforeTime, Infinity); // stop all delays if no time cutoff given

		for(var i = 0; i < delays.length; i++){
			var delay = delays[i];
			if(delay){
				if((delay.createdAtTime + (delay.getGivenTime() || 0)) < fromBeforeTime){
					delay.stop(); // stop delays from before cutoff
				}
			}
		}
		delays = [];
	}

	// create a delay and register it in a way so it's easy to stop it later
	function CreateDelay(f){
		var delay = new DoDelay(f);
		delays.push(delay);
		return delay;
	}

	// set the current transforms as the starting point for new animations
	function updateStartingValues(){
		if(!objStillExists()) return;
		startPosition = screenTrf ? screenTrf.anchors.getCenter() : trf.getLocalPosition(); // get starting position (depending on transform type)
		startScale = screenTrf ? screenTrf.anchors.getSize() : trf.getLocalScale(); // get starting scale value
		startRotation = screenTrf ? screenTrf.rotation : trf.getLocalRotation(); // get starting rotation
		startBaseColor = visual ? visual.mainPass.baseColor : text ? text.textFill.color : null; // get starting color value
		if(text) startTextBaseColors = { // get starting misc text color values
			outline : text.outlineSettings.fill.color,
			dropshadow : text.dropshadowSettings.fill.color,
			background : text.backgroundSettings.fill.color,
		};
	}

	// set the new transforms as the starting point for new animations
	function updateNewValues(){
		if(!objStillExists()) return;
		newPosition = screenTrf ? screenTrf.anchors.getCenter() : trf.getLocalPosition(); // get starting position (depending on transform type)
		newRotation = screenTrf ? screenTrf.rotation : trf.getLocalRotation(); // get starting rotation
		newScale = screenTrf ? screenTrf.anchors.getSize() : trf.getLocalScale(); // get starting scale value
		newBaseColor = visual ? visual.mainPass.baseColor : text ? text.textFill.color : null; // get starting color value
		if(text) newTextBaseColors = { // get starting misc text color values
			outline : text.outlineSettings.fill.color,
			dropshadow : text.dropshadowSettings.fill.color,
			background : text.backgroundSettings.fill.color,
		};
	}

	// resetting start values to true values
	function resetStartingValues(){
		startPosition = truePosition;
		startRotation = trueRotation;
		startScale = trueScale;
		if(visual || text) startBaseColor = trueBaseColor;
		if(text) startTextBaseColors = {...trueTextBaseColors};
	}

	// resetting newValues to the start values, so they can be chained for the next frame
	function resetNewValues(){
		newPosition = startPosition;
		newRotation = startRotation;
		newScale = startScale;
		if(visual || text) newBaseColor = startBaseColor;
		if(text) newTextBaseColors = {...startTextBaseColors};
	}

	function registerCommand(f, args){
		if(looping) return; // don't add commands if currently playing a loop
		var item = {f, args};
		allCommands.push(item);
	}

	function loopCommands(){
		looping = true;
		resetStartingValues();
		for(var i = 0; i < allCommands.length; i++){
			const item = allCommands[i];
			item.f.apply(this, item.args);
		}
	}

	// checks if the component has not been deleted in the meantime, in which case the whole QuickFlow animation is stopped (and 'true' is not returns)
	function objStillExists(){
		if(objectWasDeleted) return false; // deleted and already checked
		const objDeleted = isNullPatch(obj) || (!!screenTrf && isNullPatch(screenTrf)); // check if deleted
		if(objDeleted){
			objectWasDeleted = true;
			kill();
			return false;
		}else{
			return true;
		}
	}

	function stop(){
		stopDelays(getTime());
		stopAnimators(animators);
		if(!isNullPatch(obj)) obj.enabled = trueEnabled; // out-anims disable the object on endFunction, but when an out-anim is stopped prematurely the object should be enabled
		updateStartingValues();
		updateNewValues();
	}

	function kill(){
		stopDelays();
		stopAnimators(animators);
	}



	// --- animations



	/**
	 * @description start fade-in
	 * (enables SceneObject on start)
	 * @description (use undefined for any argument to pick its default value)
	 * @param {number} delay delay - default: 0 seconds
	 * @param {number} duration duration - default: .5 seconds
	 * @param {function} easeFunction easeFunction - default: EaseFunctions.Cubic.InOut
	*/
	this.fadeIn = function(delay = 0, duration = .5, easeFunction = EaseFunctions.Cubic.InOut){
		// register
		registerCommand(this.fadeIn, [...arguments]);

		if(!visual && !text) return self; // if no visual present, ignore

		new CreateDelay(function(){
			if(!objStillExists()) return;

			// enable object on start
			obj.enabled = true;
	
			// animation
			fadeAnim.setReversed(false);
			fadeAnim.duration = duration;
			fadeAnim.easeFunction = easeFunction;
			fadeAnim.start();
	
			// register this animation
			animationStarted(fadeAnim);
		}).byTime(delay);

		// return to allow chaining
		return self;
	}

	/**
	 * @description start fade-out
	 * (disables SceneObject and all running animations on end)
	 * @description (use undefined for any argument to pick its default value)
	 * @param {number} delay delay - default: 0 seconds
	 * @param {number} duration duration - default: .3 seconds
	 * @param {function} easeFunction easeFunction - default: EaseFunctions.Cubic.InOut
	*/
	this.fadeOut = function(delay = 0, duration = .3, easeFunction = EaseFunctions.Cubic.InOut){
		// register
		registerCommand(this.fadeOut, [...arguments]);

		if(!visual && !text) return self; // if no visual present, ignore

		new CreateDelay(function(){
			// animation
			fadeAnim.setReversed(true);
			fadeAnim.duration = duration;
			fadeAnim.easeFunction = easeFunction;
			fadeAnim.start();
	
			// register this animation
			animationStarted(fadeAnim);
		}).byTime(delay);

		// return to allow chaining
		return self;
	}

	/**
	 * @description start scale-in
	 * (enables SceneObject on start)
	 * @description (use undefined for any argument to pick its default value)
	 * @param {number} delay delay - default: 0 seconds
	 * @param {number} duration duration - default: .5 seconds
	 * @param {number} startAtTime startAtTime - default: 0 (0-1 ratio)
	 * @param {function} easeFunction easeFunction - default: EaseFunctions.Cubic.Out
	*/
	this.scaleIn = function(delay = 0, duration = .5, startAtTime = 0, easeFunction = EaseFunctions.Cubic.Out){
		// register
		registerCommand(this.scaleIn, [...arguments]);

		new CreateDelay(function(){
			if(!objStillExists()) return;

			// enable object on start
			obj.enabled = true;
	
			// animation
			scaleAnim.setReversed(false);
			scaleAnim.startAtTime = startAtTime;
			scaleAnim.duration = duration;
			scaleAnim.easeFunction = easeFunction;
			scaleAnim.start();
	
			// register this animation
			animationStarted(scaleAnim);
		}).byTime(delay);

		// return to allow chaining
		return self;
	}

	/**
	 * @description start scale-out
	 * (disables SceneObject and all running animations on end)
	 * @description (use undefined for any argument to pick its default value)
	 * @param {number} delay delay - default: 0 seconds
	 * @param {number} duration duration - default: .3 seconds
	 * @param {number} startAtTime startAtTime - default: 0 (0-1 ratio)
	 * @param {function} easeFunction easeFunction - default: EaseFunctions.Cubic.Out
	*/
	this.scaleOut = function(delay = 0, duration = .3, startAtTime = 0, easeFunction = EaseFunctions.Cubic.Out){
		// register
		registerCommand(this.scaleOut, [...arguments]);

		new CreateDelay(function(){
			// animation
			scaleAnim.setReversed(true);
			scaleAnim.startAtTime = startAtTime;
			scaleAnim.duration = duration;
			scaleAnim.easeFunction = easeFunction;
			scaleAnim.start();
	
			// register this animation
			animationStarted(scaleAnim);
		}).byTime(delay);

		// return to allow chaining
		return self;
	}

	/**
	 * @description do scale squeeze
	 * @description (use undefined for any argument to pick its default value)
	 * @param {number} delay delay - default: 0 seconds
	 * @param {number} strength strength - default: .5 (multiplier)
	 * @param {number} duration duration - default: .75 seconds
	*/
	this.squeeze = function(delay = 0, strength = .5, duration = .75){
		// register
		registerCommand(this.squeeze, [...arguments]);
		
		new CreateDelay(function(){
			// prepare strength value for remap
			strength += 1;

			// animation
			var squeezeAnim = new AnimateProperty(function(v, vL){
				doScale = true;

				let r = centerRemap(vL, .3, .1); // 0-1-0 with custom center and width
				r = interp(0, 1, r.remapped, r.passedCenter ? EaseFunctions.Bounce.In : EaseFunctions.Quartic.InOut); // easing
	
				// stretch and squeeze amounts
				let squeeze = remap(r, 0, 1, 1, 1/strength);
				let stretch = remap(r, 0, 1, 1, strength);
	
				// squeeze transform
				if(!!screenTrf){
					let mult = new vec2(squeeze, stretch);
					newScale = newScale.mult(mult)
				}else{
					let mult = new vec3(squeeze, stretch, squeeze);
					newScale = newScale.mult(mult)
				}

				doScale = true;
			});
			squeezeAnim.duration = duration;
			squeezeAnim.start();
			
			// register this temp animation
			animationStarted(squeezeAnim);
		}).byTime(delay);

		// return to allow chaining
		return self;
	}

	/**
	 * @description do rotational swirl
	 * @description (use undefined for any argument to pick its default value)
	 * @param {number} delay delay - default: 0 seconds
	 * @param {number} rotations rotations - default: 1 full rotations
	 * @param {vec3} axis axis - default: vec3.forward()
	 * @param {number} duration duration - default: 1 second
	 * @param {function} easeFunction easeFunction - default: EaseFunctions.Cubic.InOut
	*/
	this.rotateAround = function(delay = 0, rotations = 1, axis = vec3.forward(), duration = 1, easeFunction = EaseFunctions.Cubic.InOut){
		// register
		registerCommand(this.rotateAround, [...arguments]);

		new CreateDelay(function(){
			let rotateAmount = Math.PI * 2 * rotations;
	
			// animation
			var rotateAnim = new AnimateProperty(function(v){
				doRotation = true;

				if(!!screenTrf){
					let rot = quat.angleAxis(v * -rotateAmount, axis);
					newRotation = newRotation.multiply(rot);
				}else{
					let rot = quat.angleAxis(v * -rotateAmount, axis);
					newRotation = newRotation.multiply(rot);
				}
			});
			rotateAnim.easeFunction = easeFunction;
			rotateAnim.duration = duration;
			rotateAnim.start();
			
			// register this temp animation
			animationStarted(rotateAnim);
		}).byTime(delay);

		// return to allow chaining
		return self;
	}

	/**
	 * @description scale towards new size
	 * (overrides other rotation animations)
	 * @description (use undefined for any argument to pick its default value)
	 * @param {number} delay delay - default: 0 seconds
	 * @param {(vec2|vec3)} toScale toScale - default: original scale (before animations were applied)
	 * @param {number} duration duration - default: .5 seconds
	 * @param {function} easeFunction easeFunction - default: EaseFunctions.Cubic.InOut
	*/
	this.scaleTo = function(delay = 0, toScale = trueScale, duration = .5, easeFunction = EaseFunctions.Cubic.InOut){
		// register
		registerCommand(this.scaleTo, [...arguments]);

		new CreateDelay(function(){
			// clear non-relative animation
			nonRelativeAnimationClear(nrScaleAnim);
	
			// animation
			nrScaleAnim = new AnimateProperty(function(v){
				doScale = true;

				if(!!screenTrf){
					newScale = vec2.lerp(startScale, toScale, v);
				}else{
					newScale = vec3.lerp(startScale, toScale, v);
				}
			});
			nrScaleAnim.easeFunction = easeFunction;
			nrScaleAnim.duration = duration;
			nrScaleAnim.endFunction = function(){ // non-relative animation, so let's update startValues to allow smooth transitions on end
				if(!objStillExists()) return;

				startScale = screenTrf?screenTrf.anchors.getSize():trf.getLocalScale();
			}
			nrScaleAnim.start();
	
			// register this temp animation
			animationStarted(nrScaleAnim);
		}).byTime(delay);

		// return to allow chaining
		return self;
	}

	/**
	 * @description move towards new position (local screen space if ScreenTransform, world space if Transform)
	 * (overrides other position animations)
	 * @description (use undefined for any argument to pick its default value)
	 * @param {number} delay delay - default: 0 seconds
	 * @param {(vec2|vec3)} point point - default: original position (before animations were applied)
	 * @param {boolean} isLocal isLocal - default: false (only relevant for 3D motion, set to true to apply as local space instead of world space)
	 * @param {number} duration duration - default: .5 seconds
	 * @param {function} easeFunction easeFunction - default: EaseFunctions.Cubic.InOut
	*/
	this.moveTo = function(delay = 0, point = truePosition, isLocal = false, duration = .5, easeFunction = EaseFunctions.Cubic.InOut){
		// register
		registerCommand(this.moveTo, [...arguments]);

		new CreateDelay(function(){
			if(!objStillExists()) return;

			// clear non-relative animation
			nonRelativeAnimationClear(nrPositionAnim);
	
			// convert toPosition from world space to local space on animation start (if not ScreenTransform)
			if(!isLocal && !screenTrf){
				var parent = obj.getParent(); // use parent's transform for local-to-world conversion
				if(parent){
					const mat = parent.getTransform().getInvertedWorldTransform();
					point = mat.multiplyPoint(point);
				}
			}
	
			// animation
			nrPositionAnim = new AnimateProperty(function(v){
				doPosition = true;

				if(screenTrf){
					newPosition = vec2.lerp(startPosition, point, v);
				}else{
					newPosition = vec3.lerp(startPosition, point, v);
				}
			});
			nrPositionAnim.easeFunction = easeFunction;
			nrPositionAnim.duration = duration;
			nrPositionAnim.endFunction = function(){ // non-relative animation, so let's update startValues to allow smooth transitions on end
				if(!objStillExists()) return;

				startPosition = screenTrf?screenTrf.anchors.getCenter():trf.getLocalPosition();
			}
			nrPositionAnim.start();
	
			// register this temp animation
			animationStarted(nrPositionAnim);
		}).byTime(delay);

		// return to allow chaining
		return self;
	}

	/**
	 * @description keep blinking
	 * @description (use undefined for any argument to pick its default value)
	 * @param {number} delay delay - default: 0 seconds
	 * @param {number} interval interval - default: 1 second
	 * @param {number} strength strength - default: .5 (multiplier, between 0-1)
	 * @param {function} easeFunction easeFunction - default: EaseFunctions.Sinusoidal.InOut
	*/
	this.keepBlinking = function(delay = 0, interval = 1, strength = .5, easeFunction = EaseFunctions.Sinusoidal.InOut){
		// register
		registerCommand(this.keepBlinking, [...arguments]);

		if(!visual && !text) return self; // if no visual present, ignore
		new CreateDelay(function(){
			// animation
			var blinkAnim = new AnimateProperty(function(v, vL, runtime){
				doBaseColor = true;

				const fraction = (runtime%interval) / interval;
				const centerRemapped = 1-centerRemap(fraction).remapped; // remap around center, start at 1
				const interpolated = remap(interp(0, 1, centerRemapped, easeFunction), 0, 1, 1-strength, 1); // apply strength and easing
				if(newBaseColor) newBaseColor = new vec4(newBaseColor.r, newBaseColor.g, newBaseColor.b, newBaseColor.a * interpolated);
				if(newTextBaseColors){
					newTextBaseColors.outline = new vec4(newTextBaseColors.outline.r, newTextBaseColors.outline.g, newTextBaseColors.outline.b, newTextBaseColors.outline.a * interpolated);
					newTextBaseColors.dropshadow = new vec4(newTextBaseColors.dropshadow.r, newTextBaseColors.dropshadow.g, newTextBaseColors.dropshadow.b, newTextBaseColors.dropshadow.a * interpolated);
					newTextBaseColors.background = new vec4(newTextBaseColors.background.r, newTextBaseColors.background.g, newTextBaseColors.background.b, newTextBaseColors.background.a * interpolated);
				}
			});
			blinkAnim.easeFunction = EaseFunctions.Linear.InOut; // easefunction is used inside of the update event instead
			blinkAnim.duration = Infinity;
			blinkAnim.delay = delay;
			blinkAnim.start();
			
			// register this temp animation
			animationStarted(blinkAnim);
		}).byTime(delay);

		// return to allow chaining
		return self;
	}

	/**
	 * @description rotate to look at point (local screen space if ScreenTransform, world space if Transform)
	 * (overrides other rotation animations)
	 * @description (use undefined for any argument to pick its default value)
	 * @param {number} delay delay - default: 0 seconds
	 * @param {(vec2|vec3)} point point - default: rotates back to original rotation (before animations were applied)
	 * @param {number} duration duration - default: .5 seconds
	 * @param {function} easeFunction easeFunction - default: EaseFunctions.Cubic.InOut
	*/
	this.lookAt = function(delay = 0, point, duration = .5, easeFunction = EaseFunctions.Cubic.InOut){
		// register
		registerCommand(this.lookAt, [...arguments]);

		new CreateDelay(function(){
			if(!objStillExists()) return;

			// clear non-relative animation
			nonRelativeAnimationClear(nrRotationAnim);

			var toRotation;
			if(screenTrf){
				if(!point){
					toRotation = trueRotation;
				}else{
					var vectorX = point.x - startPosition.x;
					var vectorY = point.y - startPosition.y;
					var angle = Math.atan2(vectorY, vectorX);
					toRotation = quat.angleAxis(angle, vec3.forward());
				}
			}else{
				if(point){
					// convert point from world space to local space on animation start (if not ScreenTransform)
					var parent = obj.getParent(); // use parent's transform for local-to-world conversion
					if(parent){
						const mat = parent.getTransform().getInvertedWorldTransform();
						point = mat.multiplyPoint(point);
					}
					toRotation = quat.lookAt(point, vec3.up());
				}else{
					toRotation = trueRotation
				}
			}
	
			// animation
			nrRotationAnim = new AnimateProperty(function(v){
				doRotation = true;

				newRotation = quat.slerp(startRotation, toRotation, v);
			});
			nrRotationAnim.easeFunction = easeFunction;
			nrRotationAnim.duration = duration;
			nrRotationAnim.endFunction = function(){ // non-relative animation, so let's update startValues to allow smooth transitions on end
				if(!objStillExists()) return;

				startRotation = screenTrf?screenTrf.rotation:trf.getLocalRotation();
			}
			nrRotationAnim.start();
	
			// register this temp animation
			animationStarted(nrRotationAnim);
		}).byTime(delay);

		// return to allow chaining
		return self;
	}

	/**
	 * @description keep rotating around an axis
	 * @description (use undefined for any argument to pick its default value)
	 * @param {number} delay delay - default: 0 seconds
	 * @param {number} speed speed - default: 1 rotation/second
	 * @param {vec3} axis axis - default: vec3.forward()
	*/
	this.keepRotating = function(delay = 0, speed = 1, axis = vec3.forward()){
		// register
		registerCommand(this.keepRotating, [...arguments]);

		new CreateDelay(function(){
			// animation
			var rotatingAnim = new AnimateProperty(function(v, vL, runtime){
				doRotation = true;

				const angle = runtime * speed * Math.PI*2;
				newRotation = newRotation.multiply(quat.angleAxis(angle, axis));
			});
			rotatingAnim.easeFunction = EaseFunctions.Linear.InOut; // easefunction is used inside of the update event instead
			rotatingAnim.duration = Infinity;
			rotatingAnim.delay = delay;
			rotatingAnim.start();
			
			// register this temp animation
			animationStarted(rotatingAnim);
		}).byTime(delay);

		// return to allow chaining
		return self;
	}

	/**
	 * @description keep bouncing a rotation around an axis
	 * @description (use undefined for any argument to pick its default value)
	 * @param {number} delay delay - default: 0 seconds seconds
	 * @param {number} strength strength - default: .1 full rotations
	 * @param {number} interval interval - default: .75 seconds
	 * @param {vec3} axis axis - default: vec3.forward()
	 * @param {function} easeFunction easeFunction - EaseFunctions.Sinusoidal.InOut
	 * @param {number} smoothIn smoothIn - smoothly animating the strength on animation start - default: .5 seconds
	*/
	this.keepBouncingRotation = function(delay = 0, strength = .1, interval = .75, axis = vec3.forward(), easeFunction = EaseFunctions.Sinusoidal.InOut, smoothIn = .5){
		// register
		registerCommand(this.keepBouncingRotation, [...arguments]);

		new CreateDelay(function(){
			const startTime = getTime();

			// animation
			var rotatingAnim = new AnimateProperty(function(v, vL, runtime){
				doRotation = true;

				const smoothInStrength = interp(0, 1, nullish(clamp((getTime()-startTime)/smoothIn), 1), EaseFunctions.Cubic.InOut); // smoothly animating in
				let fraction = (runtime%interval) / interval;
				fraction = (fraction+.25) % 1; // start centerRemapped at .5, so get fraction at half of that
				const centerRemapped = centerRemap(fraction).remapped; // remap around center
				const remapped = remap(interp(0, 1, centerRemapped, easeFunction), 0, 1, -1, 1); // apply strength and easing
				const angle = remapped * (strength * smoothInStrength) * Math.PI * 2;
				newRotation = newRotation.multiply(quat.angleAxis(angle, axis));
			});
			rotatingAnim.easeFunction = EaseFunctions.Linear.InOut; // easefunction is used inside of the update event instead
			rotatingAnim.duration = Infinity;
			rotatingAnim.delay = delay;
			rotatingAnim.start();
			
			// register this temp animation
			animationStarted(rotatingAnim);
		}).byTime(delay);

		// return to allow chaining
		return self;
	}

	/**
	 * @description keep bouncing a position up and down along an axis
	 * @description (use undefined for any argument to pick its default value)
	 * @param {number} delay delay - default: 0 seconds
	 * @param {number} distance distance - default: 1 local screen space if ScreenTransform, 10 world space if Transform
	 * @param {number} interval interval - default: 1 second
	 * @param {(vec2|vec3)} axis axis - default: up (vec2.up() if ScreenTransform, vec3.up() if Transform)
	 * @param {function} easeFunction easeFunction - EaseFunctions.Sinusoidal.InOut
	 * @param {number} smoothIn smoothIn - smoothly animating the strength on animation start - default: .5 seconds
	*/
	this.keepBouncingPosition = function(delay = 0, distance = screenTrf?1:10, interval = 1, axis = screenTrf?vec2.up():vec3.up(), easeFunction = EaseFunctions.Sinusoidal.InOut, smoothIn = .5){
		// register
		registerCommand(this.keepBouncingPosition, [...arguments]);

		new CreateDelay(function(){
			const startTime = getTime();

			// animation
			var positioningAnim = new AnimateProperty(function(v, vL, runtime){
				doPosition = true;

				const smoothInStrength = interp(0, 1, nullish(clamp((getTime()-startTime)/smoothIn), 0), EaseFunctions.Cubic.InOut); // smoothly animating in
				let fraction = (runtime%interval) / interval;
				fraction = (fraction+.25) % 1; // start centerRemapped at .5, so get fraction at half of that
				const centerRemapped = centerRemap(fraction).remapped; // remap around center, start at 1
				const move = axis.uniformScale(remap(interp(0, 1, centerRemapped, easeFunction), 0, 1, -1, 1) * distance * smoothInStrength); // apply strength and easing
				newPosition = newPosition.add(move);
			});
			positioningAnim.easeFunction = EaseFunctions.Linear.InOut; // easefunction is used inside of the update event instead
			positioningAnim.duration = Infinity;
			positioningAnim.delay = delay;
			positioningAnim.start();
			
			// register this temp animation
			animationStarted(positioningAnim);
		}).byTime(delay);

		// return to allow chaining
		return self;
	}

	/**
	 * @description keep bouncing a scale
	 * @description (use undefined for any argument to pick its default value)
	 * @param {number} delay delay - default: 0 seconds
	 * @param {number} strength strength - default: .25 (multiplier of local scale)
	 * @param {number} interval interval - default: 1 second
	 * @param {function} easeFunction easeFunction - EaseFunctions.Sinusoidal.InOut
	 * @param {number} smoothIn smoothIn - smoothly animating the strength on animation start - default: .5 seconds
	*/
	this.keepBouncingScale = function(delay = 0, strength = .25, interval = 1, easeFunction = EaseFunctions.Sinusoidal.InOut, smoothIn = .5){
		// register
		registerCommand(this.keepBouncingScale, [...arguments]);

		new CreateDelay(function(){
			const startTime = getTime();

			// animation
			var scalingAnim = new AnimateProperty(function(v, vL, runtime){
				doScale = true;

				const smoothInStrength = interp(0, 1, nullish(clamp((getTime()-startTime)/smoothIn), 0), EaseFunctions.Cubic.InOut); // smoothly animating in
				let fraction = (runtime%interval) / interval;
				fraction = (fraction+.25) % 1; // start centerRemapped at .5, so get fraction at half of that
				const centerRemapped = centerRemap(fraction).remapped; // remap around center, start at 1
				const resize = remap(interp(0, 1, centerRemapped, easeFunction), 0, 1, 1-strength * smoothInStrength, 1+strength * smoothInStrength); // apply strength and easing
				newScale = newScale.uniformScale(resize);
			});
			scalingAnim.easeFunction = EaseFunctions.Linear.InOut; // easefunction is used inside of the update event instead
			scalingAnim.duration = Infinity;
			scalingAnim.delay = delay;
			scalingAnim.start();
			
			// register this temp animation
			animationStarted(scalingAnim);
		}).byTime(delay);

		// return to allow chaining
		return self;
	}

	/**
	 * @description stop all active animations
	 * @description (use undefined for any argument to pick its default value)
	 * @param {number} delay delay - default: 0 seconds
	*/
	this.stop = function(delay = 0){
		// register
		registerCommand(this.stop, [...arguments]);

		new CreateDelay(function(){
			stop();
		}).byTime(delay);

		// return to allow chaining
		return self;
	}

	/**
	 * @description return all values back to original (before animations were applied)
	 * (overrides all other animations)
	 * @description (use undefined for any argument to pick its default value)
	 * @param {number} delay delay -  default: 0
	 * @param {number} duration duration -  default: .5
	 * @param {function} easeFunction easeFunction -  default: EaseFunctions.Cubic.InOut
	*/
	this.reset = function(delay = 0, duration = .5, easeFunction = EaseFunctions.Cubic.InOut){
		// register
		registerCommand(this.reset, [...arguments]);

		new CreateDelay(function(){
			stop();

			if(!objStillExists()) return;
			
			// reset starting values to true start instead of to current
			updateNewValues();

			// enable object on start
			obj.enabled = trueEnabled;
			
			// clear non-relative animations
			nonRelativeAnimationClear(nrPositionAnim);
			nonRelativeAnimationClear(nrScaleAnim);
			nonRelativeAnimationClear(nrRotationAnim);
			nonRelativeAnimationClear(nrBaseColorAnim);
	
			
			// convert toPosition from world space to local space on animation start (if not ScreenTransform)
			var toPosition = truePosition;
			if(!screenTrf){
				var parent = obj.getParent(); // use parent's transform for local-to-world conversion
				if(parent){
					const mat = parent.getTransform().getInvertedWorldTransform();
					toPosition = mat.multiplyPoint(toPosition);
				}
			}
	
			// position
			nrPositionAnim = new AnimateProperty(function(v){
				doPosition = true;

				if(!!screenTrf){
					newPosition = vec2.lerp(startPosition, toPosition, v);
				}else{
					newPosition = vec3.lerp(startPosition, toPosition, v);
				}
			});
			nrPositionAnim.easeFunction = easeFunction;
			nrPositionAnim.duration = duration;
			nrPositionAnim.endFunction = function(){ // non-relative animation, so let's update startValues to allow smooth transitions on end
				updateStartingValues();
			}
			nrPositionAnim.start();
	
			// scale
			nrScaleAnim = new AnimateProperty(function(v){
				doScale = true;

				if(!!screenTrf){
					newScale = vec2.lerp(startScale, trueScale, v);
				}else{
					newScale = vec3.lerp(startScale, trueScale, v);
				}
			});
			nrScaleAnim.easeFunction = easeFunction;
			nrScaleAnim.duration = duration;
			nrScaleAnim.endFunction = function(){ // non-relative animation, so let's update startValues to allow smooth transitions on end
				updateStartingValues();
			}
			nrScaleAnim.start();

			// rotation
			nrRotationAnim = new AnimateProperty(function(v){
				doRotation = true;

				newRotation = quat.slerp(startRotation, trueRotation, v);
			});
			nrRotationAnim.easeFunction = easeFunction;
			nrRotationAnim.duration = duration;
			nrRotationAnim.endFunction = function(){ // non-relative animation, so let's update startValues to allow smooth transitions on end
				updateStartingValues();
			}
			nrRotationAnim.start();

			// basecolor
			if(visual || text){
				nrBaseColorAnim = new AnimateProperty(function(v){
					doBaseColor = true;
					if(startBaseColor && trueBaseColor) newBaseColor = vec4.lerp(startBaseColor, trueBaseColor, v);
					if(startTextBaseColors && trueTextBaseColors) newTextBaseColors = {
						outline : vec4.lerp(startTextBaseColors.outline, trueTextBaseColors.outline, v),
						dropshadow : vec4.lerp(startTextBaseColors.dropshadow, trueTextBaseColors.dropshadow, v),
						background : vec4.lerp(startTextBaseColors.background, trueTextBaseColors.background, v)
					}
				});
				nrBaseColorAnim.easeFunction = easeFunction;
				nrBaseColorAnim.duration = duration;
				nrBaseColorAnim.endFunction = function(){ // non-relative animation, so let's update startValues to allow smooth transitions on end
					updateStartingValues();
				}
				nrBaseColorAnim.start();
			}
	

			// register this temp animation
			animationStarted(nrPositionAnim);
			animationStarted(nrScaleAnim);
			animationStarted(nrRotationAnim);
			if(visual || text) animationStarted(nrBaseColorAnim);
		}).byTime(delay);

		// return to allow chaining
		return self;
	}

	/**
	 * @description repeats all animations added so far
	 * (no animations can be added after this)
	 * @description (use undefined for any argument to pick its default value)
	 * @param {number} cutoffAfter cutoffAfter - delay before starting the loop
	*/
	this.loop = function(cutoffAfter = 1){
		registerCommand(this.loop, [...arguments]);

		new CreateDelay(function(){
			stop();
			loopCommands();
		}).byTime(cutoffAfter);

		// return to allow chaining
		return self;
	}
}




global.degToRad = function(degrees){
	const div = Math.PI/180;
	if(typeof degrees == 'number'){
		return degrees * div;
	}else{ // assume vec3 if not number
		const div = Math.PI/180;
		var _x = degrees.x * div;
		var _y = degrees.y * div;
		var _z = degrees.z * div;
		return new vec3(_x, _y, _z);
	}
}




global.radToDeg = function(radians){
	const div = 180/Math.PI;
	if(typeof radians == 'number'){
		return radians * div;
	}else{ // assume vec3 if not number
		var _x = radians.x * div;
		var _y = radians.y * div;
		var _z = radians.z * div;
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




global.projectPointToPlane = function(point, planePos, planeFwd, planeScale){
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




global.distanceToLine = function(p1, p2, p){
	let lineVector = p2.sub(p1);
	let pointVector = p.sub(p1);
	let t = pointVector.dot(lineVector) / lineVector.dot(lineVector);
	t = clamp(t);
	let closestPoint = p1.add(lineVector.uniformScale(t));
	let distanceVector = p.sub(closestPoint);
	return {dist:distanceVector.length, pos:closestPoint};
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
	 * @type {function}
	 * @description set the function to delay
	*/
	this.func = func;

	/**
	 * @type {array}
	 * @description array of arguments to pass on to the function
	*/
	this.args = args;

	/**
	 * @description returns true if currently counting down to call the function
	*/
	this.isWaiting = () => !!waitEvent;

	/**
	 * @type {number}
	 * @description the time at which this instance was created
	*/
	this.createdAtTime = getTime();

	/**
	 * @type {number}
	 * @description get the time left before the function is called (null if unused)
	*/
	this.getTimeLeft = function(){
		if(!waitEvent || waitEvent.getTypeName() != "DelayedCallbackEvent") return;
		return waitEvent.getTimeLeft();
	};

	/**
	 * @type {number}
	 * @description the frames left before the function is called (null if unused)
	*/
	this.getFramesLeft = () => framesLeft;

	/**
	 * @type {number}
	 * @description get the amount of time that was last given to wait (null if none yet)
	*/
	this.getGivenTime = () => givenTime;

	/**
	 * @type {number}
	 * @description get the amount of frames that was last given to wait (null if none yet)
	*/
	this.getGivenFrames = () => givenFrames;



	var framesLeft;
	var givenTime;
	var givenFrames;


	/**
	 * @argument {number} n
	 * @description schedule a function by n frames (int Number, will be rounded)
	*/
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
		givenFrames = wait;
		function onUpdate(){
			framesLeft = wait;

			if(wait <= 0){
				keepAlive.exec();
				script.removeEvent(waitEvent);
				waitEvent = null;
				framesLeft = null;
			}
			wait--;
		}

		stopWaitEvent();

		if(wait == 0){ // instant if n is 0
			framesLeft = 0;
			keepAlive.exec();
		}else{
			framesLeft = wait;
			waitEvent = script.createEvent("UpdateEvent");
			waitEvent.bind(onUpdate);
		}
	}

	/**
	 * @argument {number} t
	 * @description schedule a function by t seconds (Number)
	*/
	this.byTime = function(t){
		const keepAlive = {
			exec: function(){
				var _args = self.args;
				self.func.apply(null, _args);
			}
		}

		stopWaitEvent();

		var wait = t;
		givenTime = wait;
		if(wait == 0 || wait == undefined){
			keepAlive.exec();
		}else{
			waitEvent = script.createEvent("DelayedCallbackEvent");
			waitEvent.bind(function(){
				keepAlive.exec.bind(keepAlive)();
				stopWaitEvent();
			});
			waitEvent.reset(wait);
		}
	}

	/**
	 * @description call the function now
	*/
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
	 * @description stop the scheduled delay
	*/
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

	if(volume != null) audioComp.volume = volume;
	if(fadeInTime) audioComp.fadeInTime = fadeInTime;
	if(fadeOutTime) audioComp.fadeOutTime = fadeOutTime;

	if(offset != null){
		audioComp.position = offset;
		audioComp.pause();
		audioComp.resume();
	}

	if(mixToSnap) audioComp.mixToSnap = true;

	audioComp.play(1);

	function destroyAudioComponent(audioComp){
		audioComp.stop(false); // stop playing
		new global.DoDelay(function(){
			if(audioComp && !isNullPatch(audioComp)) audioComp.destroy(); // destroy if it still exists (might have been deleted using stopAllSoundInstances)
		}).byFrame(); // delete on next frame
	}
	new DoDelay( destroyAudioComponent, [audioComp]).byTime(audioComp.duration + .1); // stop playing after audio asset duration

	allSoundInstances.push(audioComp);
	return audioComp;
}




global.stopAllSoundInstances = function(){
	for(var i = 0; i < allSoundInstances.length; i++){
		var soundInstance = allSoundInstances[i];
		if(soundInstance && !isNullPatch(soundInstance)){
			soundInstance.stop(false);
			soundInstance.destroy();
		}
	}
	return allSoundInstances;
}




global.InstSoundPooled = function(listOfAssets, poolSize, waitTime, volume = 1){
	var self = this;

	var pool = [];
	var poolIndex = 0;
	var lastTime;

	function init(){
		// create sceneobject to create components on
		self.soundInstancesObject = global.scene.createSceneObject("soundInstancesObject");
		self.soundInstancesObject.setParent(script.getSceneObject()); // parent to lsqs

		// create instances
		for(var i = 0; i < poolSize; i++){
			var components = [];
			for(var j = 0; j < listOfAssets.length; j++){
				var thisAudioComp = self.soundInstancesObject.createComponent("Component.AudioComponent");
				thisAudioComp.audioTrack = listOfAssets[j];
				thisAudioComp.volume = volume;
				components.push(thisAudioComp);
			}
			pool.push(components);
		}
	}
	init();

	/**
	 * @type {SceneObject} 
	 * @description SceneObject that contains all the sound components for this pool (read-only)
	*/
	this.soundInstancesObject;

	/**
	 * @description call with audio asset index to play pooled sound
	*/
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
		if(volume != null) component.volume = volume;
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
	var _min;
	var _max;
	if(min.x != null){ // assume vec2
		_min = min.x;
		_max = min.y;
	}else if(min[0] != null){ // assume array
		_min = min[0];
		_max = min[1];
	}else{ // number
		_min = min;
		_max = max;
	}
	return Math.floor(remap(Math.random(), 0, 1, _min, _max));
}




global.randFloat = function(min, max){
	var _min;
	var _max;
	if(min.x != null){ // assume vec2
		_min = min.x;
		_max = min.y;
	}else if(min[0] != null){ // assume array
		_min = min[0];
		_max = min[1];
	}else{ // number
		_min = min;
		_max = max;
	}
	return remap(Math.random(), 0, 1, _min, _max);
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

function fract(float){
	var n = Math.abs(float); 
	var decimal = n - Math.floor(n);
	return decimal;
}

function floatToBits(float){
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
	
	if(raw.w == undefined){
		var a = [raw.x,raw.y, raw.z].map(function(v){
			return Math.floor(v * 65025 + 0.5) /65025; 
		});
		v = new vec4(a[0], a[1], a[2], 0);
	}

	return v.dot(MIN_POS_BITS_TO_FLOAT_CONSTANT);
}

global.encodeFloat = function(value, min, max){
	return floatToBits(remap(clamp(value, min, max), min, max, 0.0, ENCODE_MAX_VALUE));
}

global.decodeToFloat = function(value, min, max){
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




global.normalizeMeshScale = function(rmv){
	// get mesh bounding corners
	const aabbMin = rmv.localAabbMin();
	const aabbMax = rmv.localAabbMax();

	// get bbox
	const width = aabbMax.x - aabbMin.x;
	const height = aabbMax.y - aabbMin.y;
	const depth = aabbMax.z - aabbMin.z;

	// get max dimension
	const maxDimension = Math.max(width, height, depth);

	// normalize
	return vec3.one().uniformScale(1 / maxDimension);
}




global.shuffleArray = function(array){
	var shuffledArray = array.slice();

	for(var i = shuffledArray.length - 1; i > 0; i--){
		var j = Math.floor(Math.random() * (i + 1));
		[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
	}

	return shuffledArray;
}




global.concatArrays = function(a, b){
	var c = new (a.constructor)(a.length + b.length);
	c.set(a, 0);
	c.set(b, a.length);
	return c;
}




global.removeFromArray = function(item, array){
	let itemsToRemove = Array.isArray(item) ? item : [item]; // ensure array input
	let resultArray = array.filter(element => !itemsToRemove.includes(element));
	return resultArray;
}




global.MovingAverage = function(){
	var self = this;

	/**
	 * @argument {number} value
	 * @description Add a sample to the moving average
	*/
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
	 * @type {number} 
	 * @description The current average (get/set)
	*/
	this.average = null;

	/**
	 * @type {number} 
	 * @description The current sample count (get/set)
	*/
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
	 * @description starts this stopwatch
	*/
	this.start = function(){
		stopwatchStart = performance.now();
	}

	/**
	 * @description stops this stopwatch, prints the result to the console
	*/
	this.stop = function(){
		var diff = (performance.now() - stopwatchStart)/1000; // differents in seconds
		var thisAvg = avg.add(diff);
		print('duration: ' + diff.toString() + '\n' + 'rolling avg: ' + thisAvg.toString());
	}
}




global.setAllChildrenToLayer = function(sceneObj, layer){
	for(var i = 0; i < sceneObj.getChildrenCount(); i++){
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
		if(isNullPatch(startObj)) return found; // no starting object, return empty list
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
        if(originalFunction) originalFunction.apply(this, args);
        newFunction.apply(this, args);
    };
};




global.Callback = function(){
	var self = this;
	var callbacks = [];

	/**
	 * @description add a function to be called when running this.callback(...args)
	 * @param {function} f the function to be added
	 * @param {boolean} noAddedCallback if true, 'onCallbackAdded' is not called
	*/
	this.add = function(f, noAddedCallback=false){
		callbacks.push(f);
		if(!noAddedCallback && self.onCallbackAdded) self.onCallbackAdded(f);
	}

	/**
	 * @description remove a callback function (if it was added earlier)
	 * @param {function} f the function to be removed
	 * @param {boolean} noRemovedCallback if true, 'onCallbackRemoved' is not called
	*/
	this.remove = function(f, noRemovedCallback=false){
		for(let i = callbacks.length - 1; i >= 0; i--){
			if(callbacks[i] === f){
				callbacks.splice(i, 1);
			}
		}
		if(!noRemovedCallback && self.onCallbackRemoved) self.onCallbackRemoved(f);
	}

	/**
	 * @description call all functions (any arguments will be passed on)
	 * @param {...*} args the arguments to be passed to the callback function
	*/
	this.callback = function(...args){
		if(!self.enabled) return;
		for(var i = 0; i < callbacks.length; i++){
			callbacks[i](...args);
		}
	}

	/**
	 * @description get all callback functions
	 * @returns {Array} the current callback functions
	*/
	this.getCallbacks = function(){
		return callbacks;
	}

	/**
	 * @type {function}
	 * @description function called when a callback was added (assign to property)
	 * @param {function} callbackName - The function that was aded
	*/
	this.onCallbackAdded = function(thisFunction){};

	/**
	 * @type {function}
	 * @description function called when a callback was removed (assign to property)
	 * @param {function} callbackName - the function that was removed
	*/
	this.onCallbackRemoved = function(thisFunction){};

	/**
	 * @type {boolean}
	 * @description when false, callback() will not call anything
	*/
	this.enabled = true;

	/**
	 * @description clear all callbacks (does not call onCallbackRemoved)
	*/
	this.clear = function(){
		callbacks = [];
	}
}



global.Flags = function(){
	var self = this;
	var flags = {};

	/**
	 * @description add a flag (or change existing)
	 * @param {string} name the name of the flag (will create new flag if none exist yet)
	 * @param {boolean} bool the value of this flag
	*/
	this.set = function(name, bool){
		if(flags[name] === bool) return; // no change made
		flags[name] = bool;
		updateState();
		self.onChange.callback(state);
	}

	/**
	 * @description callback to bind to, called any time a flag is changed (with callback argument 'state' object)
	*/
	this.onChange = new Callback();

	/**
	 * @description returns current state object
	*/
	this.getState = function(){
		return state;
	}

	/**
	 * @description returns flags object
	*/
	this.getFlags = function(){
		return flags;
	}

	/**
	 * @description clears flags object
	*/
	this.clear = function(){
		flags = {};
	}

	
	// private
	var state = {
		anyTrue : null,
		allTrue : null,
		noneTrue : null,
		anyFalse : null,
		allFalse : null,
		noneFalse : null
	};

	// set states
	function updateState(){
        let anyTrue = false;
        let allTrue = true;
        let anyFalse = false;
        let allFalse = true;

        for(let key in flags){
            const flag = flags[key];

            if(flag === true){
                anyTrue = true;
                allFalse = false;
            }else{
                anyFalse = true;
                allTrue = false;
            }

            if(anyTrue && anyFalse){
                allTrue = false;
                allFalse = false;
                break;
            }
        }

        state.anyTrue = anyTrue;
        state.allTrue = allTrue;
        state.noneTrue = !anyTrue;
        state.anyFalse = anyFalse;
        state.allFalse = allFalse;
        state.noneFalse = !anyFalse;
    }
}




global.nullish = function(a, b){
    return (a !== undefined && a !== null) ? a : b;
}




global.VisualizePoints = function(showPointsOnStart){
	var self = this;

	/**
	 * @type {SceneObject}
	 * @description (optional) SceneObject to parent the points to (default is LSQuickScripts SceneObject)
	*/
	this.parent = script.getSceneObject();

	/**
	 * @type {vec3}
	 * @description (optional) scale multiplier for the mesh when created (vec3)
	*/
	this.scale;

	/**
	 * @type {Material}
	 * @description (optional) the material on the mesh (Asset.Material)
	*/
	this.material;

	/**
	 * @type {Asset.RenderMesh}
	 * @description (optional) the mesh to show on each point (Asset.RenderMesh, default is a unit box)
	*/
	this.mesh;

	/**
	 * @type {number}
	 * @description (optional) maximum amount of points to show, starts cutting off indices at 0 (default is null for unlimited)
	*/
	this.maxCount;



	/**
	 * @description show points, returns the array of created SceneObjects
	*/
	this.show = function(allPoints){
		// make array
		if(!Array.isArray(allPoints)) allPoints = Array.from(arguments);

		// remove existing
		self.clear();

        // add new
        return self.add(allPoints);
	};



    /**
	 * @description append to points, returns the total array of created SceneObjects
	*/
    this.add = function(allPoints){
		// make array
		if(!Array.isArray(allPoints)) allPoints = Array.from(arguments);

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
			}else if(pointType == 'object'){ // position, rotation, scale, text label
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
    }



	/**
	 * @description get all objects' transform components (<Transform> array)
	*/
	this.getTransforms = function(){
		return allTransforms;
	}



	/**
	 * @description destroy all objects
	*/
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




global.rankedAction = function(label, prio, func){
	// store a given action/prio combo (creates store and label if not already there)
	function store(){
		if(!script.rankedActionStore) script.rankedActionStore = {}; // create store
		if(!script.rankedActionStore[label]) script.rankedActionStore[label] = {}; // create label
		script.rankedActionStore[label].func = func; // assign function
		script.rankedActionStore[label].prio = prio; // assign prio
	}

	if(script.rankedActionStore){ // if a store was already made by another script
		if(script.rankedActionStore[label]){ // if this specific label already exists in the store
			if(prio > script.rankedActionStore[label].prio) store(); // store this new action if new prio is greater than existing
		}else{ // if label does not exist yet
			store(); // store new action under new label
		}
	}else{ // if this is the first script to make a store
		store(); // initialize with new action
	}
	
	// do check at end of frame
	var rankedActionEvent = script.createEvent("LateUpdateEvent");
	rankedActionEvent.bind(function(){ // the end-of-frame check
		for(const thisLabel in script.rankedActionStore){ // go through all labels' stored data
			if(script.rankedActionStore[thisLabel].func) script.rankedActionStore[thisLabel].func(); // call winner
			delete script.rankedActionStore[thisLabel]; // remove from list (but keep the overall store)
		}
		script.removeEvent(rankedActionEvent); // only do this for one frame
	});
}
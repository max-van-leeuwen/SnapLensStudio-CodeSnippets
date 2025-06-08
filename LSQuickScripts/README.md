# 📜 LSQuickScripts
My Cheat Sheet of handy JS snippets for Lens Studio!
<br>I always include this in my projects.

*Updated regularly!*

<br>

## Installation
Throw `LSQuickScripts.js` on a SceneObject at the top of your scene.

<br>

## Features
- Game dev/maths helpers
- Useful animation classes (including QuickFlow)
- Sound instancing and pooling
- Lens Studio API helpers
- Debugging helpers
- and more :)


<br><br>

<p align="center">
	<small><i>Game dev/maths helpers</small></i><br>
  <img src="https://github.com/max-van-leeuwen/SnapLensStudio-CodeSnippets/blob/main/LSQuickScripts/Media/preview_LSQS.gif" />
	<br><br><br>
	<small><i>QuickFlow animations</small></i><br>
  <img src="https://github.com/max-van-leeuwen/SnapLensStudio-CodeSnippets/blob/main/LSQuickScripts/Media/preview_quickflow.gif" />
</p>


<br><br><br>
  
## Documentation

```


CREDITS
-------------------
Snap Inc.

Tween.js - Licensed under the MIT license
https://github.com/tweenjs/tween.js
See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
-------------------






HOW TO USE
-------------------



lsqs : Script Component
 Returns the Script component this script is on.



-



EaseFunctions : object
	Contains all Tween Easing Functions, with their In/Out/InOut types.
	Use it on any number to get its lookup-value back.
	These functions can be used with Interp and AnimateProperty.

		All types, don't forget to add In/Out/InOut
			Linear
			Quadratic
			Cubic
			Quartic
			Quintic
			Sinusoidal
			Exponential
			Circular
			Elastic
			Back
			Bounce

		Usage example
			var n = 0.3
			var n_eased = global.Easing.Cubic.In(n)
				n_eased == 0.027



-



interp(  startValue [number],
         endValue [number],
         t [number],
         easing (optional) [function],
         unclamped (optional) [bool]
) : number
	Returns the value of t interpolated using an Easing Function, remapped to start and end values.
	Is identical to a linear lerp() when no Easing Function is given.
	Use one of the Easing Functions in global.EaseFunctions, or use your own!

		Examples, [-5, 5] at position x
			Cubic in/out	interp(-5, 5, x, EaseFunctions.Cubic.InOut)
			Linear (lerp)	interp(-5, 5, x)
			Custom			interp(-5, 5, x, function(v){ return v })



-



AnimateProperty() : AnimateProperty object
	Creates an easy-to-use animation instance. Can be used to quickly animate any property, using just a couple lines of code!

		Example, showing all possible properties

			var anim = new AnimateProperty( updateFunction (optional) )		// create a new animation instance called 'anim'
			anim.startFunction = function(inAnim){}							// called on animation start ('inAnim' is a bool, true when getReversed() is false)
			anim.updateFunction = function(v, vLinear, runtime){}			// called on each animation frame, with animation value (0-1) as its first argument. the second argument is the linear animation value. these ranges are exclusive for the first step, and inclusive for the last step of the animation (so when playing in reverse, the range becomes (1, 0]). the third argument is runtime (seconds).
			anim.endFunction = function(inAnim){}							// called on animation end ('inAnim' is a bool, true when getReversed() is false)
			anim.onReverseChange = function(){}								// called when the forwards direction of the animation is changed
			anim.duration = 1												// duration in seconds, default is 1. tip: for a continuous animation, set duration to Infinity and use the 'runtime' argument in the updateFunction
			anim.reverseDuration = 1										// reverse duration in seconds, default is .duration
			anim.delay = 0													// delay before starting animation, default is 0
			anim.reverseDelay = 0											// delay before starting animation when reversed, default is .delay
			anim.easeFunction = EaseFunctions.Cubic.In						// animation look-up curve, default is EaseFunctions.Cubic.InOut
			anim.reverseEaseFunction = EaseFunctions.Cubic.Out				// animation look-up curve when reversed, default is .easeFunction
			anim.pulse(newTimeRatio)										// sets the animation once to this linear time ratio (0-1), stops current animation
			anim.getTimeRatio()												// get current linear animation time (0-1)
			anim.setReversed(reverse)										// set animation direction, toggles if no argument given. reverse: 'true' to set to reverse.
			anim.getReversed()												// returns true if the animation is currently reversed
			anim.isPlaying()												// returns true if the animation is currently playing (waiting for delay also counts as playing)
			anim.setCallbackAtTime(v, f)									// registers a callback function on the first frame that v >= t (or v <= t if playing reversed). only 1 callback is supported at this time. call without arguments to clear. v: the linear animation time (0-1) at which to call this callback. f: the function to call.
			anim.start(atTime, skipDelay)									// start the animation. atTime: (optional) time ratio (0-1) to start playing from. skipDelay: (optional) ignore the delay value.
			anim.stop(callEndFunction)										// stop the animation. callEndFunction: (optional) whether to call the .endFunction (if animation was still playing), default is false.
         anim.pause()                                                    // pause amimation (if playing)
         anim.resume()                                                   // resume amimation (if paused)

		Example, smoothly animating transform 'trf' one unit to the right (default duration is 1 second)

			var anim = new AnimateProperty()
			anim.updateFunction = function(v){
				trf.setLocalPosition(new vec3(v, 0, 0))
			}
			anim.start()



getAllAnimateProperty() : AnimateProperty array
	Get a list of all AnimateProperty instances. Useful when you want to forcibly stop all instances running in your lens at once, without keeping track of them.



-



QuickFlow(obj [SceneObject]) : QuickFlow object
	The fastest way to animate objects, using a single line of code!
	All animations work for orthographic and perspective objects.
	- IN BETA: You might encounter unexpected behavior from time to time.
		
		Example:

			var anim = new QuickFlow(script.object)											// create an instance
			anim.fadeIn(duration, delay, easeFunction)										// start fade-in (if a visual or text component is present), automatically enables the sceneobject.


		All animations and their (optional) arguments:

			.fadeIn(delay, duration, easeFunction)											// start fade-in (enables SceneObject on start)
			.fadeOut(delay, duration, easeFunction)											// start fade-out (disables SceneObject and all running animations on end)
			.scaleIn(delay, duration, easeFunction, startAtTime)							// start scale-in (enables SceneObject on start)
			.scaleOut(delay, duration, easeFunction, startAtTime)							// start scale-out (disables SceneObject and all running animations on end)
			.squeeze(delay, strength, duration)												// do scale squeeze
			.rotateAround(delay, rotations, axis, duration, easeFunction)					// do rotational swirl
			.scaleTo(delay, toScale, duration, easeFunction)						        // scale towards new size (overrides other rotation animations)
			.moveTo(delay, point, isLocal, duration, easeFunction)							// move towards new position (local screen space if ScreenTransform, world space if Transform) (overrides other position animations)
			.keepBlinking(delay, interval, strength, easeFunction)							// keep blinking
			.lookAt(delay, point, duration, easeFunction)									// rotate to look at a point (local screen space if ScreenTransform, world space if Transform) (overrides other rotation animations)
         .bounce(delay, duration, strength, easeFunctionIn, easeFunctionOut)             // do a short scale-bump
			.keepRotating(delay, speed, axis)												// keep rotating around an axis
			.keepBouncingRotation(delay, strength, interval, axis, easeFunction, smoothIn)	// keep bouncing a rotation around an axis
			.keepBouncingPosition(delay, distance, interval, axis, easeFunction, smoothIn)	// keep bouncing a position up and down along an axis
			.keepBouncingScale(delay, strength, interval, easeFunction, smoothIn)			// keep bouncing a scale
			.stop(delay)																	// stop active animations
			.reset(delay, duration, easeFunction)											// stop and undo animations
			.loop	 																		// repeats all animations added so far (animations added chronologically after this loop's cutoff are not visible)
         .getSceneObject()                                                               // returns active SceneObject
         .initialize()                                                                   // re-initializes QuickFlow using current transforms as starting point
         .getTimeLeft()                                                                  // get total duration of all current animations (looping excluded)
		

		Each animation returns this QuickFlow object, making them chainable into one-liners:
		
			- new QuickFlow(object).rotateAround(0, 1)														            // instantly do 1 clockwise rotation
			- new QuickFlow(object).fadeOut(0, .5).scaleOut(0, .5)											            // fade-out and scale-out, for 0.5 seconds
			- new QuickFlow(object).keepBlinking().squeeze(.5)												            // blinking alpha, squeeze after half a second
			- new QuickFlow(object).moveTo(0, new vec3(0,100,0), false, 1).reset(1, .6, EaseFunctions.Bounce.Out)	    // move 1m up for 1s, after 1s reset (go back down) with a bouncing animation of 0.6s
			- new QuickFlow(object).moveTo(0, new vec2(0,1), false, 1).reset(1, .6, EaseFunctions.Bounce.Out)		    // same as above, but for a 2D ScreenTransform
			- new QuickFlow(object).keepBouncingPosition().keepBouncingScale().keepBouncingRotation()		            // continuous wiggly animation

     If an object's transforms has been modified by other scripts in the meantime, you can re-initialize quickflow easily:

         const qf = new QuickFlow(visual)                                                // a QuickFlow object for 'visual'
         qf.initialize().scaleOut()                                                      // scale-out 'visual' using its current transforms as starting point


		Tips:
         - setting arguments to 'undefined' will use default values
			- first argument of any animation is always 'delay' (s), which is 0 by default
			- after the last out-animation finishes playing, the SceneObject will automatically disable (e.g. fadeOut, scaleOut)
			- when chaining animations in a one-liner, it helps with readibility to chain them chronologically! (Increasing delay values left to right)
			- animations like 'reset' and 'stop' only apply to the animations that started before they did, animations with a greater delay will still play



-



degToRad(degrees [Number/vec3]) : number/vec3
	Converts number or vec3 of degrees to number or vec3 of radians.



radToDeg(radians [Number/vec3]) : number/vec3
	Converts number or vec3 of radians to number or vec3 of degrees.



-



isInFront(pos1 [vec3], pos2 [vec3], fwd [vec3]) : bool
	Checks if pos1 is in front of pos2, assuming pos2 has normalized forward vector fwd.



-



pointInBox(point [vec3], unitBoxTrf [Transform], getRelativePosition (optional) [Bool] ) : vec3
	Checks if a world position is within the boundaries of a unit box (by its Transform). The box can be moved, rotated, and scaled non-uniformly.
	Returns an object with two values:
		'isInside': boolean
		'relativePosition': (only if getRelativePosition is true) a vec3 with normalized positions relative to the box (-1 to 1, unclamped)



-



planeRay(    point [vec3],
             dir [vec3],
             planePos [vec3],
             planeFwd [vec3],
             anyDirection (optional) [bool]
) : vec3
	Checks if a line ('point' with normalized direction 'dir') intersects a plane (position 'planePos' with normal 'planeFwd'). Returns world position (vec3) if it does, returns null otherwise. Allow backside of plane when 'anyDirection' is true.



-



projectPointToPlane(point [vec3], planePos [vec3], planeFwd [vec3], planeScale [vec2]) : vec2
	Projects a 3D point onto a plane with custom position, orientation, and non-uniform scale. Returns normalized 2D coordinates on plane at this position.



-



distanceAlongVector(pos1 [vec3], pos2 [vec3], fwd [vec3]) : vec3
	Returns the distance between two 3D points along a normalized vector.



-



distanceToLine(p1 [vec3], p2 [vec3], point [vec3]) : {dist:number, pos:vec3}
	Returns info about the position on the line (p1-p2) that's closest to the given point (vec3).



-



hsvToRgb(h [number], s [number], v [number]) : vec3
	Returns the RGB color for a Hue, Saturation, and Value. Inputs and outputs are in range 0-1.



rgbToHsv(rgb [vec3/vec4]) : vec3
	Returns the Hue, Saturation, and Value for the specified color (can be vec3 or vec4). Inputs and outputs are in range 0-1.



-



DoDelay( function (optional) [function],
         arguments (optional) [Array]
) : DoDelay object
	An object that makes it easy to schedule a function to run in the future (by frames or by seconds).

		Example, showing all properties

			var delayed = new doDelay()
			delayed.func = function(){} 					// the function to call after a delay
			delayed.args = []								// function arguments should be given as an array
			delayed.byFrame(10)								// this will call the function in 10 frames (function is called on the next frame if no argument given, or instantly if arg is '0') - the DoDelay instance is returned
			delayed.byTime(10)								// this will call the function in 10 seconds (function is called instantly if no argument given or if arg is '0') - the DoDelay instance is returned
			delayed.now()									// call the function with the given arguments now
			delayed.stop()									// this will cancel the scheduled function
         delayed.pause()                                 // pause (if running)
         delayed.resume()                                // resume (if paused)
			delayed.isRunning()								// returns true if currently counting down to call the function
			delayed.createdAtTime							// the time at which this instance was created
			delayed.getTimeLeft()							// get the time left before the function is called (null if unused)
			delayed.getFramesLeft()							// get the frames left before the function is called (null if unused)
			delayed.getGivenTime()							// get the amount of time that was last given to wait (null if none yet)
			delayed.getGivenFrames()						// get the amount of frames that was last given to wait (null if none yet)

		In one-liner format:

			var delay = new DoDelay(func, args).byTime(5)	// calls function with arguments (array) after 5 seconds



getAllDelays() : DoDelay array
	Returns all delays created using 'DoDelay'. This includes expired delays.



-


instSound(
			audioAsset [Asset.AudioTrackAsset]
			volume (optional) [number]
			fadeInTime (optional) [number]
			fadeOutTime (optional) [number]
			offset (optional) [number]
			mixToSnap (optional) [bool]
) : AudioComponent
	Plays a sound on a new (temporary) AudioComponent, which allows multiple plays simultaneously without the audio clipping when it restarts.
	This function returns the AudioComponent! But be careful, the instance of this component will be removed when done playing.
	Don't use on Spectacles! There is a limit of 32 components, so you should use InstSoundPooled with a small poolSize instead.



getAllSoundInstances() : AudioComponent array
	Returns all sound instances created using 'instSound'.



-



InstSoundPooled( listOfAssets [List of Asset.AudioTrackAsset],
                 poolSize [number],
                 waitTime (optional, default .1) [number],
                 volume (optional, default 1) [number]
) : InstSoundPooled Object
	Create a pool of audio components, one component for each given asset, times the size of the pool (so the total size is listOfAssets.length * poolSize).
	This function does essentially the same as 'instSound', except in a much more performant way when playing lots of sounds (poolSize determines the amount of overlap allowed before looping back to the start of the pool).
	The 'waitTime', if given, makes sure the next sound instance can only be played after this many seconds, to prevent too many overlaps. This is useful when making a bouncing sound for physics objects.
	'Volume' Sets the AudioComponent's volume (default is 1).
	

	The 'instance' function has two optional arguments: the first is the index of the sound to be played (a random index is picked if it is null). The second is the volume override (0-1 number).

		For example, if you want to randomly pick laser sounds coming from a gun.
		The following parameters give it a maximum of 10 plays, with 0.2 seconds inbetween, before looping back to the first sound component:

			var soundPool = new InstSoundPooled( [script.laserSound1, script.laserSound2, script.laserSound3], 10, 0.2)
			function onFiringLaser(){
				soundPool.instance() 	// call 'onFiringLaser()' whenever you want to hear one of the laser sound samples!
			}



-



clamp(value [number], low (optional, default 0) [number] ), high (optional, default 1) [number] ) : number
	Returns the clamped value between the low and high values. NaN is 0.



-



randSeed(seed [int]) : number
	Returns a random value (0-1) based on an input seed. Uses mulberry32.



smoothNoise(seed [number]) : number
 Simple and very cheap Fractal Noise, outputs continuous 0-1 based on seed. Useful for quickly making things wiggle.



randInt(min [int], max [int], seed [int] (optional)) : number
OR
randInt(range [array size 2], seed [int] (optional)) : number
OR
randInt(range [vec2], seed [int] (optional)) : number
	Returns a random rounded integer between min (inclusive) and max (exclusive).



randFloat(min [number], max [number], seed [int] (optional)) : number
OR
randFloat(range [array size 2], seed [int] (optional)) : number
OR
randFloat(range [vec2], seed [int] (optional)) : number
	Returns a random number within a range min (inclusive) and max (exclusive).



randArray(array [Array], seed [int] (optional)) : Object
	Returns one random object from the given array



pickRandomDistributed(objects [Object], seed [number] (optional)) : Object
	Picks one of the items in an object, based on the odds of a property called 'chance'!
	The 'chance' values are automatically normalized, so they don't need to add up to 1 like in this example.
 Seed is optional, this ensures the same items are picked each time.

		var list = {
			item1 : {name:'item1', chance:0.1}, // this item has a 10% chance of being chosen
			item2 : {name:'item2', chance:0.6}, // 60% chance
			item3 : {name:'item3', chance:0.3}, // 30% chance
		}
		var picked = pickRandomDistributed(list)
		picked.name == (randomly picked from list)



stringToInt(string [string]) : int
 Creates a unique int (non-negative, 32-bit) out of a string, using the DJB2 hash algorithm.



-



remap(   value [number]
		    low1 [number]
		    high1 [number]
		    low2 (optional, default 0) [number]
		    high2 (optional, default 1) [number]
		    clamped (optional, default false) [Bool]
) : number
	Returns value remapped from range low1-high1 to range low2-high2.



centerRemap( value [number],
             center (optional, default 0.5) [number],
             width (optional, default 0) [number]
) : Object
	Remaps the value (0-1) to 0-1-0, with a custom center and a width for the center.
	Returns an object containing 'remapped' [number] and 'passedCenter' [int] (0=not passed, 1=within center width, 2=after center).



-



encodeFloat(data [number], min [number], max [number]) : vec4
	Equivalent of the 'Pack' node in the material graph editor (32-bits).



decodeToFloat(encoded data [vec4], min [number], max [number]) : number
	Equivalent of the 'Unpack' node in the material graph editor (32-bits).



-



screenToScreenTransform(screenPos [vec2]) : vec2
	Returns ScreenTransform anchor center position (range -1 - 1) from screen coordinates (0-1, inversed y-axis).
	Inverse of scrTransformToScreen().



screenTransformToScreen(screenTransformCenter [vec2]) : vec2
	Returns screen coordinates (range 0-1) of Screen Transform anchors center.
	Inverse of screenToScrTransform().



-



normalizeMeshScale(rmv [Component.RenderMeshVisual]) : vec3
	Get a scale multiplier to make a mesh's local scale 1x1x1 in the largest dimension.

		Example

			const scalar = normalizeMeshScale(script.rmv)
			script.rmv.getTransform().setLocalScale(scalar)



-



shuffleArray(array [array]) : array
	Returns a randomly shuffled copy of the array.



-



concatArrays(array [any], array [any]) : array
	Concatinates two arrays and returns the new one.



-



removeFromArray(item [any, or array of any], array [any]) : array
	Removes item (or an array of items) from the given array, returns the resulting array.



-



MovingAverage() : MovingAverage Object
	An object that makes it easy to keep track of a 'rolling' average.

		Example, showing all properties

			var avg = new movingAverage()
			avg.add(v)									// usually the only thing you need, returns the new average and updates the sampleCount.
			avg.average									// gets/sets the current average value (usually read-only, but in some cases you might want to set this to a starting value)
			avg.sampleCount 							// gets/sets the current sample count value (usually read-only, but in some cases you might want to set this to a starting value)
			


-



setAllChildrenToLayer(sceneObj [sceneObject], layer [LayerSet])
	Sets the sceneObject and all objects underneath it to a specific render layer (by LayerSet).



-


rotateCoords(point [vec2], pivot [vec2], angle [number]) : vec2
	Rotate a 2D point around a pivot with specified angle (radians). Returns new 2D position.



-



circularDistance(a [number], b [number], mod [number]) : number
	Returns the closest distance from a to b if the number line is a circle with radius 'mod'. For example: if mod is 1, the distance between 0.9 and 0.1 would be 0.2.



-



mod(a [number], b [number]) : number
	Modulo, like the % operator, but this respects negative numbers.
	For example, mod(-1, 3) returns 2. Whereas -1%3 would return -1.



-



measureWorldPos( screenPos [vec2],
                 screenTrf [Component.ScreenTransform],
                 cam [Component.Camera], dist [number]
) : vec3
	Returns the world position of a [-1 - 1] screen space coordinate, within a screen transform component, at a distance from the camera.
	Useful, for example, to measure out where to place a 3D model in the Safe Region, so it won't overlap with Snapchat's UI.



-



getAllChildObjects(  componentName (optional) [string]
					    startObj (optional) [SceneObject]
					    dontIncludeStartObj (optional) [bool]
					    maxCount (optional) [number]
) : Array (Components)
	Returns an array containing all components of type componentNames, also those on child objects.
	If no componentName is given, all SceneObjects and child SceneObjects are returned instead.
	If no startObj is given, the whole scene is searched.
	If dontIncludeStartObj is true, the startObj will not be included in the final list.
 If maxCount is given, the search stops after having found a specific amount of components.

		Example
			var components = getAllChildObjects("Component.VFXComponent")
				components == [Array of all VFX Component in the scene]

         var objects = getAllChildObjects("", obj)
             objects == [Array of all SceneObjects under 'obj']



-



parseNewLines(txt [string], customSplit (optional) [string]) : string
	Takes a string passed in through an input string field containing '\n', and returns the same string but with real newlines (for use in a Text Component, for example).
	If customSplit is given, it replaces the '\n'-lookup with other character(s).



pad(int [number], size [number]) : string
	Takes a number and a padding amount, and returns a padded string of the number.

		Example
			var s = pad(30, 4)
				s == "0030"



getOrdinalPlace(int [number]) : string
 Returns 'nd' for 2 (2nd), 'rd' for 3 (3rd), etc.



-



median(arr [Array]) : number
	Takes an array of Numbers, and returns the median value.



-



lookAtUp(posA [vec3], posB [vec3], offset) : quat
	Takes two world positions, returns the look-at rotation for A to look at B with the Y axis locked (so only .x and .z are used).
	Useful when objects have to face the user, but they are not allowed to rotate facing up or down.
	Use the optional 'offset' for a 0 - 2PI rotation offset.



-



mat4FromDescription(matDescription [string]) : mat4
	Returns a mat4, based on a mat4's string description. Useful when trying to retrieve one stored as JSON format.



-



wrapFunction(originalFunction [function], newFunction [function]) : function
	Wrap two functions into one. Works with arguments.



-



Callback(callback [function]) : Callback object
	Makes a callback signal that you can bind functions to. Returns an object.

		Example, showing all properties

			function someFunction(arg1, arg2){} 					// a function to be called at a certain time

			var c = new Callback()									// create instance
			c.add(someFunction, noAddedCallback)					// add a function to be called when running this.callback(...args), with optional noAddedCallback (default is false)
			c.remove(someFunction, noRemovedCallback)				// Remove a callback function (if it was added earlier), with optional noRemovedCallback (default is false)
			c.callback(a, b)										// call all functions (any arguments will be passed on)
			c.getCallbacks()										// get all callback functions
			c.onCallbackAdded										// function called when a callback was added (assign to property)
			c.onCallbackRemoved										// function called when a callback was removed (assign to property)
			c.enabled = true										// when false, callback() will not call anything
			c.clear()												// clear all callbacks (does not call onCallbackRemoved)



-



Flags() : Flags object
	Creates a flags object that you can assign flags with unique names and boolean values to.
	Each time a flag is added or modified, a 'state' object is returned in the callback function, giving you information about the combined flags.

		Example, showing all properties

			var flags = new Flags()											// create instance
			flags.onChange.add(function(state){ print(state.anyTrue) })		// on flag change, print if any of the flags are true
			flags.set('flag1', false)										// add a flag called 'flag1', value false		-		callback now prints 'false'
			flags.getState()												// returns current state object
			flags.getFlags()												// returns flags object
			flags.clear()													// clears flags object

		States object contains the following bools:
			anyTrue
			allTrue
			noneTrue
			anyFalse
			allFalse
			noneFalse



-



nullish(a, b) : a ?? b
	Simple replacement for nullish coalescing operator ('??', useful if this operator doesn't exist)



-



VisualizePoints() : VisualizePoints object
	An instanced function that places a mesh on each point in the given array. Useful for quick visualization of 3D points in your scene.
	For a one-liner (optional), pass the array of points as the first argument.

		Points can be defined in 3 ways: positions (vec3), Objects (position, rotation, scale, text label), or transformation matrices (mat4)
			points = [ vec3 ]
			points = [ {position: vec3, (optional) rotation: quat, (optional) scale: vec3, (optional) label: string} ]
			points = [ transform (mat4) ]

		Example, showing all properties

			var v = new VisualizePoints(points)							// create instance ('points' argument is optional, this will invoke .show(points) right away)
			v.parent													// (optional) SceneObject to parent the points to (default is LSQuickScripts SceneObject)
			v.scale														// (optional) scale multiplier for the mesh when created (vec3)
         v.labelFontSize                                             // (optional) label font size (default is 48)
			v.material													// (optional) the material on the mesh (Asset.Material)
			v.mesh														// (optional) the mesh to show on each point (Asset.RenderMesh, default is a unit box)
			v.maxCount													// (optional) maximum amount of points to show, starts cutting off indices at 0 (default is null for unlimited)
			v.show(points)												// show points, returns the array of created SceneObjects
			v.add(points)												// append to points, returns the total array of SceneObjects
			v.getSceneObjects()											// get all SceneObjects
			v.clear()													// destroy all objects



-



rankedAction(label [string], prio [number], func [function])
	Ranked Actions make it easy to compare a bunch of features coming from different scripts on the same frame, and only call the one with the highest priority at the end of the frame (LateUpdateEvent).

	An example of when this would be useful:
		Imagine a scene containing a button and another tap event of some kind.
		When the user taps on the button, the other event is also triggered.
		By having the actions of both interactables pass through rankedAction first, the highest-prio action at the end of each frame is triggered and the other is ignored.
     -> In lots of cases with screen taps, the issue can be resolved with Interaction Components!

	All actions to be pooled together should have the same label. At the end of each frame, all pools are cleared.



-------------------
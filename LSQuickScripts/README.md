<p class="has-line-data" data-line-start="1" data-line-end="2">Cheat sheet for my most-used JS snippets in Lens Studio. Will update this every once in a while. Example project included!</p>
<p class="has-line-data" data-line-start="1" data-line-end="2">Installation: Throw the LSQuickScripts.js on a SceneObject and you can call all functions from any script in the project.</p>
<br>
<p class="has-line-data" data-line-start="11" data-line-end="12">Some examples: <a href="https://gfycat.com/dishonestflimsyafricanmolesnake">https://gfycat.com/dishonestflimsyafricanmolesnake</a></p>
<br>
<p class="has-line-data" data-line-start="2" data-line-end="5"><a href="https://twitter.com/maksvanleeuwen">Twitter (@maksvanleeuwen)</a>
<br><br>

<pre><code>
Max van Leeuwen
twitter      @maksvanleeuwen
instagram    @max.van.leeuwen
maxvanleeuwen.com



LSQuickScripts - A cheat sheet of Lens Studio Javascript snippets that I often use.






CREDITS
-------------------
Snap Inc.

chatGPT :)

Tween.js - Licensed under the MIT license
https://github.com/tweenjs/tween.js
See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
-------------------






HOW TO USE
-------------------


lsqs : Script Component
 Returns the Script component this script is on.



-


EaseFunctions : Object, containing Functions
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



interp(startValue [Number], endValue [Number], t [Number], easing (optional) [Function], unclamped (optional) [bool]) : Number
	Returns the value of t interpolated using an Easing Function, remapped to start and end values.
	Is identical to a linear lerp() when no Easing Function is given.
	Use one of the Easing Functions in global.EaseFunctions, or use your own!

		Examples, [-5, 5] at position x
			Cubic in/out	interp(-5, 5, x, EaseFunctions.Cubic.InOut)
			Linear (lerp)	interp(-5, 5, x)
			Custom			interp(-5, 5, x, function(v){ return v })



AnimateProperty() : AnimateProperty object
	Creates an easy-to-use animation instance. Can be used to quickly animate any property, using just a couple lines of code!

		Example, showing all possible properties

			var anim = new AnimateProperty( updateFunction (optional) )		// create a new animation instance called 'anim'.
			anim.startFunction = function(){}								// function to call on animation start.
			anim.updateFunction = function(v, vLinear){}					// function to call on each animation frame, with animation value (0-1, inclusive) as its first argument. The second argument is the linear animation value. These ranges are exclusive for the first step, and inclusive for the last step of the animation (so when playing in reverse, the range becomes (1, 0]).
			anim.endFunction = function(){}									// function to call on animation end.
			anim.duration = 1												// duration in seconds. Default is 1.
			anim.reverseDuration = 1										// duration in seconds when reversed. If no value assigned, default is equal to duration.
			anim.delay = 0													// delay after starting animation. Default is 0.
			anim.reverseDelay = 0											// delay after starting animation in reverse. Uses anim.delay if none is given.
			anim.easeFunction = EaseFunctions.Cubic.In						// determines curve. Default is Cubic.InOut. All EaseFunctions can be used, or use a custom function.
			anim.reverseEaseFunction = EaseFunctions.Cubic.Out				// determines curve on reverse playing. Uses anim.easeFunction if none is given.
			anim.pulse(newTimeRatio)										// updates the animation once, stops the currently running animation. Sets the time value to newTimeRatio (linear 0-1).
			anim.getTimeRatio()												// the current linear, normalized animation time (0 on animation start, 1 on animation end, regardless of whether animation is reversed).
			anim.setReversed(reverse)										// if reversed, the animation plays backwards. 'Reverse' arg should be of type Bool.
			anim.getReversed()												// returns true if the animation is currently reversed.
			anim.isPlaying()												// returns true if the animation is currently playing.
			anim.setCallbackAtTime(v, function)								// registers a callback function on the first frame that v >= t (or v <= t if playing reversed). Call without arguments to clear.
			anim.start(newTimeRatio, skipDelay)								// starts the animation (resumes where last play ended, starts from beginning if last play was finished). Optional 'atTime' argument starts at normalized linear 0-1 time ratio. Optional skipDelay bool skips the delay on this animation once.
			anim.stop(callEndFunction)										// stop the animation at its current time. With an optional argument to call the endFunction (argument should be a bool, default is false).

		Example, smoothly animating transform 'trf' one unit to the right (default duration is 1 second)

			var anim = new AnimateProperty()
			anim.updateFunction = function(v){
				trf.setLocalPosition(new vec3(v, 0, 0))
			}
			anim.start()



getAllAnimateProperty() : array
	Get a list of all instances created using 'AnimateProperty'. Useful, for example, when you want to stop all instances running in your lens.



-


degToRad(degrees [Number/vec3]) : Number/vec3
	Converts Number or vec3 of degrees to Number or vec3 of radians.



radToDeg(radians [Number/vec3]) : Number/vec3
	Converts Number or vec3 of radians to Number or vec3 of degrees.



-


isInFront(pos1 [vec3], pos2 [vec3], fwd [vec3]) : bool
	Checks if pos1 is in front of pos2, assuming pos2 has normalized forward vector fwd.



pointInBox(point [vec3], unitBoxTrf [Transform], getRelativePosition (optional) [Bool] ) : vec3
	Checks if a world position is within the boundaries of a unit box (by its Transform). The box can be moved, rotated, and scaled non-uniformly.
	Returns an object with two values:
		'isInside': boolean
		'relativePosition': (only if getRelativePosition is true) a vec3 with normalized positions relative to the box (-1 to 1, unclamped)



planeRay(point [vec3], dir [vec3], planePos [vec3], planeFwd [vec3]) : vec3
	Checks if a line starting at point with normalized direction dir, intersects a plane (of infinite size) at position planePos, with normalized normal planeFwd. Returns world position if it does, returns null otherwise.



projectPointToPlane(point [vec3], planePos [vec3], planeFwd [vec3], planeScale [vec3]) : vec2
	Projects a 3D point onto a plane with custom position, orientation, and non-uniform scale. Returns normalized 2D coordinates on plane at this position.



distanceAlongVector(pos1 [vec3], pos2 [vec3], fwd [vec3]) : vec3
	Returns the distance between two 3D points along a normalized vector.



-


hsvToRgb(h [Number], s [Number], v [Number]) : vec3
	Returns the RGB color for a Hue, Saturation, and Value. Inputs and outputs are in range 0-1.



rgbToHsv(rgb [vec3/vec4]) : vec3
	Returns the Hue, Saturation, and Value for the specified color (can be vec3 or vec4). Inputs and outputs are in range 0-1.



-


DoDelay(function (optional) [Function], arguments (optional) [Array] ) : DoDelay object
	An object that makes it easy to schedule a function to run in the future (by frames or by seconds).

		Example, showing all properties

			var delayed = new doDelay()
			delayed.func = function(){} 					// the function to call after a delay
			delayed.args = []								// function arguments should be given as an array
			delayed.byFrame(10)								// this will call the function in 10 frames (function is called on the next frame if no argument given, or instantly if arg is '0')
			delayed.byTime(10)								// this will call the function in 10 seconds (function is called instantly if no argument given or if arg is '0')
			delayed.now()									// call the function with the given arguments now
			delayed.stop()									// this will cancel the scheduled function

		In one-liner format

			new doDelay(func, args).byTime(5)				// calls function with arguments (array) after 5 seconds



stopAllDelays() : array of DoDelay instances
	Instantly stops all delays created using 'DoDelay'. This is useful if you want to create a quick reset function for your lens without managing all the created delays throughout your project.



-


instSound(audioAsset [Asset.AudioTrackAsset], volume (optional) [Number], fadeInTime (optional) [Number], fadeOutTime (optional) [Number], offset (optional) [Number], mixToSnap (optional) [bool]) : AudioComponent
	Plays a sound on a new (temporary) sound component, which allows multiple plays simultaneously without the audio clipping when it restarts.
	This function returns the AudioComponent! But be careful, the instance of this component will be removed when done playing



stopAllSoundInstances() : array of sound components
	Instantly stops all sound instances created using 'instSound'. This is useful if you want to create a quick reset function for your lens without managing all the created sounds throughout your project.



-


InstSoundPooled(listOfAssets [List of Asset.AudioTrackAsset], poolSize [Number], waitTime (optional) [Number]) : InstSoundPooled Object
	Create a pool of audio components, one component for each given asset, times the size of the pool (so the total size is listOfAssets.length * poolSize).
	This function does essentially the same as 'instSound', except in a much more performant way when playing lots of sounds (poolSize determines the amount of overlap allowed before looping back to the start of the pool).
	The 'waitTime', if given, makes sure the next sound instance can only be played after this many seconds, to prevent too many overlaps. This is useful when making a bouncing sound for physics objects.

	The 'instance' function has two optional arguments: the first is the index of the sound to be played (a random index is picked if it is null). The second is the volume (0-1 number).

		For example, if you want to randomly pick laser sounds coming from a gun.
		The following parameters give it a maximum of 10 plays, with 0.2 seconds inbetween, before looping back to the first sound component:

			var soundPool = new InstSoundPooled( [script.laserSound1, script.laserSound2, script.laserSound3], 10, 0.2 )
			function onFiringLaser(){
				soundPool.instance() 	// call 'onFiringLaser()' whenever you want to hear one of the laser sound samples!
			}



-


clamp(value [Number], low (optional, default 0) [Number] ), high (optional, default 1) [Number] ) : Number
	Returns the clamped value between the low and high values.



-


randSeed(seed [int]) : Number
	Returns a random value (0-1) based on an input seed. Uses mulberry32.



randInt(min [int], max [int]) : Number
OR
randInt(array [size 2]) : Number
	Returns a random rounded integer between min and max (inclusive).
	The two arguments can be replaced by a single array argument, for example [0, 10] for a random int between 0-10.



randFloat(min [Number], max [Number]) : Number
OR
randFloat(array [size 2]) : Number
	Returns a random number within a range min (inclusive) and max (exclusive).
	The two arguments can be replaced by a single array argument, for example [0, 1] for a random value between 0-1.



randArray(array [Array]) : Object
	Returns one random object from the given array



pickRandomDistributed(objects [Object]) : Object
	Picks one of the items in an object, and looks at the item's property called 'chance' to determine the odds of the one to pick.
	Provide it with an object looking like the example below.
	The 'chance' properties don't have to add up to 1! Their values are normalized before picking a random index.

		var list = {
			item1 : {name:'item1', chance:0.1}, // this item has a 10% chance of being chosen
			item2 : {name:'item2', chance:0.6}, // 60% chance
			item3 : {name:'item3', chance:0.3}, // 30% chance
		}
		var picked = pickRandomDistributed(list)
		picked.name == 'item1', 'item2' or 'item3', based on chance



-


remap(value [Number], low1 [Number], high1 [Number], low2 [Number], high2 [Number], clamped [Bool]) : Number
	Returns value remapped from range low1-high1 to range low2-high2.


-


encodeFloat(data [Number], min [Number], max [Number]) : vec4
	Equivalent of the 'Pack' node in the material graph editor (32-bits).



decodeToFloat(encoded data [vec4], min [Number], max [Number]) : Number
	Equivalent of the 'Unpack' node in the material graph editor (32-bits).



-


screenToScreenTransform(screenPos [vec2]) : vec2
	Returns ScreenTransform anchor center position (range -1 - 1) from screen coordinates (0-1, inversed y-axis).
	Inverse of scrTransformToScreen().



screenTransformToScreen(screenTransformCenter [vec2]) : vec2
	Returns screen coordinates (range 0-1) of Screen Transform anchors center.
	Inverse of screenToScrTransform().



-


shuffleArray(array [array]) : array
	Returns a randomly shuffled copy of the array.



concatArrays(array [any], array [any]) : array
	Concatinates two arrays and returns the new one.



-


MovingAverage() : MovingAverage Object
	An object that makes it easy to keep track of a 'rolling' average.

		Example, showing all properties

			var avg = new movingAverage()
			avg.add(v)									// usually the only thing you need, returns the new average and updates the sampleCount.
			avg.average									// gets/sets the current average value (usually read-only, but in some cases you might want to set this to a starting value)
			avg.sampleCount 							// gets/sets the current sample count value (usually read-only, but in some cases you might want to set this to a starting value)
			


-


PerformanceStopwatch() : PerformanceStopwatch Object
	Debugging tool. Prints precise time measures to see how well a function performs. Has built-in rolling average!

		Example, showing all properties
			var stopwatch = new PerformanceStopwatch()		// create new PerformanceStopwatch object
			stopwatch.start()								// starts the stopwatch
			// < do something to measure on this line >
			stopwatch.stop()								// stops the stopwatch, prints the result (and a rolling average of previous results) to the console


-



setAllChildrenToLayer(sceneObj [sceneObject], layer [LayerSet])
	Sets the sceneObject and all objects underneath it to a specific render layer (by LayerSet).



-


rotateCoords(point [vec2], pivot [vec2], angle [Number]) : vec2
	Rotate a 2D point around a pivot with specified angle (radians). Returns new 2D position.



-


circularDistance(a [Number], b [Number], mod [Number]) : Number
	Returns the closest distance from a to b if the number line is a circle with radius 'mod'. For example: if mod is 1, the distance between 0.9 and 0.1 would be 0.2.



-


mod(a [Number], b [Number]) : Number
	Modulo, like the % operator, but this respects negative numbers.
	For example, mod(-1, 3) returns 2. Whereas -1%3 would return -1.



-


measureWorldPos(screenPos [vec2], screenTrf [Component.ScreenTransform], cam [Component.Camera], dist [Number]) : vec3
	Returns the world position of a [-1 - 1] screen space coordinate, within a screen transform component, at a distance from the camera.
	Useful, for example, to measure out where to place a 3D model in the Safe Region, so it won't overlap with Snapchat's UI.



-


getAllComponents(componentName (optional) [string], startObj (optional) [SceneObject], dontIncludeStartObj (optional) [bool]) : Array (Components)
	Returns an array containing all components of type componentNames, also those on child objects.
	If no componentName is given, it returns SceneObjects.
	If no startObj is given, it searches the whole scene.
	If dontIncludeStartObj is true, the startObj will not be included in the final list.

		Example
			var components = getAllComponents("Component.VFXComponent")
				components == [Array of all VFX Component in the scene]



-


parseNewLines(txt [string], customSplit (optional) [string]) : String
	Takes a string passed in through an input string field containing '\n', and returns the same string but with real newlines (for use in a Text Component, for example).
	If customSplit is given, it replaces the '\n'-lookup with other character(s).



pad(num [Number], size [Number]) : String
	Takes a number and a padding amount, and returns a padded string of the number.

		Example
			var s = pad(30, 4)
				s == "0030"



-


median(arr [Array]) : Number
	Takes an array of Numbers, and returns the median value.



-


lookAtUp(posA [vec3], posB [vec3], offset) : quat
	Takes two positions, returns the look-at rotation for A to look at B with the Y axis locked.
	Useful when objects have to face the user, but they are not allowed to rotate facing up or down.
	Use the optional 'offset' for a 0 - 2PI rotation offset.



-


mat4FromDescription(matDescription [string]) : mat4
	Returns a mat4, based on a mat4's string description. Useful when trying to retrieve one stored as JSON format.



-


wrapFunction(originalFunction [Function], newFunction [Function]) : Function
	Wrap two functions into one. Works with arguments.



-


VisualizePositions() : VisualizePositions object
	A class that places cubes on each position in the 'positions' array, given through the update function. Useful for quick visualizations of 3D positions.

		Example, showing all properties

			var v = new VisualizePositions()							// create VisualizePositions instance
			v.scale														// (optional) the scale of the cubes (world size, default is 1)
			v.rotation													// (optional) the rotation of the cubes (if continuousRotationis set to false)
			v.continuousRotation										// (optional) make the cubes rotate around local up, clockwise (boolean, default is true)
			v.material													// (optional) the material of the cubes (Asset.Material)
			v.showPositions( [vec3 Array] )								// show cubes on the given positions (array), returns the array of created SceneObjects for further customization
			v.getPositions()											// returns currently visualized positions
			v.remove()													// clear all created visualizations

		Example, shorter format

			var positions = [new vec3(0, 0, 0), new vec3(1, 0, 0)] 		// some world positions to visualize
			new VisualizePositions().showPositions(positions)



-------------------
@ui {"widget":"label", "label":"LSQuickScripts v2.8"}
@ui {"widget":"label", "label":"By Max van Leeuwen"}
@ui {"widget":"label", "label":"-"}
@ui {"widget":"label", "label":"Place on top of scene ('On Awake')"}
@ui {"widget":"label", "label":"For more info, open this script! Or go to:"}
@ui {"widget":"label", "label":"maxvanleeuwen.com/LSQuickScripts"}



Max van Leeuwen
twitter      @maksvanleeuwen
instagram    @max.van.leeuwen
maxvanleeuwen.com



LSQuickScripts - A cheat sheet of Lens Studio Javascript snippets that I often use.






CREDITS
-------------------
Snap Inc.

chatGPT :)

Tween.js - Licensed under the MIT license
https://github.com/tweenjs/tween.js
See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
-------------------






HOW TO USE
-------------------


lsqs : Script Component
 Returns the Script component this script is on.



-


EaseFunctions : Object, containing Functions
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



interp(startValue [Number], endValue [Number], t [Number], easing (optional) [Function], unclamped (optional) [bool]) : Number
	Returns the value of t interpolated using an Easing Function, remapped to start and end values.
	Is identical to a linear lerp() when no Easing Function is given.
	Use one of the Easing Functions in global.EaseFunctions, or use your own!

		Examples, [-5, 5] at position x
			Cubic in/out	interp(-5, 5, x, EaseFunctions.Cubic.InOut)
			Linear (lerp)	interp(-5, 5, x)
			Custom			interp(-5, 5, x, function(v){ return v })



AnimateProperty() : AnimateProperty object
	Creates an easy-to-use animation instance. Can be used to quickly animate any property, using just a couple lines of code!

		Example, showing all possible properties

			var anim = new AnimateProperty( updateFunction (optional) )		// create a new animation instance called 'anim'.
			anim.startFunction = function(){}								// function to call on animation start.
			anim.updateFunction = function(v, vLinear){}					// function to call on each animation frame, with animation value (0-1, inclusive) as its first argument. The second argument is the linear animation value. These ranges are exclusive for the first step, and inclusive for the last step of the animation (so when playing in reverse, the range becomes (1, 0]).
			anim.endFunction = function(){}									// function to call on animation end.
			anim.duration = 1												// duration in seconds. Default is 1.
			anim.reverseDuration = 1										// duration in seconds when reversed. If no value assigned, default is equal to duration.
			anim.delay = 0													// delay after starting animation. Default is 0.
			anim.reverseDelay = 0											// delay after starting animation in reverse. Uses anim.delay if none is given.
			anim.easeFunction = EaseFunctions.Cubic.In						// determines curve. Default is Cubic.InOut. All EaseFunctions can be used, or use a custom function.
			anim.reverseEaseFunction = EaseFunctions.Cubic.Out				// determines curve on reverse playing. Uses anim.easeFunction if none is given.
			anim.pulse(newTimeRatio)										// updates the animation once, stops the currently running animation. Sets the time value to newTimeRatio (linear 0-1).
			anim.getTimeRatio()												// the current linear, normalized animation time (0 on animation start, 1 on animation end, regardless of whether animation is reversed).
			anim.setReversed(reverse)										// if reversed, the animation plays backwards. 'Reverse' arg should be of type Bool.
			anim.getReversed()												// returns true if the animation is currently reversed.
			anim.isPlaying()												// returns true if the animation is currently playing.
			anim.setCallbackAtTime(v, function)								// registers a callback function on the first frame that v >= t (or v <= t if playing reversed). Call without arguments to clear.
			anim.start(newTimeRatio, skipDelay)								// starts the animation (resumes where last play ended, starts from beginning if last play was finished). Optional 'atTime' argument starts at normalized linear 0-1 time ratio. Optional skipDelay bool skips the delay on this animation once.
			anim.stop(callEndFunction)										// stop the animation at its current time. With an optional argument to call the endFunction (argument should be a bool, default is false).

		Example, smoothly animating transform 'trf' one unit to the right (default duration is 1 second)

			var anim = new AnimateProperty()
			anim.updateFunction = function(v){
				trf.setLocalPosition(new vec3(v, 0, 0))
			}
			anim.start()



getAllAnimateProperty() : array
	Get a list of all instances created using 'AnimateProperty'. Useful, for example, when you want to stop all instances running in your lens.



-


degToRad(degrees [Number/vec3]) : Number/vec3
	Converts Number or vec3 of degrees to Number or vec3 of radians.



radToDeg(radians [Number/vec3]) : Number/vec3
	Converts Number or vec3 of radians to Number or vec3 of degrees.



-


isInFront(pos1 [vec3], pos2 [vec3], fwd [vec3]) : bool
	Checks if pos1 is in front of pos2, assuming pos2 has normalized forward vector fwd.



pointInBox(point [vec3], unitBoxTrf [Transform], getRelativePosition [Bool, optional]) : vec3
	Checks if a world position is within the boundaries of a unit box (by its Transform). The box can be moved, rotated, and scaled non-uniformly.
	Returns an object with two values:
		'isInside': boolean
		'relativePosition': (only if getRelativePosition is true) a vec3 with normalized positions relative to the box (-1 to 1, unclamped)



planeRay(point [vec3], dir [vec3], planePos [vec3], planeFwd [vec3]) : vec3
	Checks if a line starting at point with normalized direction dir, intersects a plane (of infinite size) at position planePos, with normalized normal planeFwd. Returns world position if it does, returns null otherwise.



projectPointToPlane(point [vec3], planePos [vec3], planeFwd [vec3], planeScale [vec3]) : vec2
	Projects a 3D point onto a plane with custom position, orientation, and non-uniform scale. Returns normalized 2D coordinates on plane at this position.



distanceAlongVector(pos1 [vec3], pos2 [vec3], fwd [vec3]) : vec3
	Returns the distance between two 3D points along a normalized vector.



-


hsvToRgb(h [Number], s [Number], v [Number]) : vec3
	Returns the RGB color for a Hue, Saturation, and Value. Inputs and outputs are in range 0-1.



rgbToHsv(rgb [vec3/vec4]) : vec3
	Returns the Hue, Saturation, and Value for the specified color (can be vec3 or vec4). Inputs and outputs are in range 0-1.



-


DoDelay(function (Function, optional), arguments (Array, optional) ) : DoDelay object
	An object that makes it easy to schedule a function to run in the future (by frames or by seconds).

		Example, showing all properties

			var delayed = new doDelay()
			delayed.func = function(){} 					// the function to call after a delay
			delayed.args = []								// function arguments should be given as an array
			delayed.byFrame(10)								// this will call the function in 10 frames (function is called on the next frame if no argument given, or instantly if arg is '0')
			delayed.byTime(10)								// this will call the function in 10 seconds (function is called instantly if no argument given or if arg is '0')
			delayed.now()									// call the function with the given arguments now
			delayed.stop()									// this will cancel the scheduled function

		In one-liner format

			new doDelay(func, args).byTime(5)				// calls function with arguments (array) after 5 seconds



stopAllDelays() : array of DoDelay instances
	Instantly stops all delays created using 'DoDelay'. This is useful if you want to create a quick reset function for your lens without managing all the created delays throughout your project.



-


instSound(audioAsset [Asset.AudioTrackAsset], volume (optional) [Number], fadeInTime (optional) [Number], fadeOutTime (optional) [Number], offset (optional) [Number], mixToSnap (optional) [bool]) : AudioComponent
	Plays a sound on a new (temporary) sound component, which allows multiple plays simultaneously without the audio clipping when it restarts.
	This function returns the AudioComponent! But be careful, the instance of this component will be removed when done playing



stopAllSoundInstances() : array of sound components
	Instantly stops all sound instances created using 'instSound'. This is useful if you want to create a quick reset function for your lens without managing all the created sounds throughout your project.



-


InstSoundPooled(listOfAssets [List of Asset.AudioTrackAsset], poolSize [Number], waitTime (optional) [Number]) : InstSoundPooled Object
	Create a pool of audio components, one component for each given asset, times the size of the pool (so the total size is listOfAssets.length * poolSize).
	This function does essentially the same as 'instSound', except in a much more performant way when playing lots of sounds (poolSize determines the amount of overlap allowed before looping back to the start of the pool).
	The 'waitTime', if given, makes sure the next sound instance can only be played after this many seconds, to prevent too many overlaps. This is useful when making a bouncing sound for physics objects.

	The 'instance' function has two (optional) arguments: the first is the index of the sound to be played (a random index is picked if it is null). The second is the volume (0-1 number).

		For example, if you want to randomly pick laser sounds coming from a gun.
		The following parameters give it a maximum of 10 plays, with 0.2 seconds inbetween, before looping back to the first sound component:

			var soundPool = new InstSoundPooled( [script.laserSound1, script.laserSound2, script.laserSound3], 10, 0.2 )
			function onFiringLaser(){
				soundPool.instance() 	// call 'onFiringLaser()' whenever you want to hear one of the laser sound samples!
			}



-


clamp(value [Number], low [Number] (optional, default 0), high [Number] (optional, default 1)) : Number
	Returns the clamped value between the low and high values.



-


randSeed(seed [int]) : Number
	Returns a random value (0-1) based on an input seed. Uses mulberry32.



randInt(min [int], max [int]) : Number
OR
randInt(array [size 2]) : Number
	Returns a random rounded integer between min and max (inclusive).
	The two arguments can be replaced by a single array argument, for example [0, 10] for a random int between 0-10.



randFloat(min [Number], max [Number]) : Number
OR
randFloat(array [size 2]) : Number
	Returns a random number within a range min (inclusive) and max (exclusive).
	The two arguments can be replaced by a single array argument, for example [0, 1] for a random value between 0-1.



randArray(array [Array]) : Object
	Returns one random object from the given array



pickRandomDistributed(objects [Object]) : Object
	Picks one of the items in an object, and looks at the item's property called 'chance' to determine the odds of the one to pick.
	Provide it with an object looking like the example below.
	The 'chance' properties don't have to add up to 1! Their values are normalized before picking a random index.

		var list = {
			item1 : {name:'item1', chance:0.1}, // this item has a 10% chance of being chosen
			item2 : {name:'item2', chance:0.6}, // 60% chance
			item3 : {name:'item3', chance:0.3}, // 30% chance
		}
		var picked = pickRandomDistributed(list)
		picked.name == 'item1', 'item2' or 'item3', based on chance



-


remap(value [Number], low1 [Number], high1 [Number], low2 [Number], high2 [Number], clamped [Bool]) : Number
	Returns value remapped from range low1-high1 to range low2-high2.


-


encodeFloat(data [Number], min [Number], max [Number]) : vec4
	Equivalent of the 'Pack' node in the material graph editor (32-bits).



decodeToFloat(encoded data [vec4], min [Number], max [Number]) : Number
	Equivalent of the 'Unpack' node in the material graph editor (32-bits).



-


screenToScreenTransform(screenPos [vec2]) : vec2
	Returns ScreenTransform anchor center position (range -1 - 1) from screen coordinates (0-1, inversed y-axis).
	Inverse of scrTransformToScreen().



screenTransformToScreen(screenTransformCenter [vec2]) : vec2
	Returns screen coordinates (range 0-1) of Screen Transform anchors center.
	Inverse of screenToScrTransform().



-


shuffleArray(array [array]) : array
	Returns a randomly shuffled copy of the array.



concatArrays(array [any], array [any]) : array
	Concatinates two arrays and returns the new one.



-


MovingAverage() : MovingAverage Object
	An object that makes it easy to keep track of a 'rolling' average.

		Example, showing all properties

			var avg = new movingAverage()
			avg.add(v)									// usually the only thing you need, returns the new average and updates the sampleCount.
			avg.average									// gets/sets the current average value (usually read-only, but in some cases you might want to set this to a starting value)
			avg.sampleCount 							// gets/sets the current sample count value (usually read-only, but in some cases you might want to set this to a starting value)
			


-


PerformanceStopwatch() : PerformanceStopwatch Object
	Debugging tool. Prints precise time measures to see how well a function performs. Has built-in rolling average!

		Example, showing all properties
			var stopwatch = new PerformanceStopwatch()		// create new PerformanceStopwatch object
			stopwatch.start()								// starts the stopwatch
			// < do something to measure on this line >
			stopwatch.stop()								// stops the stopwatch, prints the result (and a rolling average of previous results) to the console


-



setAllChildrenToLayer(sceneObj [sceneObject], layer [LayerSet])
	Sets the sceneObject and all objects underneath it to a specific render layer (by LayerSet).



-


rotateCoords(point [vec2], pivot [vec2], angle [Number]) : vec2
	Rotate a 2D point around a pivot with specified angle (radians). Returns new 2D position.



-


circularDistance(a [Number], b [Number], mod [Number]) : Number
	Returns the closest distance from a to b if the number line is a circle with radius 'mod'. For example: if mod is 1, the distance between 0.9 and 0.1 would be 0.2.



-


mod(a [Number], b [Number]) : Number
	Modulo, like the % operator, but this respects negative numbers.
	For example, mod(-1, 3) returns 2. Whereas -1%3 would return -1.



-


measureWorldPos(screenPos [vec2], screenTrf [Component.ScreenTransform], cam [Component.Camera], dist [Number]) : vec3
	Returns the world position of a [-1 - 1] screen space coordinate, within a screen transform component, at a distance from the camera.
	Useful, for example, to measure out where to place a 3D model in the Safe Region, so it won't overlap with Snapchat's UI.



-


getAllComponents(componentName (optional) [string], startObj (optional) [SceneObject], dontIncludeStartObj (optional) [bool]) : Array (Components)
	Returns an array containing all components of type componentNames, also those on child objects.
	If no componentName is given, it returns SceneObjects.
	If no startObj is given, it searches the whole scene.
	If dontIncludeStartObj is true, the startObj will not be included in the final list.

		Example
			var components = getAllComponents("Component.VFXComponent")
				components == [Array of all VFX Component in the scene]



-


parseNewLines(txt [string], customSplit (optional) [string]) : String
	Takes a string passed in through an input string field containing '\n', and returns the same string but with real newlines (for use in a Text Component, for example).
	If customSplit is given, it replaces the '\n'-lookup with other character(s).



pad(num [Number], size [Number]) : String
	Takes a number and a padding amount, and returns a padded string of the number.

		Example
			var s = pad(30, 4)
				s == "0030"



-


median(arr [Array]) : Number
	Takes an array of Numbers, and returns the median value.



-


lookAtUp(posA [vec3], posB [vec3], offset) : quat
	Takes two positions, returns the look-at rotation for A to look at B with the Y axis locked.
	Useful when objects have to face the user, but they are not allowed to rotate facing up or down.
	Use the optional 'offset' for a 0 - 2PI rotation offset.



-


mat4FromDescription(matDescription [string]) : mat4
	Returns a mat4, based on a mat4's string description. Useful when trying to retrieve one stored as JSON format.



-


wrapFunction(originalFunction [Function], newFunction [Function]) : Function
	Wrap two functions into one. Works with arguments.



-


VisualizePositions() : VisualizePositions object
	A class that places cubes on each position in the 'positions' array, given through the update function. Useful for quick visualizations of 3D positions.

		Example, showing all properties

			var v = new VisualizePositions()							// create VisualizePositions instance
			v.scale														// (optional) the scale of the cubes (world size, default is 1)
			v.rotation													// (optional) the rotation of the cubes (if continuousRotationis set to false)
			v.continuousRotation										// (optional) make the cubes rotate around local up, clockwise (boolean, default is true)
			v.material													// (optional) the material of the cubes (Asset.Material)
			v.showPositions( [vec3 Array] )								// show cubes on the given positions (array), returns the array of created SceneObjects for further customization
			v.getPositions()											// returns currently visualized positions
			v.remove()													// clear all created visualizations

		Example, shorter format

			var positions = [new vec3(0, 0, 0), new vec3(1, 0, 0)] 		// some world positions to visualize
			new VisualizePositions().showPositions(positions)



-------------------
</code></pre>
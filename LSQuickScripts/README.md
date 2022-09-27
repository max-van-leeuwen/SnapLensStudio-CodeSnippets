<p class="has-line-data" data-line-start="1" data-line-end="2">Cheat sheet for my most-used JS snippets in Lens Studio. Will update this every once in a while. Example project included!</p>
<p class="has-line-data" data-line-start="1" data-line-end="2">Installation: Throw the LSQuickScripts.js on a SceneObject and you can call all functions from any script in the project.</p>
<br>
<p class="has-line-data" data-line-start="11" data-line-end="12">Some examples: <a href="https://gfycat.com/dishonestflimsyafricanmolesnake">https://gfycat.com/dishonestflimsyafricanmolesnake</a></p>
<br>
<p class="has-line-data" data-line-start="2" data-line-end="5"><a href="https://twitter.com/maksvanleeuwen">Twitter (@maksvanleeuwen)</a>
<br><br>

<pre><code>
ALL FUNCTIONS:
-------------------


global.lsqs : Script Component
 Returns the Script component this script is on.



-


global.LS_BOX_SCALE : Number
 Default box mesh scale in Lens Studio.



-


global.interp(startValue [Number], endValue [Number], t [Number], easing (optional) [string], type (optional) [string], unclamped (optional) [bool]) : Number
	Returns the value of t interpolated using Tween functions between the start and end values. Set the easing function and type (optional) by string, use the below list as reference.
	Using only startValue, endValue, and t, is identical to a linear (unclamped) lerp.

		Easing:
			Linear (default)
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

		Type:
			InOut (default)
			In
			Out

		Examples:
			global.interp(0, 1, 0.1, "Elastic", "In");
			global.interp(-5, 5, x, "Cubic");



-


global.AnimateProperty() : animateProperty object
	Creates an easy-to-use animation 'class' instance. Can be used to easily animate any property in just a couple lines of code!

		All properties:
			var anim = new global.animateProperty();						// create a new animation instance called 'anim'.
			anim.startFunction = function(){};								// Function to call on animation start.
			anim.updateFunction = function(v){ /* your callback here */ };	// Function to call on each animation frame, with animation value (0-1) as its first argument. This range is exclusive for the first step and inclusive for the last step of the animation (for example: when playing in reverse, the range is <1, 0]).
			anim.endFunction = function(){ /* your callback here */ };		// Function to call on animation end.
			anim.duration = 1;												// Duration in seconds. Default is 1.
			anim.reverseDuration = 1;										// Duration in seconds when reversed. If no value assigned, default is equal to duration.
			anim.delay = 0;													// Delay after starting animation. Default is 0.
			anim.easeFunction = "Cubic";									// Determines curve. Default is "Cubic", all Tween functions can be used!
			anim.easeType = "InOut";										// Determines how animation curve is applied. Default is "InOut". All possible inputs: "In", "Out", "InOut".
			anim.pulse(newTimeRatio);										// Updates the animation once, stops the currently running animation. Sets the time value to newTimeRatio (linear 0-1).
			anim.getTimeRatio();											// The current linear normalized animation time, 0-1.
			anim.setReversed(reverse);										// If reversed, the animation plays backwards. The easeType will be swapped if it isn't 'InOut'. 'reverse' should be of type bool.
			anim.getReversed();												// Returns true if the animation is currently reversed.
			anim.isPlaying();												// Returns true if the animation is currently playing.
			anim.start(newTimeRatio); 										// Starts the animation (resumes where last play ended, starts from beginning if last play was finished). Optional 'atTime' argument starts at normalized linear 0-1 time ratio.
			anim.stop(callEndFunction);										// Stop the animation at its current time. With an optional argument to call the endFunction (argument should be of type bool).



-


global.degToRad(degrees [Number/vec3]) : Number/vec3
	Converts Number or vec3 of degrees to Number or vec3 of radians.



global.radToDeg(radians [Number/vec3]) : Number/vec3
	Converts Number or vec3 of radians to Number or vec3 of degrees.



-


global.isInFront(objFront [SceneObject], objBehind [SceneObject] ) : bool
	Checks if objFront is in front of objBehind.



global.isInBox(object [SceneObject], box [SceneObject]) : bool
	Checks if object is within the boundaries of a default Lens Studio box.



-


global.HSVtoRGB(h [Number], s [Number], v [Number]) : vec3
	Returns the RGB color for a Hue, Saturation, and Value. All inputs and outputs are in range 0-1.



global.RGBtoHSV(rgb [vec3/vec4]) : vec3
	Returns the Hue, Saturation, and Value values for the specified color. Inputs and outputs are in range 0-1.



-


global.DoDelay( function (Function, optional), arguments (Array, optional) ) : doDelay object
	An object that makes it easy to schedule a function to run in the future (by frames or by seconds).

		Example, showing all properties:
			var delayed = new global.doDelay();
			delayed.func = function(arg){print(arg)}; 		// test function, this will print its first argument
			delayed.args = ['hello!'];						// arguments should be given as an array
			delayed.byFrame(10);							// this will print 'hello!' in 10 frames (function is called on the next frame, if no argument given)
			delayed.byTime(10);								// this will print 'hello!' in 10 seconds
			delayed.stop();									// this will stop the scheduled function

		One-liner for convenience:
			new global.doDelay(func, args).byTime(5);		// calls function func with arguments args (array) after 5 seconds



-


global.instSound(audioAsset [Asset.AudioTrackAsset], volume (optional) [Number], fadeInTime (optional) [Number], fadeOutTime (optional) [Number], offset (optional) [Number], mixToSnap (optional) [bool]) : AudioComponent
	Plays a sound on a new (temporary) sound component, which allows multiple plays simultaneously without the audio clipping when it restarts.
	This function returns the AudioComponent! But be careful, the instance of this component will be removed when done playing



-


global.clamp(value [Number], low [Number] (optional, default 0), high [Number] (optional, default 1)) : Number
	Returns the clamped value between the low and high values.



-


global.randSeed(seed [int]) : Number
	Returns a random value (0-1) based on an input seed. Uses mulberry32.



-


global.remap(value [Number], low1 [Number], high1 [Number], low2 [Number], high2 [Number], clamp [Bool]) : Number
	Returns value remapped from range low1-high1 to range low2-high2.


-


global.encodeFloat(data [Number], min [Number], max [Number]) : vec4
	Equivalent of the 'Pack' node in the material graph editor (32-bits).



global.decodeToFloat(encoded data [vec4], min [Number], max [Number]) : Number
	Equivalent of the 'Unpack' node in the material graph editor (32-bits).



-


global.screenToScrTransform(screenPos [vec2]) : vec2
	Returns ScreenTransform anchor center position (range -1 - 1) from screen coordinates (0-1, inversed y-axis).
	Inverse of global.scrTransformToScreen().



global.scrTransformToScreen(scrTransfCenter [vec2]) : vec2
	Returns screen coordinates (range 0-1) of Screen Transform anchors center.
	Inverse of global.screenToScrTransform().



-


global.worldMeshClassify() : string
	Returns the name of the world mesh classification index.

		Examples:
			global.worldMeshClassify(2) : "Floor"



-


global.shuffleArray(array [array]) : array
	Returns a randomly shuffled copy of the array.



-


global.MovingAverage() : movingAverage Object
	An object that makes it easy to keep track of a moving/rolling average.

		Example, showing all properties:
			var avg = new global.movingAverage();
			avg.add(v);									// usually the only thing you need, returns the new average and updates the sampleCount.
			avg.average;								// gets/sets the current average value (usually read-only, but in some cases you might want to set this to a starting value)
			avg.sampleCount; 							// gets/sets the current sample count value (usually read-only, but in some cases you might want to set this to a starting value)
			


-


global.Stopwatch() : stopwatch Object
	Does precise time measuring to see how well a function performs.
	Starting and stopping the stopwatch more than once will make it keep track of a moving average! Which is more reliable than measuring just once, as frames in Lens Studio are also dependent on other factors.

		Example, showing all properties:
			var stopwatch = new global.Stopwatch();		// create new stopwatch object
			stopwatch.start();							// starts the stopwatch
			// < do something else on this line >
			stopwatch.stop();							// stops the stopwatch, prints the results to the console


-



global.setAllChildrenToLayer(sceneObj [sceneObject], layer [LayerSet])
	Sets the sceneObject and all of its child objects and sub-child objects to a specific render layer (by LayerSet).



-


global.rotateCoords(point [vec2], pivot [vec2], angle [Number]) : vec2
	Rotate a 2D point around a pivot with specified angle (radians). Returns new 2D position.



-


global.circularDistance(a [Number], b [Number], mod [Number]) : Number
	Returns the closest distance from a to b if the number line of length mod is a circle. For example: if the mod is 1, the distance between 0.9 and 0.1 is 0.2.



-


global.measureWorldPos(screenPos [vec2], region [Component.ScreenTransform], cam [Component.Camera], dist [Number]) : vec3
	Returns the world position of a [-1 - 1] screen space coordinate, within a screen transform component, at a distance from the camera.
	Useful, for example, to measure out where to place a 3D model in the Safe Region, so it won't overlap with Snapchat's UI.



-


global.getAllComponents(componentName [string], startObj (optional) [SceneObject]) : Array (Components)
	Returns an array containing all components of type componentNames, also those on child objects.
	If no startObj is given, it searches the whole scene.

		Example:
			var component = global.getAllComponents("Component.VFXComponent")
				components = [ARRAY OF ALL VFX COMPONENTS IN SCENE],



-


global.parseNewLines(txt [string], customSplit (optional) [string]) : String
	Takes a string passed in through an input string field containing '\n', and returns the same string but with real newlines (for use in a Text Component, for example).
	If customSplit is given, it replaces the '\n'-lookup with other character(s).



-


global.median(arr [Array]) : Number
	Takes an array of Numbers, and returns the median value.



-


global.lookAtUp(posA [vec3], posB [vec3], offset) : quat
	Takes two positions, returns the look-at rotation for A to look at B with Y axis locked. Useful when objects have to face the user, but they are not allowed to rotate facing up or down.
	Use the optional 'offset' for a 0 - 2PI rotation offset.



-


global.isInSpectaclesDisplay(pos [vec3], cam [Component.Camera]) : bool
	Returns true if the world position is visible in the square Spectacles (2021) display. Handy for optimization sometimes.



-


global.VisualizePositions(scale (optional) [Number]) : VisualizePositions object
	A class that places cubes on each position in the 'positions' array, for quick visualizations.

		Example, showing all properties:
			var vis = new VisualizePositions();
			vis.scale;								// (Optional) Set the scale of the cubes (world size, default is 1)
			vis.continuousRotation;					// (Optional) Make the cubes do a rotate animation (boolean, default is true)
			vis.material;							// (Optional) set material property of the cubes (<Asset.Material>)
			vis.update(<Vec3 Array>);				// places cubes on new array of positions, returns the array of cube SceneObjects if needed!
			vis.remove();							// clears all created visualization

		One-liner for convenience:
			var positions = [new vec3(0, 0, 0), new vec3(1, 0, 0)]; 	// make a list of positions
			new VisualizePositions(10).update(positions); 				// instantly creates boxes of size 10 at those positions



-------------------
</code></pre>

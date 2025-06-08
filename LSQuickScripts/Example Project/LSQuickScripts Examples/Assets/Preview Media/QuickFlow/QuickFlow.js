// Max van Leeuwen
//  maxvanleeuwen.com

// QuickFlow demo: create a complex animation with 1 line of code
// Requires LSQuickScripts



//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"Open this script for more info!"}
//@ui {"widget":"label"}



//@input SceneObject box
script.box.enabled = false; // start hidden



// one-liner looping animation with QuickFlow!
new QuickFlow(script.box).scaleIn(.5, undefined, EaseFunctions.Back.Out).rotateAround(.7, 1, vec3.right(), 1.7).scaleOut(1.4).loop(1.8);

// QuickFlow explained:
//	new QuickFlow(script.box)				    <- creating the animation
//	.scaleIn(.5, undefined, easing)				<- enables and scales in the object, after 0.5 seconds, with unchanged duration and custom easing function
//	.rotateAround(.7, 1, vec3.right(), 1.7)		<- rotates the cube with a 0.7s delay, 1 full rotation, around the axis (1, 0, 0), for a duration of 1.7s
//	.scaleOut(1.4)							    <- scales out the cube after 1.4s
//	.loop(1.8)								    <- loops back to start after scaleOut is finished (after 1.8s)

// See LSQuickScripts for more information on QuickFlow.
// Max van Leeuwen
// ig @max.van.leeuwen
// twitter @maksvanleeuwen
//
// Starts animation on tap
// It uses all default settings,
// e.g. duration = 1s, animation curve = Cubic|InOut



// create new animation instance
var anim = new global.AnimateProperty();

// the function to call on each animation frame, this moves the block
anim.updateFunction = function(v){
	// updateFunction is always called with one argument, a 0-1 ratio of how far the animation has progressed. this is used to move the object like so:
	script.getTransform().setWorldPosition(new vec3(v*100, 0, 0)); // move this object somewhere
};

// reverse the animation direction when animation is stopped, this makes the block ping-pong on each tap
anim.endFunction = function(){
	anim.setReversed(!anim.getReversed())
};






// interaction
function onTap(){ // when the user taps on the screen
	anim.stop(); // stop currently running animation (if any), will call the endFunction() callback
	anim.start(); // start
}
var onTapEvent = script.createEvent("TapEvent");
onTapEvent.bind(onTap);
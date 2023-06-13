// Max van Leeuwen
// ig @max.van.leeuwen
// twitter @maksvanleeuwen
//
// Starts animation on tap



// create new animation
var anim = new global.AnimateProperty();
anim.duration = 0.5;
anim.updateFunction = function(v){ // the function to call on each frame

	// move the block by some amount
	script.getTransform().setWorldPosition(new vec3(v*100, 0, 0) );
	
};

// optional parameters:
anim.setReversed(true); // start in reverse direction
anim.easeFunction = global.EaseFunctions.Cubic.Out; // easing curve
anim.reverseEaseFunction = global.EaseFunctions.Cubic.In; // easing curve when animation is reversed



// when the user taps on the screen, start the animation!
script.createEvent("TapEvent").bind(function(){
	anim.setReversed(); // toggle reverse playing on each tap, so it goes back and forth
	anim.start();
});
// Max van Leeuwen
// twitter      @maksvanleeuwen
// instagram    @max.van.leeuwen
// maxvanleeuwen.com
//
// Starts animation on tap



// create new animation
var anim = new AnimateProperty();
anim.duration = 0.5;
anim.updateFunction = function(v){ // the function to call on each frame
	script.getTransform().setWorldPosition(new vec3( v*100, 0, 0)); // move the block by some amount (100)
};

// some optional parameters:
anim.setReversed(true); // start in reverse direction
anim.easeFunction = EaseFunctions.Cubic.Out; // easing curve
anim.reverseEaseFunction = EaseFunctions.Cubic.In; // easing curve when animation is reversed



// when the user taps on the screen, start the animation!
script.createEvent("TapEvent").bind(function(){
	anim.setReversed(); // toggle reverse playing on each tap, so it goes back and forth
	anim.start();
});
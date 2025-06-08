// Max van Leeuwen
//  maxvanleeuwen.com

// Starts animation on tap
// Requires LSQuickScripts



//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"Tap to animate the box!"}
//@ui {"widget":"label"}



// creating an animation
var anim = new AnimateProperty();
anim.duration = 0.5;
anim.updateFunction = function(v){ // the function to call on each frame
	script.getTransform().setWorldPosition(new vec3(v*100, 0, 0)); // move the block by some amount
};



// some optional parameters
anim.setReversed(true); // start in reverse direction
anim.easeFunction = EaseFunctions.Cubic.Out; // easing curve
anim.reverseEaseFunction = EaseFunctions.Cubic.In; // easing curve when animation is reversed



// begin animating on each tap
script.createEvent("TapEvent").bind(function(){
	anim.setReversed(); // toggle reverse playing on each tap, so it goes back and forth
	anim.start();
});
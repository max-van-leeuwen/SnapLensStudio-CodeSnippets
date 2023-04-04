// Max van Leeuwen
// ig @max.van.leeuwen
// twitter @maksvanleeuwen
//
// Starts animation on tap



// create new animation instance
var anim = new global.AnimateProperty();
anim.duration = 0.5;

// the function to call on each animation frame (this is what moves the block!)
anim.updateFunction = function(v){
	script.getTransform().setWorldPosition(new vec3(v*100, 0, 0) );
};



// when the user taps on the screen, start the animation
script.createEvent("TapEvent").bind(function(){
	anim.setReversed(); // toggle reverse playing on each tap
	anim.start();
});
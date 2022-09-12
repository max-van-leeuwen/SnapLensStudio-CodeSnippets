// Max van Leeuwen
// ig @max.van.leeuwen
// twitter @maksvanleeuwen
//
// Starts animation on tap



// create new animation instance
var anim = new global.AnimateProperty();

anim.duration = 0.5;

anim.updateFunction = function(v){ // the function to call on each animation frame, this moves the block
	script.getTransform().setWorldPosition(new vec3(v*100, 0, 0) ); // move this object somewhere
};

script.createEvent("TapEvent").bind(function(){  // when the user taps on the screen, start the animation
	anim.setReversed(); // toggle reverse playing on each tap
	anim.start();
});
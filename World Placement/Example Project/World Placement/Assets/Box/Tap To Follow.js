// Max van Leeuwen
//  @maksvanleeuwen
//  links.maxvanleeuwen.com

// Animates the scene towards the user



// make instance with customizations
//@input SceneObject obj
var placement = new WorldPlacement(script.obj);



// set custom distance from camera
//@input float customDistanceFromCamera
placement.distanceFromCamera = script.customDistanceFromCamera;



// instantly place in front of user on lens start
placement.start(doInstant=true);

// when user taps on screen, start animation
script.createEvent("TapEvent").bind(function(){
	placement.start();
});
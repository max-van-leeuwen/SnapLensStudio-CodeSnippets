// Max van Leeuwen
//  @maksvanleeuwen
//  links.maxvanleeuwen.com

// Animates the scene towards the user



// make instance with customizations
//@input SceneObject obj
var worldPlacementAnim = new WorldPlacement(script.obj);

// set custom distance from camera
//@input float customDistanceFromCamera
worldPlacementAnim.distanceFromCamera = script.customDistanceFromCamera;



// when user taps on screen, call WorldPlacement
script.createEvent("TapEvent").bind(function(){
	worldPlacementAnim.start();
})

worldPlacementAnim.start(true); // do on script start with isInstant=true, to instantly see the block in front of you
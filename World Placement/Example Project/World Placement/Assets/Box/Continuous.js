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



// start continuously following user
placement.startContinuous();
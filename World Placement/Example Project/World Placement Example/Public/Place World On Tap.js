// Max van Leeuwen
//  @maksvanleeuwen
//  links.maxvanleeuwen.com

// Animates the scene towards the user



// make instance with customizations
//@input SceneObject obj
var worldPlacementAnim = new WorldPlacement(script.obj);
worldPlacementAnim.duration = .3;
worldPlacementAnim.spherical = false;
worldPlacementAnim.distanceFromCamera = 80;



// when user taps on screen, call WorldPlacement
script.createEvent("TapEvent").bind(function(){
	worldPlacementAnim.start();
})
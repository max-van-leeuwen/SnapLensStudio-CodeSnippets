// Max van Leeuwen
//
// Animates the scene towards the user.



// make new animation instance with customizations
var worldPlacementAnim = new WorldPlacement();
worldPlacementAnim.distanceFromCamera = 150; // make scene end up 150cm away from user


function animateTowardsUser(){
	worldPlacementAnim.start(); // do animation
}
// when user taps on screen, call function
var onScreenTapEvent = script.createEvent("TapEvent");
onScreenTapEvent.bind(animateTowardsUser);
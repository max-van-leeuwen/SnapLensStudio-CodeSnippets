// Max van Leeuwen
// ig @max.van.leeuwen
// twitter @maksvanleeuwen
//
// Checks if point is in box (use the 'Unit Box' from the asset store for this! Not Lens Studio's default box.)



//@input SceneObject point
//@input SceneObject box

//@input vec3 inColor {"widget":"color"}
//@input vec3 outColor {"widget":"color"}
//@input Asset.Material mat



function onUpdate(){
	var pointPos = script.point.getTransform().getWorldPosition();
	var isInBox = global.isInBox(pointPos, script.box.getTransform())

	if(isInBox){
		script.mat.mainPass.colour = script.inColor; // if in box
	}else{
		script.mat.mainPass.colour = script.outColor; // if outside of box
	}
}
var onUpdateEvent = script.createEvent("UpdateEvent"); // do on every frame
onUpdateEvent.bind(onUpdate);
// Max van Leeuwen
//  maxvanleeuwen.com

// Checks if a ray intersects with a plane, and prints the local position on the plane
// Requires LSQuickScripts



//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"Casts a ray onto a plane, and returns the intersection point"}
//@ui {"widget":"label"}



//@input SceneObject plane
//@input SceneObject ray
//@input Asset.Material hitVisualizerMat



function onUpdate(){
	// ray position, forward
	var rayPoint = script.ray.getTransform().getWorldPosition();
	var rayFwd = script.ray.getTransform().forward;

	// plane position, forward
	var planePos = script.plane.getTransform().getWorldPosition();
	var planeFwd = script.plane.getTransform().forward;

	// check ray intersection
	var planeRayResult = planeRay(rayPoint, rayFwd, planePos, planeFwd);

	// if hitting the plane
	if(planeRayResult){
		script.hitVisualizerMat.mainPass.planeRayPosition = planeRayResult; // make the plane's shader render a circle
	}
}

// do on every frame
var onUpdateEvent = script.createEvent("UpdateEvent");
onUpdateEvent.bind(onUpdate);
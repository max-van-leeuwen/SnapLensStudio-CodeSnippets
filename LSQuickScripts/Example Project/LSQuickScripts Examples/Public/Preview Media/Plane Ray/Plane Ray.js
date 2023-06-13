// Max van Leeuwen
// ig @max.van.leeuwen
// twitter @maksvanleeuwen
//
// Checks if a ray intersects with a plane, and prints the local position on the plane.



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
	var planeRayResult = global.planeRay(rayPoint, rayFwd, planePos, planeFwd);
	if(planeRayResult){ // if hitting the plane
		print('plane hit: ' + planeRayResult.toString());
		script.hitVisualizerMat.mainPass.planeRayPosition = planeRayResult;
	}
}

// do on every frame
var onUpdateEvent = script.createEvent("UpdateEvent");
onUpdateEvent.bind(onUpdate);
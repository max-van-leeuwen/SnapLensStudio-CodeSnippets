// Max van Leeuwen
// ig @max.van.leeuwen
// twitter @maksvanleeuwen
//
// Checks if point is in box. Use the 'Unit Box' from the asset store for this! Not Lens Studio's default box.



//@input SceneObject point
//@input SceneObject box
//@input Asset.Material mat
//@input Component.Text label



function onUpdate(){
	var pointPos = script.point.getTransform().getWorldPosition(); // position of point to measure
	var isInBox = global.isInBox(pointPos, script.box.getTransform()) // check if point is inside box

	if(isInBox){
		script.mat.mainPass.isInBox = true;
		script.mat.mainPass.positionInBox = isInBox;
		script.label.text = isInBox.toString();
	}else{
		script.mat.mainPass.isInBox = false;
		script.label.text = ""; // empty label
	}
}

// do on every frame
var onUpdateEvent = script.createEvent("UpdateEvent");
onUpdateEvent.bind(onUpdate);
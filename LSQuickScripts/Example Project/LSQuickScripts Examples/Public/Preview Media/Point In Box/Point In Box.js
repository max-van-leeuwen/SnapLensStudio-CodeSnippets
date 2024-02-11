// Max van Leeuwen
// twitter      @maksvanleeuwen
// instagram    @max.van.leeuwen
// maxvanleeuwen.com
//
// Checks if point is in box. Use the 'Unit Box' from the asset store for this! (Not Lens Studio's default box.)



//@input SceneObject point
//@input SceneObject box
//@input Asset.Material mat
//@input Component.Text label



function onUpdate(){
	var pointPos = script.point.getTransform().getWorldPosition(); // position of point to measure
	var data = pointInBox(pointPos, script.box.getTransform(), true) // check if point is inside box, the last argument indicates that we also want to fetch the point's relative position in the box!
	
	if(data.isInside){
		script.mat.mainPass.isInBox = true;
		script.label.text = data.relativePosition.toString();
	}else{
		script.mat.mainPass.isInBox = false;
		script.label.text = "";
	}
}

// do on every frame
var onUpdateEvent = script.createEvent("UpdateEvent");
onUpdateEvent.bind(onUpdate);
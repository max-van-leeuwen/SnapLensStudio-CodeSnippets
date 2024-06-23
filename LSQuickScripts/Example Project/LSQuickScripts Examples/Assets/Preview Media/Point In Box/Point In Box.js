// Max van Leeuwen
//  @maksvanleeuwen
//  links.maxvanleeuwen.com

// Checks if point is in box. Use a 'Unit Box' from the asset store!

// Requires LSQuickScripts



//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"Move the point around inside or outside the box, and the box knows when it's containing the point!"}
//@ui {"widget":"label"}



//@input SceneObject point
//@input SceneObject box
//@input Asset.Material mat
//@input Component.Text label



function onUpdate(){
	var pointPos = script.point.getTransform().getWorldPosition(); // position of point to measure
	var data = pointInBox(pointPos, script.box.getTransform(), true) // check if point is inside box, the last argument indicates that we also want to fetch the point's relative position in the box!
	
	if(data.isInside){
		script.mat.mainPass.isInBox = true;
		script.label.text = data.relativePosition.toString(); // if in box, make text show the position
	}else{
		script.mat.mainPass.isInBox = false;
		script.label.text = "not in box";
	}
}

// do on every frame
var onUpdateEvent = script.createEvent("UpdateEvent");
onUpdateEvent.bind(onUpdate);
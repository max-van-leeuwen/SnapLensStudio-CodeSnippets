// Max van Leeuwen
// ig @max.van.leeuwen
// twitter @maksvanleeuwen
//
// Checks if object is in front of or behind other object. Changes the color accordingly.



//@input SceneObject compareTo
//@input vec3 frontColour {"widget":"color"}
//@input vec3 behindColour {"widget":"color"}



var mat = script.getSceneObject().getComponent("Component.RenderMeshVisual").getMaterial(0); // get material to change the color of



// check if the object is in front or behind of comparison object
function onUpdate(){
	var objectIsInFront = global.isInFront(script.getSceneObject(), script.compareTo);
	
	if(objectIsInFront){
		mat.mainPass.colour = script.frontColour; // if in front
	}else{
		mat.mainPass.colour = script.behindColour; // if behind
	}
}
var onUpdateEvent = script.createEvent("UpdateEvent"); // do on every frame
onUpdateEvent.bind(onUpdate);
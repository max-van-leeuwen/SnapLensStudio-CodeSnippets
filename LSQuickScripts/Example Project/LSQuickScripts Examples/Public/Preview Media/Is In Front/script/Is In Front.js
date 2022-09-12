// Max van Leeuwen
// ig @max.van.leeuwen
// twitter @maksvanleeuwen
//
// Checks if object is in front of or behind other object. Changes the color accordingly.



//@input SceneObject compareTo
//@input vec3 frontColour {"widget":"color"}
//@input vec3 behindColour {"widget":"color"}
//@input Asset.Material mat



// check if the object is in front or behind of comparison object
function onUpdate(){
	var objectIsInFront = global.isInFront(script.getSceneObject(), script.compareTo);
	
	if(objectIsInFront){
		script.mat.mainPass.colour = script.frontColour; // if in front
	}else{
		script.mat.mainPass.colour = script.behindColour; // if behind
	}
}
var onUpdateEvent = script.createEvent("UpdateEvent"); // do on every frame
onUpdateEvent.bind(onUpdate);
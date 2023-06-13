// Max van Leeuwen
// ig @max.van.leeuwen
// twitter @maksvanleeuwen
//
// Checks if object is in front of or behind other object. Changes the color accordingly.



//@input SceneObject compareTo
//@input Asset.Material mat
//@input vec3 frontColour {"widget":"color"}
//@input vec3 behindColour {"widget":"color"}

var compareTrf = script.compareTo.getTransform();
var thisTrf = script.getSceneObject().getTransform();



// check if the object is in front or behind of comparison object
function onUpdate(){
	var objectIsInFront = global.isInFront(compareTrf.getWorldPosition(), thisTrf.getWorldPosition(), compareTrf.forward);
	
	if(objectIsInFront){ // if 'compare' is in front of this sceneobject
		script.mat.mainPass.colour = script.frontColour;
	}else{ // if behind
		script.mat.mainPass.colour = script.behindColour;
	}
}

// do on every frame
var onUpdateEvent = script.createEvent("UpdateEvent");
onUpdateEvent.bind(onUpdate);
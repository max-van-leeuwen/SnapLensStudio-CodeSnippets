// Max van Leeuwen
// ig @max.van.leeuwen
// twitter @maksvanleeuwen
//
// Sets the colour of the Material on this object according to HSV values.



//@input bool animate
//@input float Speed {"showIf":"animate"}
//@input float Hue {"showIf":"animate", "showIfValue":"false"}
//@input float Saturation
//@input float Value



// get material
var mat = script.getSceneObject().getComponent("Component.RenderMeshVisual").getMaterial(0);



function onUpdate(){
	// get inspector values
	var h = script.Hue;
	var s = script.Saturation;
	var v = script.Value;

	if(script.animate){
		// increase animation value over time
		var anim = getTime() * script.Speed;

		// override hue with animated value (stay within 0-1)
		h = anim % 1;
	}

	// set material colour
	mat.mainPass.colour = global.HSVtoRGB(h, s, v);
}
var onUpdateEvent = script.createEvent("UpdateEvent");
onUpdateEvent.bind(onUpdate);
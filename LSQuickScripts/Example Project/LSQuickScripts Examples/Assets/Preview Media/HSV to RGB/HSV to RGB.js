// Max van Leeuwen
//  maxvanleeuwen.com

// Set the color of a material using hue, saturation, value (instead of RGB)
// Requires LSQuickScripts



//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"Converts Hue, Saturation, Value to Red, Green, Blue"}
//@ui {"widget":"label"}



//@input Asset.Material mat
//@input bool animate
//@input float speed {"showIf":"animate"}
//@input float hue {"showIf":"animate", "showIfValue":"false", "widget":"slider", "min":0, "max":1, "step":0.01}
//@input float saturation {"widget":"slider", "min":0, "max":1, "step":0.01}
//@input float value {"widget":"slider", "min":0, "max":1, "step":0.01}



function onUpdate(){
	// get inspector values
	var h = script.hue;
	var s = script.saturation;
	var v = script.value;

	// if animating, overwrite hue over time
	if(script.animate){
		h = getTime() * script.speed; // hue value
	}

	// set material colour
	script.mat.mainPass.colour = hsvToRgb(h, s, v);
}
var onUpdateEvent = script.createEvent("UpdateEvent");
onUpdateEvent.bind(onUpdate);
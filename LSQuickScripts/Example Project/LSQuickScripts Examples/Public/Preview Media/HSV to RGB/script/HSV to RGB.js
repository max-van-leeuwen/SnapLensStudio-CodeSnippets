// Max van Leeuwen
// ig @max.van.leeuwen
// twitter @maksvanleeuwen
//
// Set the colour of a material using hue, saturation, value (instead of RGB).



//@input Asset.Material mat
//@input bool animate
//@input float Speed {"showIf":"animate"}
//@input float Hue {"showIf":"animate", "showIfValue":"false"}
//@input float Saturation
//@input float Value



function onUpdate(){
	// get inspector values
	var h = script.Hue;
	var s = script.Saturation;
	var v = script.Value;

	// if animating, overwrite hue over time
	if(script.animate){
		// hue value
		var anim = getTime() * script.Speed;
		h = anim % 1;
	}

	// set material colour
	script.mat.mainPass.colour = global.HSVtoRGB(h, s, v);
}
var onUpdateEvent = script.createEvent("UpdateEvent");
onUpdateEvent.bind(onUpdate);
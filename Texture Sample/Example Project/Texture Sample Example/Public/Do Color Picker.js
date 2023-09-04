// Max van Leeuwen
// twitter      @maksvanleeuwen
// instagram    @max.van.leeuwen
// maxvanleeuwen.com
//
// Picks the color of the given texture on touch



//@input Asset.Texture texture
//@input Asset.Material colorPicker



// initialize texture sampler
var tex = new TextureSample();



// sample texture using touch args
function doColorSampler(eventArgs){
	var pos = eventArgs.getTouchPosition(); // get touch position (vec2, 0-1)
	pos.y = 1-pos.y; // screen positions have an inversed y component (0 is top of screen), but texture sampling assumes 0 to be the bottom of the screen. this line inverses it
	tex.setTexture(script.texture); // update texture in sampler (only do this with textures that change over time! not necessary if it's a static image)
	var color = tex.sample(pos); // sample the texture color at the touch position
	script.colorPicker.mainPass.pickedColor = color; // apply sampled color to the preview material
}



// interact on touch start, touch move, and touch end
var touchStartEvent = script.createEvent("TouchStartEvent");
touchStartEvent.bind(doColorSampler);
var touchMoveEvent = script.createEvent("TouchMoveEvent");
touchMoveEvent.bind(doColorSampler);
var touchEndEvent = script.createEvent("TouchEndEvent");
touchEndEvent.bind(doColorSampler);
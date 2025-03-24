// Max van Leeuwen
//  maxvanleeuwen.com



//@input Asset.Texture texture
//@input Asset.Material applyToMaterial



function doColorSampler(eventArgs){
    var tex = new TextureSample(script.texture);
	var pos = eventArgs.getTouchPosition();
	pos.y = 1-pos.y; // texture sampling assumes y=0 to be the bottom of the texture, not the top
	script.applyToMaterial.mainPass.c = tex.sample(pos); // sample and apply
}

// interact on touch
var touchStartEvent = script.createEvent("TouchStartEvent");
touchStartEvent.bind(doColorSampler);
var touchMoveEvent = script.createEvent("TouchMoveEvent");
touchMoveEvent.bind(doColorSampler);
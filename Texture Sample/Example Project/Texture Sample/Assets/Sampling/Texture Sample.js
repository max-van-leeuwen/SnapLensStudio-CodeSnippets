// Max van Leeuwen
//  maxvanleeuwen.com



// Make new class instance using
//	sampler = new TextureSample(Asset.Texture)
//
// Sample using
//	sampler.sample(<vec2>)



global.TextureSample = function(texture){
    if(!texture) return;
    
	var data;
	var tex;
	var dimensions = {"w":null, "h":null};

    data = new Uint8Array(4);
    tex = ProceduralTextureProvider.createFromTexture(texture);
    dimensions.w = tex.getWidth() - 1;
    dimensions.h = tex.getHeight() - 1;

	/**
	 * @type {Function}
	 * @description Sample at texture coordinate (vec2, 0-1). Returns vec4 color (8bit). */
	this.sample = function(pos){
		tex.control.getPixels(
			Math.round(clamp(pos.x) * dimensions.w),
			Math.round(clamp(pos.y) * dimensions.h), 1, 1, data
		);
		return new vec4(data[0], data[1], data[2], data[3]).uniformScale(1/255);
	}
}

function clamp(v){
	return v < 0 ? 0 : v > 1 ? 1 : v;
}
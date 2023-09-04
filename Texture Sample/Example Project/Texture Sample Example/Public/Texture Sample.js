// Max van Leeuwen
// twitter      @maksvanleeuwen
// instagram    @max.van.leeuwen
// maxvanleeuwen.com
//
// Sample color from texture



// Make new class instance using
//	new TextureSample()
//
// Initialize a texture using
//	.setTexture(<Asset.Texture>)
//
// Sample using
//	.sample(<vec2>)
//
// Alternatively, use this imple one-liner if you only need to sample a value once
//	var color = new TextureSample( <texture asset> ).sample( <position vec2> )



global.TextureSample = function(textureToSample){
	// private
	var data;
	var tex;
	var dimensions = {"w":null, "h":null};

	// public
	/**
	 * @type {Function}
	 * @description Change the texture to sample. */
	this.setTexture = function(texture){
		data = new Uint8Array(4);
		tex = ProceduralTextureProvider.createFromTexture(texture);
		dimensions.w = tex.getWidth() - 1;
		dimensions.h = tex.getHeight() - 1;
	}
	if(textureToSample) this.setTexture(textureToSample); // set texture if passed in as argument

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
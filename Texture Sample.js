// Max van Leeuwen
//
// Sample color from texture
//
// Make new class instance using new TextureSample()
// Initialize a texture using .setTexture(<Asset.Texture>)
// Sample using .sample(<vec2>)



global.TextureSample = function(){
	/**
	 * @type {Function}
	 * @description Change the texture to sample. */
	this.setTexture = function(texture){
		data = new Uint8Array(4);
		tex = ProceduralTextureProvider.createFromTexture(texture);
		dimensions.w = tex.getWidth() - 1;
		dimensions.h = tex.getHeight() - 1;
	}

	/**
	 * @type {Function}
	 * @description Sample at texture coordinate (vec2, 0-1). Returns vec4 color (8bit). */
	this.sample = function(pos){
		tex.control.getPixels(
			Math.round(pos.x * dimensions.w),
			Math.round(pos.y * dimensions.h), 1, 1, data
		);
		return new vec4(data[0], data[1], data[2], data[3]).uniformScale(1/255);
	}

	// private
	var data;
	var tex;
	var dimensions = {"w":null, "h":null};
}
// Max van Leeuwen
// twitter      @maksvanleeuwen
// instagram    @max.van.leeuwen
// maxvanleeuwen.com
//
// Generates high-res 1x1 plane, simply call the start() function and set the parameters in the inspector.



//@input bool createOnStart
//@input Component.RenderMeshVisual rmv
//@input int subdivisions



script.api.start = start;



if(!script.rmv) throw("No RenderMeshVisual given");



function start(){
	var planeMesh = makePlaneMesh();
	script.rmv.mesh = planeMesh;
}
if(script.createOnStart) start();



function makePlaneMesh(){
	var builder = new MeshBuilder([
		{ name: "position", components: 3 }
	]);
	
	builder.topology = MeshTopology.Triangles;
	builder.indexType = MeshIndexType.UInt16;

	var size = script.subdivisions;
	var half = .5 / size;

	for(var i = 0; i < script.subdivisions*script.subdivisions; i++){
		var offsetX = (i % script.subdivisions) - script.subdivisions/2;
		var offsetY = (Math.floor(i/script.subdivisions)) - script.subdivisions/2;

		var left = -half + offsetX / size;
		var right = half + offsetX / size;
		var top = half + offsetY / size;
		var bottom = -half + offsetY / size;
	
		builder.appendVerticesInterleaved([
			left, 0, top,
			left, 0, bottom,
			right, 0, bottom,
			right, 0, top
		]);
		
		var n = i*4;
		builder.appendIndices([
			0+n, 1+n, 2+n,
			2+n, 3+n, 0+n,
		]);
	}

	builder.updateMesh();
	return builder.getMesh();
}
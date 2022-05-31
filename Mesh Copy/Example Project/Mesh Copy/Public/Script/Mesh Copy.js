// Max van Leeuwen
//
// Reads a mesh and then re-builds all the vertices using MeshBuilder.
// Returns the MeshBuilder object.
//
// How to use:
//	global.makeMeshCopy( <Mesh Asset [Asset.RenderMesh]>, <Normals [bool] (optional, default True)>, <UVs [bool] (optional, default True)> )
//
// Example:
//	var newMeshBuilder = global.makeMeshCopy(script.renderMesh, true, true); // copies normals and UVs too
//	script.renderMeshVisual.mesh = newMeshBuilder.getMesh();



global.makeMeshCopy = function(meshAsset, doNormals, doUVs){
	var positions;
	var normals;
	var uvs;

	// get mesh information
	var indices = meshAsset.extractIndices();
	positions = meshAsset.extractVerticesForAttribute("position");
	if(doNormals) normals = meshAsset.extractVerticesForAttribute("normal");
	if(doUVs) uvs = meshAsset.extractVerticesForAttribute("texture0");
	
	// prepare MeshBuilder data
	var dataTypes = [				{name:"position", components:3}	]
	if(doNormals) dataTypes.push(	{name:"normal", components:3}	);
	if(doUVs) dataTypes.push(		{name:"texture0", components:2}	);

	// new MeshBuilder object
	var builder = new MeshBuilder(dataTypes);
	builder.topology = MeshTopology.Triangles;
	builder.indexType = MeshIndexType.UInt16;

	// make interleaved data
	var vertices = [];
	for(var i = 0; i < positions.length/3; i++){
		var vtx2 = i*2; // loop through data of 2 components
		var vtx3 = i*3; // loop through data of 3 components
		vertices.push(positions[vtx3+0]);
		vertices.push(positions[vtx3+1]);
		vertices.push(positions[vtx3+2]);
		if(doNormals){
			vertices.push(normals[vtx3+0]);
			vertices.push(normals[vtx3+1]);
			vertices.push(normals[vtx3+2]);
		}
		if(doUVs){
			vertices.push(uvs[vtx2+0]);
			vertices.push(uvs[vtx2+1]);
		}
	}

	builder.appendIndices(indices);
	builder.appendVerticesInterleaved(vertices);

	builder.updateMesh();
	return builder;
}
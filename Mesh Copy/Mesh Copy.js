// Max van Leeuwen
//
// Reads a mesh and then re-builds all the vertices using MeshBuilder.
// Returns the MeshBuilder object.
//
// How to use:
//	global.makeMeshCopy( <meshAsset [Asset.RenderMesh]>, <doNormals [bool] (optional, default True)>, <doUVs [bool] (optional, default True)>, <createEmptyUVs [bool] (optional, default False) )
//		meshAsset			Which mesh asset to clone.
//		doNormals			If enabled, normals will be read from mesh asset and written to new mesh copy.
//		doUVs				If enabled, UVs will be read from mesh asset and written to new mesh copy.
//		createEmptyUVs		If enabled, the mesh will have UVs but they will all be 0. This is useful if you're planning on overwriting the UVs later. This will overrule the 'doUVs' parameter.
//
// Example:
//	var newMeshBuilder = global.makeMeshCopy(script.renderMesh, true, false); // copies mesh, including normals but without UVs
//	script.renderMeshVisual.mesh = newMeshBuilder.getMesh();
//
// Troubleshooting:
//	If you get the error 'Unknown attribute name', check if you're trying to copy Normals or UVs from a mesh asset that doesn't have one of these attributes in it!



global.makeMeshCopy = function(meshAsset, doNormals, doUVs, createEmptyUVs){
	var positions;
	var normals;
	var uvs;

	// get mesh information
	var indices = meshAsset.extractIndices();
	positions = meshAsset.extractVerticesForAttribute("position");
	if(doNormals) normals = meshAsset.extractVerticesForAttribute("normal");
	if(doUVs) uvs = meshAsset.extractVerticesForAttribute("texture0");
	
	// prepare MeshBuilder data
	var dataTypes = [								{name:"position", components:3}	]
	if(doNormals) dataTypes.push(					{name:"normal", components:3}	);
	if(doUVs || createEmptyUVs) dataTypes.push(		{name:"texture0", components:2}	);

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
		if(doUVs || createEmptyUVs){
			vertices.push(createEmptyUVs ? 0 : uvs[vtx2+0]);
			vertices.push(createEmptyUVs ? 0 : uvs[vtx2+1]);
		}
	}

	builder.appendIndices(indices);
	builder.appendVerticesInterleaved(vertices);

	builder.updateMesh();
	return builder;
}

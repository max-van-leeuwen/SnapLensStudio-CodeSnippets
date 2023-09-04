// Max van Leeuwen
// twitter      @maksvanleeuwen
// instagram    @max.van.leeuwen
// maxvanleeuwen.com



//@input Asset.RenderMesh renderMesh
//@input Component.RenderMeshVisual renderMeshVisual

var newMeshBuilder = global.makeMeshCopy(script.renderMesh);
script.renderMeshVisual.mesh = newMeshBuilder.getMesh();

print("Mesh created! The object you see now is a copy of the mesh, not the mesh asset itself.");




// MeshBuilder has another fun feature: rendering wireframes!
// Check the 'wireframe' box in the Inspector to see the wireframe of the current object.

//@input bool wireframe
if(script.wireframe) newMeshBuilder.topology = MeshTopology.Lines;
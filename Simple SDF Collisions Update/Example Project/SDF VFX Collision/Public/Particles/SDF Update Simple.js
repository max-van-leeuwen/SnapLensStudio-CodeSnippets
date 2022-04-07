// Max van Leeuwen
//
// Simple SDF collision setup for VFX.
//
// Make sure the SDF Collision Sub-Graph in the VFX asset has the following Parameter inputs:
// - interactionMat (Matrix4)
// - bboxMin (vec3)
// - bboxMax (vec3)



//@input SceneObject interactionObj
//@input Component.VFXComponent vfxComponent



var interactionRMV = script.interactionObj.getComponent("Component.RenderMeshVisual");
var interactionTrf = script.interactionObj.getTransform();



function start(){
	var updateEvent = script.createEvent("UpdateEvent");
	updateEvent.bind(onUpdate);
}
start();



function onUpdate(){
	script.vfxComponent.asset.properties['interactionMat'] = interactionTrf.getInvertedWorldTransform();
	script.vfxComponent.asset.properties['bboxMin'] = interactionRMV.mesh.aabbMin;
	script.vfxComponent.asset.properties['bboxMax'] = interactionRMV.mesh.aabbMax;
}
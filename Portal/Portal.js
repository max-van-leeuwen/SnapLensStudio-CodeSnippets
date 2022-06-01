// Max van Leeuwen
//
// Check if user has walked through a portal



script.api.start = startPortal; // arg: callback(isInPortal [bool]) function that is called when the user crossed the portal
script.api.stop = stopPortal; // stops active portal check (if any)



//@ui {"widget":"label", "label":""}
//@input bool flip

//@ui {"widget":"label", "label":""}
//@input SceneObject user
//@input Component.RenderMeshVisual portal

//@ui {"widget":"label", "label":""}
//@input bool visualize
//@input SceneObject unitSphere {"showIf":"visualize"}



var portalEvent;



function startPortal(callback){
	var portalTrf = script.portal.getTransform();
	var userTrf = script.user.getTransform();

	var beenInFrontOfPortal = false; // if the user has been near and in front of portal in this 'session'
	var isInPortal = false; // if the user is currently in the portal

	function portal(){
		// make portal region (sphere) around mesh bounds
		var portalLocalMin = script.portal.localAabbMin();
		var portalLocalMax = script.portal.localAabbMax();
		var portalTrm = portalTrf.getWorldTransform();
		var portalMin = portalTrm.multiplyPoint(portalLocalMin); // oriented corners on mesh
		var portalMax = portalTrm.multiplyPoint(portalLocalMax); // ...
		var portalCenter = script.portal.worldAabbMax().sub(script.portal.worldAabbMin()).uniformScale(1/2).add(script.portal.worldAabbMin()); // center based on mesh bounding box
		var sphereScale = portalMin.distance(portalMax)/2; // scale based on mesh bounding box

		// visualizing sphere for debugging
		if(script.visualize){
			script.unitSphere.getTransform().setWorldPosition(portalCenter);
			script.unitSphere.getTransform().setWorldScale(vec3.one().uniformScale(sphereScale));
		}

		// check if user is in sphere region, if not stop here
		var userPos = userTrf.getWorldPosition();
		if(userPos.distance(portalCenter) > sphereScale){
			beenInFrontOfPortal = false; // user stepped away, reset
			return;
		}

		// check if portal plane was crossed
		var target = new vec3( portalCenter.x - userPos.x,
							   portalCenter.y - userPos.y,
							   portalCenter.z - userPos.z);
		target = target.normalize();
		var dir = target.dot(portalTrf.forward);
		var crossedPortal = (isInPortal ? !script.flip : script.flip) ? dir > 0 : dir < 0; // check what side of portal you're on, flip result based on whether user is currently in portal or not
		if(crossedPortal){
			if(beenInFrontOfPortal){ // check if user has been on the front side of the portal during this session
				isInPortal = !isInPortal;
				if(callback) callback(isInPortal);
			}
		}else{
			beenInFrontOfPortal = true;
		}
	}

	portalEvent = script.createEvent("UpdateEvent");
	portalEvent.bind(portal);
}



function stopPortal(){
	if(portalEvent){
		script.removeEvent(portalEvent);
		portalEvent = null;
	}
}
// Max van Leeuwen
// twitter      @maksvanleeuwen
// instagram    @max.van.leeuwen
// maxvanleeuwen.com
//
// Check if user has walked through a portal.



// Super easy to use. In the Inspector, simply assign the User (camera) and the Portal (Render Mesh Visual).
// To change which way the opening is, use 'flip'.
// To always allow the user leaving the portal when walking out of it (without even touching the portal), use 'alwaysAllowedToLeave'
//
// To start the portal check, use:
//		global.portal.start( < callback function, first argument is true or false depending on if the user is inside the portal scene or not > );
// To stop the portal, use:
//		global.portal.stop();
// To get current user-in-portal state, use:
//		global.portal.isInPortal();
//
// For example: To print when the user walks through the portal, use this code from any other script in your project:
//		function walkedThroughPortal( isInPortal ){
//			print("User is in portal: " + isInPortal.toString());
//		}
//		global.portal.start(walkedThroughPortal);



//@input bool flip
//@input bool alwaysAllowedToLeave

//@ui {"widget":"label", "label":""}
//@input SceneObject user
//@input Component.RenderMeshVisual portal



global.portal = {};
var portalEvent;
var isInPortal = false;



global.portal.start = function(callback){
	var portalTrf = script.portal.getTransform();
	var userTrf = script.user.getTransform();

	var beenInFrontOfPortal = false; // if the user has been near and in front of portal in this 'session'
	isInPortal = false; // if the user is currently in the portal
	
	function portal(){
		// make portal region (sphere) around mesh bounds
		var portalLocalMin = script.portal.localAabbMin();
		var portalLocalMax = script.portal.localAabbMax();
		var portalTrm = portalTrf.getWorldTransform();
		var portalMin = portalTrm.multiplyPoint(portalLocalMin); // oriented corners on mesh
		var portalMax = portalTrm.multiplyPoint(portalLocalMax); // ...
		var portalCenter = script.portal.worldAabbMax().sub(script.portal.worldAabbMin()).uniformScale(.5).add(script.portal.worldAabbMin()); // center based on mesh bounding box
		var sphereScale = portalMin.distance(portalMax)/2; // active radius around portal based on mesh bounding box
		
		// check if user is in sphere region, if not stop here (except when inside portal, leaving is always allowed)
		var userPos = userTrf.getWorldPosition();
		if(userPos.distance(portalCenter) > sphereScale && (script.alwaysAllowedToLeave ? !isInPortal : true)){
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



global.portal.isInPortal = function(){
	return isInPortal;
}



global.portal.stop = function(){
	if(portalEvent){
		script.removeEvent(portalEvent);
		portalEvent = null;
	}
}
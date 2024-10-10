// Max van Leeuwen
//  @maksvanleeuwen
//  links.maxvanleeuwen.com

// Hand Tracking tester



//@ui {"widget":"label"}
//@input Component.Text3D status
var statusTrf = script.status.getTransform(); // get status text's transform



// --- Helpers



// shorter vec3 text, easier to read
function short(v){
    return `x: ${v.x.toFixed(1)} y: ${v.y.toFixed(1)} z: ${v.z.toFixed(1)}`;
}

// set status text rotation based on hand's forward and up directions
function setRotation(isTap){
    let fwd = HandTracking.getPinchForward();
    let up = HandTracking.getPinchUp();
    if(!up || !fwd) return;

    // invert when tapping in preview panel, otherwise the text is mirrored
    if(isTap) fwd = fwd.uniformScale(-1);

    const rot = quat.lookAt(fwd, up);
    statusTrf.setWorldRotation(rot);
}



// --- Hand Tracking / Pinch Detection



// track status
HandTracking.onTrackStart.add(function(isTap){
    script.status.text = `tracking\nhand: ${HandTracking.getActiveHand()}`;
});

HandTracking.onTrackEnd.add(function(isTap){
    script.status.text = `tracking ended`;
});


// pinch status
HandTracking.onPinchStart.add(function(pos, isTap){
    script.status.text = `pinching\n${short(pos)}`; // show status text position
});

HandTracking.onPinchHold.add(function(pos, isTap){
    statusTrf.setWorldPosition(pos); // set status text position
    setRotation(isTap); // set status text rotation
    script.status.text = `pinching\n${short(pos)}`;
});

HandTracking.onPinchEnd.add(function(pos, isTap){
    script.status.text = `tracking\nhand: ${HandTracking.getActiveHand()}`;
});

// hand change status
HandTracking.onActiveHandChange.add(function(prv, crr){
    script.status.text = `tracking changed\n${prv} -> ${crr}`;
});
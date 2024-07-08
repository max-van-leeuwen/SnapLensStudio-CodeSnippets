// Max van Leeuwen
//  @maksvanleeuwen
//  links.maxvanleeuwen.com

// Testing Hand Tracking



//@ui {"widget":"label"}
//@input Component.Text3D status
//@input Component.LookAtComponent lookAt



// when tapping on the screen to emulate hand tracking, set a distance in 3D space
HandTracking.distFromCamera = 40;



// track
HandTracking.onTrackStart.add(function(isTap){
    script.status.text = `tracking\nhand: ${HandTracking.getActiveHand()}`;
});

HandTracking.onTrackEnd.add(function(isTap){
    script.status.text = `tracking ended`;
});


// pinch
HandTracking.onPinchStart.add(function(pos, isTap){
    script.status.text = `pinching\n${short(pos)}`;
    script.lookAt.enabled = true; // start looking at camera when pinching
});

HandTracking.onPinchHold.add(function(pos, isTap){
    script.status.getTransform().setWorldPosition(pos);
    script.status.text = `pinching\n${short(pos)}`;
});

HandTracking.onPinchEnd.add(function(pos, isTap){
    script.status.text = `tracking\nhand: ${HandTracking.getActiveHand()}`;
    script.lookAt.enabled = false; // stop looking at camera when not pinching
});


// hand change
HandTracking.onActiveHandChange.add(function(prv, crr){
    script.status.text = `tracking changed\n${prv} -> ${crr}`;
})



// shorter vec3 format for easy reading
function short(v){
    return `x: ${v.x.toFixed(1)} y: ${v.y.toFixed(1)} z: ${v.z.toFixed(1)}`;
}
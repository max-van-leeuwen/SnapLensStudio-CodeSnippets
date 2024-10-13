// Max van Leeuwen
//  maxvanleeuwen.com

// Access to common hints to spawn throughout the experience



// access
global.Hints = script;
script.setRemoveMode = setRemoveMode; // args: bool
script.showHandText = showHandText; // args: string, duration
script.hideHandText = hideHandText;



// params
const handTextDuration = 4;



// inputs
//@ui {"widget":"label"}
//@input SceneObject removeMode
var removeMode = script.removeMode;
var removeModeTrf = removeMode.getTransform();
var removeModeMat = removeMode.getChild(0).getComponent("Component.Image").getMaterial(0);

//@ui {"widget":"label"}
//@input Component.Text handText



// placeholders
var handTextAnim;



function init(){
    removeMode.enabled = false;
    script.handText.enabled = false;

    // create hand text animator
    handTextAnim = new AnimateProperty(function(v){
        script.handText.textFill.color = new vec4(1, 1, 1, v);
        script.handText.outlineSettings.fill.color = new vec4(0, 0, 0, v);
        script.handText.dropshadowSettings.fill.color = new vec4(0, 0, 0, v);
        script.handText.backgroundSettings.fill.color = new vec4(0, 0, 0, v);
    })
    handTextAnim.startFunction = function(inAnim){
        if(inAnim) script.handText.enabled = true; // enable on start

        if(inAnim){ // on start, automatically queue the out-anim
            // stop previous if any
            if(handTextAnim.autoEndDelay) handTextAnim.autoEndDelay.stop();
            handTextAnim.autoEndDelay = new DoDelay(function(){ // bind to animation as custom parameter
                handTextAnim.setReversed(true);
                handTextAnim.start();
            });
            handTextAnim.autoEndDelay.byTime(handTextAnim.customDuration);
        }
    }
    handTextAnim.endFunction = function(inAnim){
        if(!inAnim) script.handText.enabled = false; // disable on end
    }
    handTextAnim.duration = .05;
    handTextAnim.reverseDuration = .35;
    handTextAnim.pulse(0);
    handTextAnim.setReversed(true); // set to 'reversed' so we can use the reversed check to know if the object is currently visible or not

    // make hand text smoothly follow hand
    var handTextAnchor = global.scene.createSceneObject("handTextFollower");
    var handTextAnchorTrf = handTextAnchor.getTransform();
    script.createEvent("UpdateEvent").bind(function(){
        const p = HandTracking.getPinchPosition() || HandTracking.getHoverWorldPosition();
        if(p) handTextAnchorTrf.setWorldPosition(p);

        script.handText.getSceneObject().enabled = !!p; // only show hint if hand is currently being tracked
    });
    var smoothFollowAnchor = new SmoothFollow();
    smoothFollowAnchor.follow = handTextAnchor;
    smoothFollowAnchor.apply = script.handText.getSceneObject().getParent();
    smoothFollowAnchor.smoothing = .1;
    smoothFollowAnchor.rotation = false;
    smoothFollowAnchor.scale = false;
    smoothFollowAnchor.start();
}
init();



// remove mode
var removeModeEvent = script.createEvent("UpdateEvent");
removeModeEvent.bind(removeModeUpdate);
removeModeEvent.enabled = false;
var removeModeDisableDelay = new DoDelay(function(){removeMode.enabled=false});
const removeModeDelay = 1; // arbitrary, waiting for shader animation to end
var removeModeSmoothFollow = new SmoothFollow(); // smooth follower for hand tracking
removeModeSmoothFollow.smoothing = .1;
removeModeSmoothFollow.onUpdate.add(removeModeSmoothUpdate);

function removeModeUpdate(eventArgs, instant){
    const p = HandTracking.getPinchPosition() || HandTracking.getHoverWorldPosition();
    if(p) removeModeSmoothFollow.addValue(p, instant);
}

function removeModeSmoothUpdate(){
    const p = removeModeSmoothFollow.getValue();
    removeModeTrf.setWorldPosition(p);
}

function setRemoveMode(v){
    if(v){
        removeModeUpdate(null, true); // force on first frame
        removeModeDisableDelay.stop(); // cancel disable delay
        removeMode.enabled = true;
        removeModeEvent.enabled = v;
        removeModeMat.mainPass.startTime = getTime();
    }else{
        removeModeDisableDelay.byTime(removeModeDelay); // disable after a while
        removeModeMat.mainPass.endTime = getTime();
    }
}



// hand text
function showHandText(str, duration){
    script.handText.text = str;
    if(handTextAnim.getReversed()){ // if not currently visible
        handTextAnim.customDuration = duration || handTextDuration;
        handTextAnim.setReversed(false); // anim in
        handTextAnim.start();
    }
}

function hideHandText(){
    if(!handTextAnim.getReversed()){ // if currently visible
        handTextAnim.setReversed(true); // anim out
        handTextAnim.start();
    }
}
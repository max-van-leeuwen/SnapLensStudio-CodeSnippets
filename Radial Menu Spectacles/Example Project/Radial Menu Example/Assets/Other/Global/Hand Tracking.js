// Max van Leeuwen
//  maxvanleeuwen.com

// Hand Tracking



// Requires LSQuickScripts 2.31
if(!global.lsqs) throw("LSQuickScripts is missing! Install it from maxvanleeuwen.com/lsquickscripts");



// global
global.HandTracking = script;

// callbacks
script.onPinchStart = new Callback(); // pos, isTap
script.onPinchHold = new Callback(); // pos, isTap
script.onPinchEnd = new Callback(); // pos, isTap
script.onTrackStart = new Callback(); // isTap
script.onTrackEnd = new Callback(); // isTap
script.onActiveHandChange = new Callback(); // prvHand, curHand

script.onHoverStart = new Callback(); // pos
script.onHovering = new Callback(); // pos
script.onHoverEnd = new Callback(); // pos

// functions
script.getActiveHand = () => activeHand; // hand
script.getDominantHand = () => dominantHand; // hand
script.getPinching = () => isPinching; // bool
script.getPinchPosition = () => cursorPos; // pos (for hand tracking, this updates when not pinching! it's the position inbetween thumb and index)
script.getPinchForward = () => cursorFwd; // vec3 (normalized)
script.getPinchUp = () => cursorUp; // vec3 (normalized);
script.getHoverScreenPosition = () => hoverScreenPosition; // vec2
script.getHoverWorldPosition = () => hoverWorldPosition; // vec3

// SIK only
script.Hands = {
    Left : null,
    Right : null,
}



// UI
//@ui {"widget":"label"}
//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"<big><b>Hand Tracking 👐</b> <small>by Max van Leeuwen"}
//@ui {"widget":"label", "label":"Some handy hand tracking functions! With hovering, and tap emulation."}
//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"Requires LSQuickScripts"}
//@ui {"widget":"separator"}

//@ui {"widget":"label"}
//@ui {"widget":"group_start", "label":"<b>Usage"}
    //@ui {"widget":"label", "label":"<small>callbacks - bind using <font color='#56b1fc'><i>.add(</font><i>f<font color='#56b1fc'>)</i></font> and <font color='#56b1fc'><i>.remove(</font><i>f<font color='#56b1fc'>)</i></font>"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onPinchStart</font> <small>→ (<font color='#f5e3d5'>pos</font>, <font color='#f5e3d5'>isTap</font>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onPinchHold</font> <small>→ (<font color='#f5e3d5'>pos</font>, <font color='#f5e3d5'>isTap</font>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onPinchEnd</font> <small>→ (<font color='#f5e3d5'>pos</font>, <font color='#f5e3d5'>isTap</font>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onTrackStart</font> <small>→ (<font color='#f5e3d5'>isTap</font>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onTrackEnd</font> <small>→ (<font color='#f5e3d5'>isTap</font>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onActiveHandChange</font> <small>→ (<font color='#f5e3d5'>prvHand</font>, <font color='#f5e3d5'>curHand</font>)"}

    //@ui {"widget":"label"}
    //@ui {"widget":"label", "label":"<small>hovering callbacks"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onHoverStart</font> <small>→ (<font color='#f5e3d5'>pos</font>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onHovering</font> <small>→ (<font color='#f5e3d5'>pos</font>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onHoverEnd</font> <small>→ (<font color='#f5e3d5'>pos</font>)"}

    //@ui {"widget":"label"}
    //@ui {"widget":"label", "label":"<small>tracking info"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getActiveHand()</font> <small>→ <font color='#f5e3d5'>Hand"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getDominantHand()</font> <small>→ <font color='#f5e3d5'>Hand"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getPinching()</font> <small>→ bool"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getPinchPosition()</font> <small>→ vec3"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getPinchForward()</font> <small>→ vec3"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getPinchUp()</font> <small>→ vec3"}

    //@ui {"widget":"label"}
    //@ui {"widget":"label", "label":"<small>SIK info"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.Hands()</font> <small>= {Left:<font color='#f5e3d5'>Hand</font>, Right:<font color='#f5e3d5'>Hand</font>}"}

    //@ui {"widget":"label"}
    //@ui {"widget":"label", "label":"<small>hover info"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getHoverScreenPosition()</font> <small>→ vec2"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getHoverWorldPosition()</font> <small>→ vec3 at <font color='#56b1fc'>distFromCamera"}
//@ui {"widget":"group_end"}

//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"group_start", "label":"<b>Data Types"}
    //@ui {"widget":"label", "label":" • <font color='#f5e3d5'>pos</font>: <small> position vec3, world space"}
    //@ui {"widget":"label", "label":" • <font color='#f5e3d5'>isTap</font>: <small> bool if emulated (not Hand Tracking)"}
    //@ui {"widget":"label", "label":" • <font color='#f5e3d5'>Hand</font>: <small> string ('left'|'right') to use with:"}
    //@ui {"widget":"label", "label":"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<small>SIK.HandInputData.getHand(Hand)"}
//@ui {"widget":"group_end"}

//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"separator"}
//@ui {"widget":"label"}
//@input bool allowTap {"label":"<b>Tap"}
//@ui {"widget":"group_start", "label":"", "showIf":"allowTap"}
    //@input bool allowTapDelivery {"label":"In Delivery"}
    //@input Component.Camera cam
    //@input float distFromCamera = 50
    //@input bool hover
//@ui {"widget":"group_end", "showIf":"allowTap"}

//@ui {"widget":"label"}
//@input bool allowHandTracking {"label":"<b>Hand Tracking"}
//@ui {"widget":"group_start", "label":"", "showIf":"allowHandTracking"}
    //@input Component.ObjectTracking3D handLeft
    //@input Component.ObjectTracking3D handRight
    //@input int stabilityFrames = 3 {"min":0} // on any track or pinch change, there will be a delay of this many frames to catch some false negatives (set to 0 to disable)
    //@ui {"widget":"label", "label":"<small>amount of frames delay before a track change or pinch end, 0=disable"}
//@ui {"widget":"group_end", "showIf":"allowHandTracking"}

//@ui {"widget":"label"}
//@input bool allowSIK {"label":"<b>SIK"}
//@ui {"widget":"label", "label":"<small>Spectacles Interaction Kit 🕶️"}
//@ui {"widget":"label", "label":"<small>make sure to right-click -> 'unpack' the SIK package"}
//@ui {"widget":"group_start", "label":"", "showIf":"allowSIK"}
    //@input bool syncCombined
//@ui {"widget":"group_end", "showIf":"allowSIK"}
//@ui {"widget":"label"}



// if not in Lens Studio
const isEditor = global.deviceInfoSystem.isEditor();
if(!isEditor){
    script.hover = false; // disable hovering, this is irrelevant outside of editor
}

// if using Sequence (a state manager), override debugging options for delivery. ignored if unused
if(global.Sequence && Sequence.delivery){
    if(!script.allowTapDelivery && !isEditor) script.allowTap = false; // stop allowing tap if 'allow in delivery' is false and we're in delivery + not in editor
}



// params
var dominantHand = 'right'; // dominant hand ('left' or 'right')
const pinchThresholdMobile = 2.5; // thumb & index distance threshold for hand tracking, cm
const SIKPinchDetectManually = false; // when using SIK, use thumb-and-index distance pinch detection instead of built-in pinch detection
const pinchThresholdSIK = 1.8; // thumb & index distance threshold for hand tracking, cm (only relevant if SIKPinchDetectManually is false)



// placeholders
var activeHand = null; // string 'right' or 'left', or null if none. defaults to dominant hand if tapping
var isPinching = false;
var activeHandObject; // active hand object
var stabilityDelayPinch = 0; // countdowns
var stabilityDelayTrackLeft = 0;
var stabilityDelayTrackRight = 0;

var cursorPos; // most recent average position between thumb and index
var cursorFwd; // most recent forward direction (along index finger) for cursorPos
var cursorUp; // most recent up direction (along index finger) for cursorPos
var thumbPos;
var indexPos;

var hoverScreenPosition;
var hoverWorldPosition;



function init(){
    if(script.allowTap) startTap();
    if(script.allowHandTracking) startHandTracking();
    if(script.allowSIK) startSIK();
}
init();



// tap
function startTap(){
    // overall touch blocking while using touch inputs
    global.touchSystem.touchBlocking = true;

    var screenPos;
    function newPositionFromEvent(eventArgs){
        // get position
        if(eventArgs) screenPos = eventArgs.getTouchPosition(); // if no argument given, recalculate using previous screenPos
        cursorPos = script.cam.screenSpaceToWorldSpace(screenPos, script.distFromCamera);
        cursorFwd = script.cam.getTransform().forward.uniformScale(-1);
        cursorUp = script.cam.getTransform().up;
        thumbPos = cursorPos;
        indexPos = cursorPos;
    }

    // interactions
    const PinchTypes = {None:0, Started:1, Holding:2, Ended:3};
    var pinchType = PinchTypes.None;

    // touch
    function touchStart(eventArgs){
        newPositionFromEvent(eventArgs);
        pinchType = PinchTypes.Started;
    }
    function touchMove(eventArgs){
        newPositionFromEvent(eventArgs);
    }
    function touchEnd(eventArgs){
        newPositionFromEvent(eventArgs);
        pinchType = PinchTypes.Ended;
    }
    function pinchUpdate(){
        if(script.hover){
            if(!curHoverFrame) curHoverFrame = 0;
            if(!prvHoverFrame) prvHoverFrame = 0;
            if(isHovering && (curHoverFrame > prvHoverFrame)){
                script.onHoverEnd.callback(hoverWorldPosition);
                hoverScreenPosition = null;
                hoverWorldPosition = null;
                hoverUpdateEvent.enabled = false;
                isHovering = false;
            }
            curHoverFrame++;
        }

        switch(pinchType){
            case PinchTypes.Started:
                // track
                activeHand = dominantHand;
                script.onTrackStart.callback(true);

                // pinch
                isPinching = true;
                script.onPinchStart.callback(cursorPos, true);

                pinchType = PinchTypes.Holding;
                return;

            case PinchTypes.Holding:
                // callback
                newPositionFromEvent();
                script.onPinchHold.callback(cursorPos, true);
                return;

            case PinchTypes.Ended:
                // pinch
                isPinching = false;
                thumbPos = null;
                indexPos = null;
                script.onPinchEnd.callback(cursorPos, true);
                cursorPos = null;

                // track
                activeHand = null;
                script.onTrackEnd.callback(true);
                
                pinchType = PinchTypes.None;
                return;
            
            case PinchTypes.None:
                return;
        }
    }

    // hover
    var curHoverFrame;
    var prvHoverFrame;
    var isHovering;
    function hover(eventArgs){
        // cleaning the hover positions
        var newPos = eventArgs.getHoverPosition();

        hoverScreenPosition = newPos;
        hoverWorldPosition = script.cam.screenSpaceToWorldSpace(hoverScreenPosition, script.distFromCamera);

        if(!isHovering){
            hoverUpdateEvent.enabled = true;
            script.onHoverStart.callback(hoverWorldPosition);
            isHovering = true;
        }
        prvHoverFrame = curHoverFrame || 0;
    }
    function hoverUpdate(){
        script.onHovering.callback(hoverWorldPosition);
    }

    // events
    var touchStartEvent = script.createEvent("TouchStartEvent");
    var touchMoveEvent = script.createEvent("TouchMoveEvent");
    var touchEndEvent = script.createEvent("TouchEndEvent");
    var pinchUpdateEvent = script.createEvent("UpdateEvent");
    if(script.hover){
        var hoverEvent = script.createEvent('HoverEvent');
        var hoverUpdateEvent = script.createEvent('UpdateEvent');
    }

    touchStartEvent.bind(touchStart);
    touchMoveEvent.bind(touchMove);
    touchEndEvent.bind(touchEnd);
    pinchUpdateEvent.bind(pinchUpdate);
    if(script.hover){
        hoverEvent.bind(hover);
        hoverUpdateEvent.bind(hoverUpdate);
        hoverUpdateEvent.enabled = false;
    }
}



// 3D (mobile) hand tracking
function startHandTracking(){
    // placeholders
    var onHandChange = new Callback();
    var forceStopPinch;


    // hand objects
    const leftHandObject = {
        thumbTip : script.handLeft.getAttachedObjects("thumb-3")[0].getTransform(),
        indexTip : script.handLeft.getAttachedObjects("index-3")[0].getTransform()
    }
    const rightHandObject = {
        thumbTip : script.handRight.getAttachedObjects("thumb-3")[0].getTransform(),
        indexTip : script.handRight.getAttachedObjects("index-3")[0].getTransform()
    }


    function getHandByString(str){
        return str=='left'?leftHandObject:rightHandObject;
    }


    // begin tracking
    function start(){
        // continuous cursor position
        var trackStateEvent = script.createEvent("UpdateEvent");
        trackStateEvent.bind(updateTrackingState);

        // pinch check
        var pinchEvent = script.createEvent('UpdateEvent');
        pinchEvent.bind(pinchingUpdate);

        // when hand switches
        onHandChange.add(function(newHand){
            // no change (can happen when going from both hands to dominant hand only)
            if(activeHand == newHand) return;

            script.onActiveHandChange.callback(activeHand, newHand);

            // send track change callback
            if(!activeHand && newHand){
                activeHand = newHand;
                script.onTrackStart.callback(false);
            }
            if(activeHand && !newHand){
                if(isPinching) script.onPinchEnd.callback(cursorPos, false);
                activeHand = newHand;
                isPinching = false;
                script.onTrackEnd.callback(false);
            }

            // update active hand
            activeHand = newHand;
            activeHandObject = newHand ? getHandByString(activeHand) : null;
        
            // start or stop pinch detection update depending on if hand is tracking
            pinchEvent.enabled = !!newHand;
            if(!pinchEvent.enabled) isPinching = false;
        });
    }
    script.createEvent("OnStartEvent").bind(start);


    // keep track of which hand is 'most active' (left, right, dominant, or none)
    var leftTracking;
    var rightTracking;
    function updateTracking(){
        // if currently pinching, stop (don't want the pinch to fly from non-dominant hand to dominant hand)
        if(isPinching) forceStopPinch = true;
        if(rightTracking && leftTracking){ // if both hands are visible, use dominant hand
            onHandChange.callback(dominantHand);
        }else if(rightTracking){
            onHandChange.callback('right');
        }else if(leftTracking){
            onHandChange.callback('left');
        }else{ // no hands are tracked
            onHandChange.callback(null);
        }
    }


    // stability delay when tracking
    function awaitTrackStabilityDelay(handName){ // returns true when new track state needs to wait
        // check relevant hand
        if(handName == 'left'){
            if(stabilityDelayTrackLeft > 0){ // countdown was already started
                stabilityDelayTrackLeft--; // increment
            }else{ // countdown was not yet started
                stabilityDelayTrackLeft = script.stabilityFrames; // start countdown for this hand
            }
            if(stabilityDelayTrackLeft == 0) return false; // can proceed now, no delay
            return true; // delay

        }else if(handName == 'right'){
            if(stabilityDelayTrackRight > 0){ // countdown was already started
                stabilityDelayTrackRight--; // increment
            }else{ // countdown was not yet started
                stabilityDelayTrackRight = script.stabilityFrames; // start countdown for this hand
            }
            if(stabilityDelayTrackRight == 0) return false; // can proceed now, no delay
            return true; // delay
        }
    }


    // cursor position
    function updateTrackingState(){
        // stability delay
        if(script.stabilityFrames){ // auto-reset delay values when tracking is found
            if(script.handLeft.isTracking()) stabilityDelayTrackLeft = 0;
            if(script.handRight.isTracking()) stabilityDelayTrackRight = 0;
        }
        
        // get hand tracks (onTrackStarted and onTrackingLost don't work on Component.ObjectTracking3D)
        if(script.handLeft.isTracking() && !leftTracking){
            leftTracking = true;
            updateTracking();
        }
        if(!script.handLeft.isTracking() && leftTracking){
            if(script.stabilityFrames && awaitTrackStabilityDelay('left')){ // skip this check if awaiting a state delay
            }else{
                leftTracking = false;
                updateTracking();
            }
        }
        if(script.handRight.isTracking() && !rightTracking){
            rightTracking = true;
            updateTracking();
        }
        if(!script.handRight.isTracking() && rightTracking){
            if(script.stabilityFrames && awaitTrackStabilityDelay('right')){ // skip this check if awaiting a state delay
            }else{
                rightTracking = false;
                updateTracking();
            }
        }

        // get hand positions
        if(activeHandObject){
            if(script.stabilityFrames && stabilityDelayTrackLeft==0 || !script.stabilityFrames) thumbPos = activeHandObject.thumbTip.getWorldPosition();
            if(script.stabilityFrames && stabilityDelayTrackRight==0 || !script.stabilityFrames) indexPos = activeHandObject.indexTip.getWorldPosition();
            cursorPos = vec3.lerp(thumbPos, indexPos, .5); // get center between fingers
            cursorFwd = activeHandObject.indexTip.forward;
            cursorUp = activeHandObject.indexTip.up;
        }
    }


    // pinch detection
    var wasPinching;
    function pinchingUpdate(){
        // force pinch stop on this frame
        if(forceStopPinch){
            forceStopPinch = false;
            HandTracking.onPinchEnd.callback(cursorPos, false);
            isPinching = false;
            wasPinching = false;
            stabilityDelayPinch = 0;
            return;
        }

        if(script.stabilityFrames && stabilityDelayPinch > 0) HandTracking.onPinchHold.callback(cursorPos, false);
        
        if(!thumbPos || !indexPos) return;
        if(!leftTracking && !rightTracking) return;

        // check if pinching
        isPinching = thumbPos.distance(indexPos) < pinchThresholdMobile;
        if(isPinching && script.stabilityFrames) stabilityDelayPinch = script.stabilityFrames;

        if(!wasPinching && isPinching){ // on pinch start
            HandTracking.onPinchStart.callback(cursorPos, false);
        }else if(wasPinching && isPinching){ // on pinch continue
            HandTracking.onPinchHold.callback(cursorPos, false);
        }else if(wasPinching && !isPinching){ // on pinch stop
            if(script.stabilityFrames && stabilityDelayPinch > 0){ // keep pinch alive
                stabilityDelayPinch--;
                return;
            }else{
                stabilityDelayPinch = 0;
                HandTracking.onPinchEnd.callback(cursorPos, false);
            }
        }

        // store prv value for next frame
        wasPinching = isPinching;
    }
}



// Spectacles Interaction Kit
function startSIK(){
    // get module
    var SIK;
    if(script.syncCombined){
        SIK = require("Spectacles Sync Framework/SpectaclesInteractionKit/SIK").SIK;
    }else{
        SIK = require("SpectaclesInteractionKit/SIK").SIK;
    }

    // placeholders
    const leftHand = SIK.HandInputData.getHand("left");
    const rightHand = SIK.HandInputData.getHand("right");
    script.Hands.Left = leftHand;
    script.Hands.Right = rightHand;
    var onHandChange = new Callback();
    var forceStopPinch;

    // events
    var pinchEvent;
    var cursorEvent;


    // begin tracking
    function start(){
        // continuous cursor position
        cursorEvent = script.createEvent("UpdateEvent");
        cursorEvent.bind(updateCursorPosition);

        // pinch check
        pinchEvent = script.createEvent('UpdateEvent');
        pinchEvent.bind(pinchingUpdate);

        // check when hand switches
        activeHandChecker();
        onHandChange.add(function(newHand){ // on hand change:
            // no change (can happen when going from both hands to dominant hand only)
            if(activeHand == newHand) return;

            script.onActiveHandChange.callback(activeHand, newHand);

            // send track change callback
            if(!activeHand && newHand){
                activeHand = newHand;
                script.onTrackStart.callback(false);
            }
            if(activeHand && !newHand){
                activeHand = newHand;
                cursorPos = null;
                cursorFwd = null;
                cursorUp = null;
                isPinching = false;
                script.onTrackEnd.callback(false);
            }

            // start/stop the cursor position check
            cursorEvent.enabled = newHand != null;
            if(!cursorEvent.enabled){
                cursorPos = null;
                cursorFwd = null;
                cursorUp = null;
            }

            // update active hand
            activeHand = newHand;
            activeHandObject = newHand ? SIK.HandInputData.getHand(activeHand) : null;
        
            // start or stop pinch detection update depending on if hand is tracking
            pinchEvent.enabled = newHand;
            if(!pinchEvent.enabled) isPinching = false;
        });
    }
    script.createEvent("OnStartEvent").bind(start);


    // keep track of which hand is 'most active' (left, right, or dominant)
    var leftTracking;
    var rightTracking;

    // on tracking change
    var updateTracking = function(){
        // if currently pinching, stop (don't want the pinch to fly from non-dominant hand to dominant hand)
        if(isPinching) forceStopPinch = true;

        if(rightTracking && leftTracking){ // if both hands are visible, use hand closest to center of screen
            onHandChange.callback(dominantHand);
        }else if(rightTracking){
            onHandChange.callback('right');
        }else if(leftTracking){
            onHandChange.callback('left');
        }else{ // no hands are tracked
            onHandChange.callback(null);
        }
    }

    function activeHandChecker(){
        // keep track and bind event
        leftHand.onHandFound.add(function(){
            leftTracking = true;
            updateTracking();
        });
        leftHand.onHandLost.add(function(){
            leftTracking = false;
            updateTracking();
        });
        rightHand.onHandFound.add(function(){
            rightTracking = true;
            updateTracking();
        });
        rightHand.onHandLost.add(function(){
            rightTracking = false;
            updateTracking();
        });
    }


    // dominant hand finder
    const center = new vec2(.5, .5);
    function setCenteredDominantHand(){
        if(rightTracking && leftTracking){ // get dominant hand based on distance to screen center if both-handed
            var prvDominantHand = dominantHand;
            const leftDist = SIK.HandInputData.getHand('left').thumbTip.screenPosition.distance(center);
            const rightDist = SIK.HandInputData.getHand('right').thumbTip.screenPosition.distance(center);
            if(leftDist < rightDist){
                dominantHand = 'left';
            }else{
                dominantHand = 'right';
            }

            // update if changed because of center-screen distance
            if(prvDominantHand != dominantHand) updateTracking();
        
        }else{ // get dominant hand from SIK if one-handed
            dominantHand = SIK.HandInputData.getDominantHand() == leftHand ? 'left' : 'right';
        }
    }

    
    // cursor position
    function updateCursorPosition(){
        if(!activeHandObject) return;

        // get hand positions
        thumbPos = activeHandObject.thumbTip.position;
        indexPos = activeHandObject.indexTip.position;
        cursorPos = vec3.lerp(thumbPos, indexPos, .5); // get center between fingers
        cursorFwd = activeHandObject.indexTip.forward;
        cursorUp = activeHandObject.indexTip.up;

        // update dominant hand
        setCenteredDominantHand();
    }


    // pinch detection
    var wasPinching;
    function pinchingUpdate(){
        if(SIKPinchDetectManually ? (!thumbPos || !indexPos) : !activeHandObject) return;

        // force pinch stop on this frame
        if(forceStopPinch){
            forceStopPinch = false;
            HandTracking.onPinchEnd.callback(cursorPos, false);
            isPinching = false;
            wasPinching = false;
            return;
        }

        if(!leftTracking && !rightTracking) return;

        // check if pinching
        isPinching = SIKPinchDetectManually ? thumbPos.distance(indexPos) < pinchThresholdSIK : activeHandObject.isPinching();

        if(!wasPinching && isPinching){ // on pinch start
            HandTracking.onPinchStart.callback(cursorPos, false);
        }else if(wasPinching && isPinching){ // on pinch continue
            HandTracking.onPinchHold.callback(cursorPos, false);
        }else if(wasPinching && !isPinching){ // on pinch stop
            HandTracking.onPinchEnd.callback(cursorPos, false);
        }

        // store prv value for next frame
        wasPinching = isPinching;
    }
}
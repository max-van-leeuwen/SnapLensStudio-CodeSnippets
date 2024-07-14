// Max van Leeuwen
//  @maksvanleeuwen
//  links.maxvanleeuwen.com

// Hand Tracking



// global
global.HandTracking = script;

// callbacks
script.onPinchStart = new Callback(); // pos, isTap
script.onPinchHold = new Callback(); // pos, isTap
script.onPinchEnd = new Callback(); // pos, isTap
script.onTrackStart = new Callback(); // isTap
script.onTrackEnd = new Callback(); // isTap
script.onActiveHandChange = new Callback(); // prvHand, curHand

// functions
script.getActiveHand = () => activeHand; // hand
script.getDominantHand = () => dominantHand; // hand
script.getPinching = () => isPinching; // bool
script.getPinchPosition = () => cursorPos; // pos



// UI
//@ui {"widget":"label"}
//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"<big><b>Hand Tracking 👐</b> <small>by Max van Leeuwen"}
//@ui {"widget":"label", "label":"Some handy interaction helpers! With tap emulation."}
//@ui {"widget":"separator"}

//@ui {"widget":"label"}
//@ui {"widget":"group_start", "label":"<b>Usage"}
    //@ui {"widget":"label", "label":"<small>callbacks - bind using <font color='#56b1fc'><i>.add(</font><i>f<font color='#56b1fc'>)</i></font> and <font color='#56b1fc'><i>.remove(</font><i>f<font color='#56b1fc'>)</i></font>"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onPinchStart</font> <small>→ (<font color='#f5e3d5'>Pos</font>, <font color='#f5e3d5'>isTap</font>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onPinchHold</font> <small>→ (<font color='#f5e3d5'>Pos</font>, <font color='#f5e3d5'>isTap</font>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onPinchEnd</font> <small>→ (<font color='#f5e3d5'>Pos</font>, <font color='#f5e3d5'>isTap</font>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onTrackStart</font> <small>→ (<font color='#f5e3d5'>isTap</font>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onTrackEnd</font> <small>→ (<font color='#f5e3d5'>isTap</font>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onActiveHandChange</font> <small>→ (<font color='#f5e3d5'>prvHand</font>, <font color='#f5e3d5'>curHand</font>)"}

    //@ui {"widget":"label"}
    //@ui {"widget":"label", "label":"<small>tracking info"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getActiveHand()</font> <small>→ <font color='#f5e3d5'>Hand"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getDominantHand()</font> <small>→ <font color='#f5e3d5'>Hand"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getPinching()</font> <small>→ bool"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.getPinchPosition()</font> <small>→ vec3"}
//@ui {"widget":"group_end"}

//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"group_start", "label":"<b>Data Types"}
    //@ui {"widget":"label", "label":" • <font color='#f5e3d5'>Pos</font>: <small> position vec3, world space"}
    //@ui {"widget":"label", "label":" • <font color='#f5e3d5'>isTap</font>: <small> bool if emulated (not Hand Tracking)"}
    //@ui {"widget":"label", "label":" • <font color='#f5e3d5'>Hand</font>: <small> string ('left'|'right')"}
//@ui {"widget":"group_end"}

//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"separator"}
//@ui {"widget":"label"}
//@input bool allowTap {"label":"<b>Tap"}
//@ui {"widget":"group_start", "label":"", "showIf":"allowTap"}
    //@input bool allowTapDelivery {"label":"In Delivery"}
    //@input Component.Camera cam
    //@input float distFromCamera = 100
//@ui {"widget":"group_end", "showIf":"allowTap"}

//@ui {"widget":"label"}
//@input bool allowHandTracking {"label":"<b>Hand Tracking"}
//@ui {"widget":"group_start", "label":"", "showIf":"allowHandTracking"}
    //@input Component.ObjectTracking3D handLeft
    //@input Component.ObjectTracking3D handRight
    //@input int stabilityFrames = 4 {"min":0} // on any track or pinch change, there will be a delay of this many frames to catch some false negatives (set to 0 to disable)
    //@ui {"widget":"label", "label":"<small>amount of frames delay before a track change or pinch end, 0=disable"}
//@ui {"widget":"group_end", "showIf":"allowHandTracking"}
//@ui {"widget":"label"}


// if using Sequence script, override debugging options for delivery
if(global.Sequence && Sequence.delivery){
    if(!script.allowTapDelivery) script.allowTap = false;
}



// params
var dominantHand = 'right'; // dominant hand
const pinchThreshold = 3.3; // thumb & index distance threshold for hand tracking, cm



// placeholders
var activeHand = null; // string 'right' or 'left', or null if none. defaults to dominant hand if tapping
var isPinching = false;
var activeHandObject; // active hand object
var stabilityDelayPinch = 0; // countdowns
var stabilityDelayTrackLeft = 0;
var stabilityDelayTrackRight = 0;

var cursorPos; // most recent average position between thumb and index
var thumbPos;
var indexPos;



function init(){
    if(script.allowTap) startTap();
    if(script.allowHandTracking) startHandTracking();
}
init();



// Tap
function startTap(){
    // overall touch blocking while using touch inputs
    global.touchSystem.touchBlocking = true;

    var screenPos;
    function newPositionFromEvent(eventArgs){
        // get position
        if(eventArgs) screenPos = eventArgs.getTouchPosition(); // if no argument given, recalculate using previous screenPos
        cursorPos = script.cam.screenSpaceToWorldSpace(screenPos, script.distFromCamera);
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


    // events
    var touchStartEvent = script.createEvent("TouchStartEvent");
    var touchMoveEvent = script.createEvent("TouchMoveEvent");
    var touchEndEvent = script.createEvent("TouchEndEvent");
    var pinchUpdateEvent = script.createEvent("UpdateEvent");

    touchStartEvent.bind(touchStart);
    touchMoveEvent.bind(touchMove);
    touchEndEvent.bind(touchEnd);
    pinchUpdateEvent.bind(pinchUpdate);
}



// Hand Tracking
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
                cursorPos = null;
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
            if(thumbPos && indexPos) cursorPos = vec3.lerp(thumbPos, indexPos, .5); // get center between fingers
        }
    }


    // pinch detection
    var wasPinching;
    function pinchingUpdate(){
        // force pinch stop on this frame
        if(forceStopPinch){
            forceStopPinch = false;
            HandTracking.onPinchEnd.callback(cursorPos, false);
            cursorPos = null;
            isPinching = false;
            wasPinching = false;
            stabilityDelayPinch = 0;
            return;
        }

        if(script.stabilityFrames && stabilityDelayPinch > 0) HandTracking.onPinchHold.callback(cursorPos, false);
        
        if(!thumbPos || !indexPos) return;
        if(!leftTracking && !rightTracking) return;

        // check if pinching
        isPinching = thumbPos.distance(indexPos) < pinchThreshold;
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
                cursorPos = null;
            }
        }

        // store prv value for next frame
        wasPinching = isPinching;
    }
}






// (Callback manager from LSQuickScripts 2.27)

// Callback(callback [function]) : Callback object
//	Makes a callback signal that you can bind functions to. Returns an object.
//
//		Example, showing all properties
//
//			function someFunction(arg1, arg2){} 					// a function to be called at a certain time
//
// 			var c = new Callback()									// create instance
//			c.add(someFunction)										// add a function to be called when running this.callback(...args)
// 			c.callback(a, b)										// call all functions (any arguments will be passed on)
//			c.remove(someFunction)									// Remove a callback function (if it was added earlier)
// 			c.getCallbacks()										// get all callback functions
// 			c.onCallbackAdded										// function called when a callback was added (assign to property)
// 			c.onCallbackRemoved										// function called when a callback was removed (assign to property)
function Callback(){
	var self = this;
	var callbacks = [];

	/**
	 * @description add a function to be called when running this.callback(...args)
	 * @param {Function} f the function to be added
	*/
	this.add = function(f){
		callbacks.push(f);
		self.onCallbackAdded(f);
	}

	/**
	 * @description remove a callback function (if it was added earlier)
	 * @param {Function} f the function to be removed
	*/
	this.remove = function(f){
		for(let i = callbacks.length - 1; i >= 0; i--){
			if(callbacks[i] === f){
				callbacks.splice(i, 1);
			}
		}
		self.onCallbackRemoved(f);
	}

	/**
	 * @description call all functions (any arguments will be passed on)
	 * @param {...*} args the arguments to be passed to the callback function
	*/
	this.callback = function(...args){
		for(var i = 0; i < callbacks.length; i++){
			callbacks[i](...args);
		}
	}

	/**
	 * @description get all callback functions
	 * @returns {Array} the current callback functions
	*/
	this.getCallbacks = function(){
		return callbacks;
	}

	/**
	 * @type {function}
	 * @description function called when a callback was added (assign to property)
	 * @param {Function} callbackName - The function that was aded
	*/
	this.onCallbackAdded = function(thisFunction){};

	/**
	 * @type {function}
	 * @description function called when a callback was removed (assign to property)
	 * @param {Function} callbackName - the function that was removed
	*/
	this.onCallbackRemoved = function(thisFunction){};
}
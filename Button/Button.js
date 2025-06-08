// Max van Leeuwen
//  maxvanleeuwen.com



// Requires LSQuickScripts 2.35
if(!global.lsqs) throw("LSQuickScripts is missing! Install it from the Asset Library (or from maxvanleeuwen.com/lsquickscripts)");



// access
script.emulatePress = () => tapButtonPress(true);
script.onPress = new Callback(); // args: bool (if is emulation)
script.onRelease = new Callback(); // args: bool (if is emulation)
script.onHighlight = new Callback(); // args: bool (true if highlight started, false if it ended)
script.showAnim = new Callback(); // args: number (animation value 0-1)
script.pressAnim = new Callback(); // args: number (animation value 0-1)
script.counterValueAnim = new Callback(); // args: number (animation value 0-1)
script.counterShowAnim = new Callback(); // args: number (animation value 0-1)
script.highlightAnim = new Callback(); // args: number (animation value 0-1)
script.getShowAnim = () => showAnim; // gets the AnimateProperty object for the show animation
script.getPressAnim = () => pressAnim; // gets the AnimateProperty object for the press animation
script.show = show;
script.hide = hide;
script.isShown; // if currently visible, bool (read-only)

// extra properties that could be useful (e.g. when stacking animations)
script.pressScale = 1; // live value of the current press scale multiplier (only changes if button is being pressed/unpressed).
script.highlightScale = 1; // live value of the current highlight scale multiplier (only changes if doScaleOnHighlight is enabled).



//@ui {"widget":"label"}
//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"<big><b>Button 🕹️</b> <small>by Max van Leeuwen"}
//@ui {"widget":"label", "label":"Turn any visual into an interactable button!"}
//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"Requires LSQuickScripts"}
//@ui {"widget":"separator"}

//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"<h1>Events"}
//@ui {"widget":"separator"}
//@ui {"widget":"label"}

//@ui {"widget":"label"}
//@input string behaviorName {"label":"<b>Behavior Name"}
//@ui {"widget":"label", "label":"<small>custom behavior trigger name"}
//@ui {"widget":"label"}

//@ui {"widget":"group_start", "label":"<b>Callbacks"}
	//@ui {"widget":"label", "label":"<small>bind using <font color='#56b1fc'>.add</font> and <font color='#56b1fc'>.remove</font>"}
	//@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onPress</font> <small>→ isEmulated (bool)"}
	//@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onRelease</font> <small>→ isEmulated (bool)"}
	//@ui {"widget":"label", "label":"<small>use <font color='#56b1fc'>.emulatePress()</font> to emulate button press"}
//@ui {"widget":"group_end"}

//@ui {"widget":"label"}
//@input bool disableButton {"label":"<b>Disable Button"}
//@ui {"widget":"label", "label":"<small>or toggle using <font color='#56b1fc'>.disableButton"}

//@ui {"widget":"label"}
//@input bool continuous {"label":"<b>Continuous"}
//@ui {"widget":"label", "label":"<small>press & hold fires each frame"}

//@ui {"widget":"label"}
//@input Asset.AudioTrackAsset pressSound {"label":"<b>Press Sound"}

//@ui {"widget":"label"}
//@input float rankedPriority = 100 {"label":"<b>Ranked Priority"} // priority level for interactions created by this button (only relevant if other action ranking scripts with the same label are used in this project)
//@ui {"widget":"label", "label":"<small>only relevant when overlapping with other interactables"}

//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"<h1>Visibility"}
//@ui {"widget":"separator"}

//@ui {"widget":"label"}
//@input bool hiddenOnStart {"label":"<b>Hidden On Start"}

//@ui {"widget":"label"}
//@ui {"widget":"group_start", "label":"<b>Show or hide"}
	//@ui {"widget":"label", "label":"• <font color='#56b1fc'>script.show()"}
	//@ui {"widget":"label", "label":"• <font color='#56b1fc'>script.hide()"}
	//@ui {"widget":"label", "label":"• <font color='#56b1fc'>script.isShown</font>"}
//@ui {"widget":"group_end"}

//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"<b>Show/Hide Animation"}
//@input vec2 showAnimDurations = {.3, .3} {"label":"Durations (in/out)"}
//@ui {"widget":"label", "label":"<small>bind to <font color='#56b1fc'>script.showAnim</font><small> → value (number, 0-1)"}
//@ui {"widget":"label", "label":"<small>or get the instance: <font color='#56b1fc'>script.getShowAnim</font><small> → AnimateProperty"}

//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"<h1>Press Animation"}
//@ui {"widget":"separator"}
//@ui {"widget":"label"}
//@input vec2 pressAnimDurations = {.15, .25} {"label":"Durations (in/out)"}
//@ui {"widget":"label", "label":"<small>bind to <font color='#56b1fc'>script.pressAnim</font><small> → value (number, 0-1)"}
//@ui {"widget":"label", "label":"<small>or get the instance: <font color='#56b1fc'>script.getPressAnim</font><small> → AnimateProperty"}
//@ui {"widget":"label"}
//@input bool doScaleOnPress = true {"label":"Scale"}
//@input float pressAnimScale = .7 {"showIf":"doScaleOnPress"}
//@ui {"widget":"label"}
//@input bool doVisualParameterOnPress {"label":"Visual Parameter"}
//@input Component.Visual[] pressAnimVisuals {"showIf":"doVisualParameterOnPress"}
//@input string pressParam = pressValue {"showIf":"doVisualParameterOnPress"}

//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"<h1>Interaction types"}
//@ui {"widget":"separator"}
//@ui {"widget":"label"}

//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"<b>Allow Tap"}
//@input bool tapInteraction = true
//@ui {"widget":"group_start", "label":"", "showIf":"tapInteraction"}

	//@input bool tapInDelivery = true {"label":"In Delivery"}
	//@ui {"widget":"label", "label":"<small><i>also allow tap when in Delivery mode"}

	//@ui {"widget":"label"}
	//@input bool preventSlideTap = true
	//@ui {"widget":"label", "label":"<small><i>only allow tap when tap started on button"}

	//@ui {"widget":"label"}
	//@input bool filterByDepth = true
	//@ui {"widget":"label", "label":"<small><i>ignore if other interaction components on top"}

	//@ui {"widget":"label"}
	//@input Component.BaseMeshVisual[] tapMeshVisuals
	//@ui {"widget":"label", "label":"<small><i>additional visuals to consider part of button"}

	//@ui {"widget":"separator", "showIf":"tapInteraction"}
//@ui {"widget":"group_end", "showIf":"tapInteraction"}

//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"<b>Allow 2D Hand Tracking for far away, like try-ons"}
//@input bool handInteraction2D {"label":"Hand Interaction 2D"}
//@ui {"widget":"label", "label":"<font color='orange'>Requires HandTracking", "showIf":"handInteraction2D"}
//@ui {"widget":"group_start", "label":"", "showIf":"handInteraction2D"}
	
	//@ui {"widget":"label"}
	//@input Component.Camera worldCamera
	//@ui {"widget":"label", "label":"<small>used to reproject hand tracking to screenspace"}
	
	//@ui {"widget":"label"}
	//@input float counterTime = 1
	//@ui {"widget":"label", "label":"<small>hand overlap time before triggering button press"}

	//@ui {"widget":"label"}
	//@ui {"widget":"group_start", "label":"<b>Counter animation"}
	//@ui {"widget":"label", "label":"<small>the 'counter' can be any visual, e.g. a radial timer"}
	//@ui {"widget":"label"}
		//@input Component.Visual[] counterVisuals
		//@input string counterValueParam = "counterValue" {"label":"Parameter Name"}
		//@ui {"widget":"label", "label":"<small>or bind to <font color='#56b1fc'>.counterValueAnim</font> <small>→ value (number, 0-1)"}
		
		//@ui {"widget":"label"}
		//@input float counterShowDuration = .4 {"label":"Show Duration"}
		//@input string counterShowParam = "showValue" {"label":"Show Param"}
		//@ui {"widget":"label", "label":"<small>or bind to <font color='#56b1fc'>.counterShowAnim</font> <small>→ value (number, 0-1)"}
	//@ui {"widget":"group_end"}
	
	//@ui {"widget":"separator", "showIf":"handInteraction2D"}
//@ui {"widget":"group_end", "showIf":"handInteraction2D"}

//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"<b>Allow 3D hand pinching"}
//@ui {"widget":"label", "label":"<small>not always recommended - use SpectaclesInteractionKit instead!"}
//@input bool handInteraction3D {"label":"Hand Interaction 3D"}
//@ui {"widget":"label", "label":"<font color='orange'>Requires HandTracking", "showIf":"handInteraction3D"}
//@ui {"widget":"group_start", "label":"", "showIf":"handInteraction3D"}
	//@input string detectionType = "Radius around SceneObject" {"widget":"combobox", "label":"Detection", "values":[{"label":"Radius around SceneObject", "value":"Radius around SceneObject"}, {"label":"RenderMesh BBOX", "value":"RenderMesh BBOX"}]}
	//@input float detectionRadius = 30 {"label":"Radius", "showIf":"detectionType", "showIfValue":"Radius around SceneObject"}
	//@input float detectionMaxRadius = 50 {"label":"Max. Radius", "showIf":"detectionType", "showIfValue":"RenderMesh BBOX"}
	//@input Component.RenderMeshVisual[] detectionRMV {"label":"<small>RenderMesh BBOX list:", "showIf":"detectionType", "showIfValue":"RenderMesh BBOX"}
	//@input bool addHoverDetection {"label":"...and hovering"}
	//@input Component.Camera worldCamera2 {"label":"World Camera", "showIf":"addHoverDetection"}
	//@ui {"widget":"label", "label":"<small>hovering only works in the Preview panel of LS Internal", "showIf":"addHoverDetection"}

	//@ui {"widget":"label"}
	//@ui {"widget":"label"}
	//@input bool doHighlighting = true {"label":"<b>Highlighting"}
	//@ui {"widget":"label", "label":"<small>or toggle using <font color='#56b1fc'>.doHighlighting"}

	//@ui {"widget":"group_start", "label":" ", "showIf":"doHighlighting"}
		//@input vec2 highlightDurations = {.15, .25} {"label":"Durations"}
		//@ui {"widget":"label", "label":"<small>bind to <font color='#56b1fc'>.onHighlight</font> <small>→ highlightStarted (bool)"}

		//@ui {"widget":"label"}
		//@input Asset.AudioTrackAsset highlightSound
		
		//@ui {"widget":"label"}
		//@input bool doScaleOnHighlight = true {"label":"Scale Anim"}
		//@ui {"widget":"label", "label":"<small>or bind to <font color='#56b1fc'>.highlightAnim</font> <small>→ value (number, 0-1)"}
		//@input float highlightAnimScale = 1.4 {"label":"Scale Amount", "showIf":"doScaleOnHighlight"}
	//@ui {"widget":"group_end", "showIf":"doHighlighting"}
	//@ui {"widget":"separator", "showIf":"handInteraction3D"}
//@ui {"widget":"group_end", "showIf":"handInteraction3D"}
//@ui {"widget":"label"}



// debugging resets
if(!global.deviceInfoSystem.isEditor()){ // if not editor
	script.addHoverDetection = false; // disable hover
}

// placeholders
const title = '[Button] ';
var trf; // regular transform on this object
var screenTrf; // screen transform on this object
var interaction; // interaction component
var startScale; // (screen)transform scale (updated on each new interaction)
var startWorldScale; // (Transform only) world scale, updated on end of show animation
var lastTouchEnd = 0; // time comparison for tap-sliding prevention
var emulationPressOutDelay; // when emulating a button press, this delay will press-out animate after the press-in
var isHighlighted3DButton = false; // for 3D hand tracking, a separate flag is needed to keep track of highlight audio plays
var pressSoundPool; // audio pool for press sound (to prevent overlap)

// animations
var showAnim; // show/hide animation
var pressAnim; // touch press animation
var counterShowAnim; // hand interaction counter show animation
var highlightAnim; // button highlight anim

// action priority settings
const rankedLabel = 'interactables'; // the priority pool name (should be same for other interactables)



function init(){
	// prepare SceneObject
	trf = script.getTransform();
	screenTrf = script.getSceneObject().getComponent("Component.ScreenTransform"); // get this button's screen transform
	interaction = script.getSceneObject().getComponent("Component.InteractionComponent"); // get existing interaction component, this prevents touches to go to Snap's UI and it resolves depth sorting
	if(!interaction) interaction = script.getSceneObject().createComponent("Component.InteractionComponent"); // if none exists, add interaction component
	if(!script.filterByDepth) interaction.isFilteredByDepth = false; // set depth filtering
	if(script.tapMeshVisuals){ // add mesh visuals to interaction
		for(var i = 0; i < script.tapMeshVisuals.length; i++){
			interaction.addMeshVisual(script.tapMeshVisuals[i]);
		}
	}
	if(!screenTrf) startWorldScale = trf.getWorldScale(); // initial value
	if(script.pressSound) pressSoundPool = new InstSoundPooled([script.pressSound], 1, .2); // create sound pool to automatically deal with sound overlaps when presses occur too often


	// create press animation
	pressAnim = new AnimateProperty();
	startScale = screenTrf ? screenTrf.scale : trf.getLocalScale(); // initialize transform scale on start
	pressAnim.startFunction = function(){
		// stop highlight, if any
		if(highlightAnim) highlightAnim.stop();

		// play press sound
		if(!pressAnim.getReversed()){
			if(pressSoundPool) pressSoundPool.instance();
		}
	}
	pressAnim.updateFunction = function(v, vLinear){
		script.pressAnim.callback(vLinear); // callback gets linear animation value, so custom easing can be applied by user

		if(script.doScaleOnPress){
			// scaling amount
			script.pressScale = remap(v, 0, 1, 1, script.pressAnimScale);
			const scaleMultiplier = script.highlightScale * script.pressScale;
			const newScale = startScale.uniformScale(scaleMultiplier); // implement additive highlight scale

			// check if screentransform or transform
			if(screenTrf){
				screenTrf.scale = newScale
			}else{
				trf.setLocalScale(newScale);
			}
		}
		if(script.doVisualParameterOnPress){
			if(script.pressAnimVisuals){
				for(let i = 0; i < script.pressAnimVisuals.length; i++){
					script.pressAnimVisuals[i].mainPass[script.pressParam] = v;
				}
			}
		}
	}
	pressAnim.easeFunction = EaseFunctions.Exponential.Out;
	pressAnim.reverseEaseFunction = EaseFunctions.Exponential.In;
	pressAnim.setReversed(true);
	pressAnim.duration = script.pressAnimDurations.x;
	pressAnim.reverseDuration = script.pressAnimDurations.y;


	// create show animation
	showAnim = new AnimateProperty();
	showAnim.startFunction = function(){
		if(highlightAnim && highlightAnim.isPlaying()) highlightAnim.stop(); // stop highlight, if any
		stopEmulationPressOutDelay(); // don't do delayed press-out anim anymore
		script.isShown = !showAnim.getReversed();

		if(!showAnim.getReversed()){ // if in-anim
			if(highlightAnim){ // pulse highlight anim if it exists
				highlightAnim.setReversed(true);
				highlightAnim.pulse(1);
			}
		}
	}
	showAnim.updateFunction = function(v, vLinear){
		script.showAnim.callback(vLinear); // callback gets linear animation value, so custom easing can be applied by user

		const scaleMultiplier = script.pressScale * script.highlightScale * v; // scaling amount
		const newScale = startScale.uniformScale(scaleMultiplier); // implement additive highlight scale

		if(screenTrf){
			screenTrf.scale = newScale;
		}else{
			trf.setLocalScale(newScale);
		}
	}
	showAnim.easeFunction = EaseFunctions.Cubic.Out;
	showAnim.duration = script.showAnimDurations.x;
	showAnim.reverseDuration = script.showAnimDurations.y;
	if(script.hiddenOnStart){
		showAnim.setReversed(true);
		showAnim.pulse(1);
		script.isShown = false;
	}else{
		script.isShown = true;
	}
	showAnim.endFunction = function(){
		const highlightIsPlaying = highlightAnim ? highlightAnim.isPlaying() : false;
		if(!showAnim.getReversed() && !highlightIsPlaying && !pressAnim.isPlaying()) startWorldScale = trf.getWorldScale(); // update starting world scale, assume button is now at 'normal' scale
	}


	// check if tap is allowed
	const isDelivery = global.Sequence && Sequence.delivery;
	const tapAllowed = !isDelivery || (isDelivery && script.tapInDelivery);

	// start different interaction types
	if(script.tapInteraction && tapAllowed) startTapInteractionCheck();
	if(script.handInteraction2D) startHandInteraction2DCheck();
	if(script.handInteraction3D) startHandInteraction3DCheck();
}
init();

function show(instant){
	// resets
	if(highlightAnim){
		highlightAnim.setReversed(false);
		highlightAnim.pulse(0);
	}
	pressAnim.setReversed(true);
	pressAnim.pulse(0);
	isHighlighted3DButton = false;
	script.pressScale = 1;
	script.highlightScale = 1;

	if(instant){
		showAnim.setReversed(false);
		showAnim.pulse(1);
        script.isShown = true;
		return;
	}
	if(showAnim.getReversed()){
		showAnim.setReversed(false);
		showAnim.start();
	}
}

function hide(instant){
	if(highlightAnim) highlightAnim.stop(); // stop any existing highlight animations
	if(instant){
		showAnim.setReversed(true);
		showAnim.pulse(1);
        script.isShown = false;
		return;
	}
	if(!showAnim.getReversed()){
		showAnim.setReversed(true);
		showAnim.start();
	}
}

// can button currently be pressed
function isPressAllowed(){
	const showAnimComplete = !showAnim.getReversed() && !showAnim.isPlaying(); // check if its show in-anim is completed
	return showAnimComplete && !script.disableButton && script.getSceneObject().enabled; // check if button is fully shown, not disabled, and SceneObject is enabled
}

function stopEmulationPressOutDelay(){
	if(emulationPressOutDelay){
		emulationPressOutDelay.stop();
		emulationPressOutDelay = null;
	}
}









// --- interaction types



// tap check
function startTapInteractionCheck(){
	var continuousEvent; // event for firing function on every frame
	var firstContinuousFrame = true;
	
	interaction.onTouchStart.add(function(){
		touchStart();
	});
	interaction.onTouchEnd.add(function(){
		touchEnd();
	});

	if(script.preventSlideTap){
		var touchStartEvent = lsqs.createEvent("TouchStartEvent"); // use LSQuickScript's component (it does not have an Interaction Component), this will catch taps anywhere on the screen
		var touchEndEvent = lsqs.createEvent("TouchEndEvent");
		touchStartEvent.bind(function(){
			lastTouchEnd = null;
		});
		touchEndEvent.bind(function(){
			lastTouchEnd = getTime(); // use a time comparison to prevent unpredictable event orders within the same frame
		});
	}

	// button press for tap
	function tapButtonPress(emulated){
		if(!emulated){ // if not emulated
			if(script.continuous){ // continuous press

				if(continuousEvent){
					continuousEvent.enabled = true;
				}else{
					continuousEvent = script.createEvent("UpdateEvent");
					continuousEvent.bind(function(){
						rankedAction(rankedLabel, script.rankedPriority, function(){ // check with other existing interactions in the scene
							// animation on first frame
							if(firstContinuousFrame){
								firstContinuousFrame = false; // once

								pressAnim.setReversed(false);
								pressAnim.start();
							}
							
							// callbacks on every frame
                            if(script.behaviorName) global.behaviorSystem.sendCustomTrigger(script.behaviorName);
							script.onPress.callback(false);
						})
					});
				}

			}else{ // non-continuous press
				
				rankedAction(rankedLabel, script.rankedPriority, function(){ // check with other existing interactions in the scene
					// animation
					pressAnim.setReversed(false);
					pressAnim.start();
					
                    if(script.behaviorName) global.behaviorSystem.sendCustomTrigger(script.behaviorName);
					script.onPress.callback(emulated);
				});
			}
		
		}else{ // if emulated
			// anim-out afterwards when emulated
			stopEmulationPressOutDelay(); // stop existing delay
			emulationPressOutDelay = new DoDelay(function(){ // start new
				touchEnd(true);
			});
			emulationPressOutDelay.byTime(pressAnim.duration);
		}
	}

	// on touch stay
	function touchStart(){
		if(!isPressAllowed()) return;
		if(script.preventSlideTap){ // if sliding onto the button instead of tapping
			if(lastTouchEnd == null || getTime() == lastTouchEnd) return;
		}
		tapButtonPress();
	}

	// on touch end
	function touchEnd(emulated){
		if(!emulated){ // if not emulating a button press
			if(continuousEvent){
				continuousEvent.enabled = false;
				firstContinuousFrame = true;
			}
		}

		// pressAnim out
		if(pressAnim.getReversed()) return; // only if not already out
		if(!showAnim.getReversed() && !showAnim.isPlaying()){ // do release animation if the button hasn't started its out-anim inbetween
			pressAnim.setReversed(true);
			pressAnim.pulse(0);
			pressAnim.start();
		}

		// touch end
		script.onRelease.callback(!!emulated);
	}
}









// 2D hands check
function startHandInteraction2DCheck(){
	// Requires Hand Tracking if using 3D pinch buttons
	if(!global.HandTracking) throw("HandTracking is missing! Install it from https://github.com/max-van-leeuwen/SnapLensStudio-CodeSnippets/tree/main/Hand%20Tracking%20Setup");

	// only relevant for ScreenTransforms
	if(!screenTrf) throw(title + 'Hand Interaction 2D requires a ScreenTransform component on the button!');


	// placeholders
	var counter = 0;
	var wasInLeft; // hand in left area
	var wasInRight;
	var preventInteraction; // only allow next interaction after this one is done


	// create counter anim
	counterShowAnim = new AnimateProperty(function(v, vLinear){
		// user callback
		script.counterShowAnim.callback(vLinear);

		// visuals
		if(script.counterVisuals){
			for(let i = 0; i < script.counterVisuals.length; i++){
				script.counterVisuals[i].mainPass[script.counterShowParam] = v;
			}
		}
	});
	counterShowAnim.easeFunction = EaseFunctions.Cubic.Out;
	counterShowAnim.reverseEaseFunction = EaseFunctions.Cubic.In;
	counterShowAnim.duration = script.counterShowDuration;

	var v = new VisualizePoints();
	function checkHandInteraction(){
		var isInLeft;
		var isInRight;

		// left
        var lPos = HandTracking.handLeft.getTransform().getWorldPosition();
        lPos = lPos.add(HandTracking.handLeft.getTransform().right.uniformScale(5));
        const lPos2D = script.worldCamera.worldSpaceToScreenSpace(lPos);
        isInLeft = screenTrf.containsScreenPoint(lPos2D);
		if(isInLeft && !wasInLeft){
			if(counterShowAnim){
				counterShowAnim.setReversed(false);
				counterShowAnim.start();
			}
		}else if(!isInLeft && wasInLeft){
			if(counterShowAnim && !counterShowAnim.getReversed()){
				counterShowAnim.setReversed(true);
				counterShowAnim.start();
			}
		}

		// right
        var rPos = HandTracking.handRight.getTransform().getWorldPosition();
        rPos = rPos.add(HandTracking.handRight.getTransform().right.uniformScale(-5));
        const rPos2D = script.worldCamera.worldSpaceToScreenSpace(rPos);
        isInRight = screenTrf.containsScreenPoint(rPos2D);
		if(isInRight && !wasInRight){
			if(counterShowAnim){
				counterShowAnim.setReversed(false);
				counterShowAnim.start();
			}
		}else if(!isInRight && wasInRight){
			if(counterShowAnim && !counterShowAnim.getReversed()){
				counterShowAnim.setReversed(true);
				counterShowAnim.start();
			}
		}

		// check if allowed
		if(!isPressAllowed()){
			isInLeft = false;
			isInRight = false;
		}

		// update for next frame
		wasInLeft = isInLeft;
		wasInRight = isInRight;
        
		// counter
		if(isInLeft || isInRight){
			if(!preventInteraction) counter += getDeltaTime() / script.counterTime;
		}else{
			counter -= getDeltaTime() / script.counterTime;
			preventInteraction = false;
		}

		if(preventInteraction){
            if(script.counterVisuals){ // visuals
                for(let i = 0; i < script.counterVisuals.length; i++){
                    script.counterVisuals[i].mainPass[script.counterValueParam] = 0;
                }
            }
            return;
        }

		// apply
		counter = clamp(counter);
		script.counterValueAnim.callback(counter); // user callback
		if(script.counterVisuals){ // visuals
			for(let i = 0; i < script.counterVisuals.length; i++){
				script.counterVisuals[i].mainPass[script.counterValueParam] = counter;
			}
		}

		// if counter is full, emulate button press
		if(counter >= 1){
			rankedAction(rankedLabel, script.rankedPriority, function(){ // check with other existing interactions in the scene
                if(script.behaviorName) global.behaviorSystem.sendCustomTrigger(script.behaviorName);
				script.onPress.callback(false); // no continuous press option for 2D Hand interaction
				
				pressAnim.setReversed(true);
				pressAnim.start();
	
				// prevent instant new interaction
				preventInteraction = true;
				counter = 0;
			});
		}
	}
	var handInteraction2DEvent = script.createEvent("UpdateEvent");
	handInteraction2DEvent.bind(checkHandInteraction);
}









// 3D hands check
function startHandInteraction3DCheck(){
	// Requires Hand Tracking if using 3D pinch buttons
	if(!global.HandTracking) throw("Hand Tracking is missing! Install it from https://github.com/max-van-leeuwen/SnapLensStudio-CodeSnippets/tree/main/Hand%20Tracking%20Setup");

	// only relevant for non-ScreenTransforms
	if(screenTrf) throw(title + 'Hand Interaction 3D only works for buttons with no ScreenTransform component!');


	// scaling a vec3 around a pivot
	function scaleVec3Pivot(point, pivot, scale){
		return new vec3(
			(point.x - pivot.x) * scale.x + pivot.x,
			(point.y - pivot.y) * scale.y + pivot.y,
			(point.z - pivot.z) * scale.z + pivot.z
		);
	}


	// convert a sphere's radius in world space to screen space
	function radiusToScreenRadius(sphereRadius, spherePosition, cam){
		const fovRadians = cam.fov;
		const cameraPosition = cam.getTransform().getWorldPosition();
		const dist = spherePosition.distance(cameraPosition);
		const screenHeightInWorldSpace = 2 * dist * Math.tan(fovRadians/2); // screen height (world space) at sphere distance
		return sphereRadius / screenHeightInWorldSpace;
	}


	// check if a screen position is within a world bbox
	// this is a bit heavy, especially if there are many rmvs present, but keep in mind that this is only used for in-editor hovering (debugging/ease-of-use purposes)
	function isScreenPosInBBOX(screenPos, aabbMin, aabbMax, cam){
		if(!cam.isSphereVisible(aabbMin, 1) && !cam.isSphereVisible(aabbMax, 1)) return; // prevent false positives on opposite side

		// get all corners
		const corners = [
			aabbMin,
			new vec3(aabbMax.x, aabbMin.y, aabbMin.z),
			new vec3(aabbMin.x, aabbMax.y, aabbMin.z),
			new vec3(aabbMin.x, aabbMin.y, aabbMax.z),
			new vec3(aabbMax.x, aabbMax.y, aabbMin.z),
			new vec3(aabbMin.x, aabbMax.y, aabbMax.z),
			new vec3(aabbMax.x, aabbMin.y, aabbMax.z),
			aabbMax
		];
	  
		// screen space corners
		const screenCorners = [];
		for(let i = 0; i < corners.length; i++){
			screenCorners.push(cam.worldSpaceToScreenSpace(corners[i]));
		}

		// get farthest corners
		var screenMin = {x:Infinity, y:Infinity};
		var screenMax = {x:-Infinity, y:-Infinity};
		for(let i = 0; i < screenCorners.length; i++){
			const screenCorner = screenCorners[i];
			screenMin.x = Math.min(screenMin.x, screenCorner.x);
			screenMin.y = Math.min(screenMin.y, screenCorner.y);
			screenMax.x = Math.max(screenMax.x, screenCorner.x);
			screenMax.y = Math.max(screenMax.y, screenCorner.y);
		}

		// screen space check
		return (
			screenPos.x > screenMin.x &&
			screenPos.x < screenMax.x &&
			screenPos.y > screenMin.y &&
			screenPos.y < screenMax.y
		);
	}
	

	// returns true if p is within button bounds
	function isInButton(p){
		if(!p) return false;

		// button center
		const buttonPos = trf.getWorldPosition();


		// cursor-in-button detection types:
		if(script.detectionType == "Radius around SceneObject"){
			const radius3D = p.distance(buttonPos) < script.detectionRadius; // radius around button center
			if(radius3D) return true;

			// if not in 3D radius, check hovering
			const p2D = HandTracking.getHoverScreenPosition();
			if(script.addHoverDetection && p2D){ // if hover available
				if(script.worldCamera2.isSphereVisible(buttonPos, 1)){ // only allow if button is currently being rendered (as screen space rays give false positives in opposite direction as well)
					const buttonScreenPos = script.worldCamera2.worldSpaceToScreenSpace(buttonPos);
					const screenRadius = radiusToScreenRadius(script.detectionRadius, buttonPos, script.worldCamera2);
					if(p2D.distance(buttonScreenPos) < screenRadius) return true;
				}
			}

		}else if(script.detectionType == "RenderMesh BBOX"){
			// if hovering should be tried as well, don't skip when max radius is exceeded
			const tryHovering = script.addHoverDetection && HandTracking.getHoverScreenPosition();
			const withinMaxRadius = p.distance(buttonPos) < script.detectionMaxRadius;

			const bbox = []; // store bounding box in case of hovering
			if(tryHovering || withinMaxRadius){ // only check if within maximum search radius
				// button size for bbox compensation when animated
				const crrScale = trf.getWorldScale();

				// check each highlight rmv
				for(var i = 0; i < script.detectionRMV.length; i++){
					// check bbox of each given highlight rmv
					var aabbMin = script.detectionRMV[i].worldAabbMin();
					var aabbMax = script.detectionRMV[i].worldAabbMax();
					
					// scale bbox points
					const multiplier = startWorldScale.div(crrScale);
					aabbMin = scaleVec3Pivot(aabbMin, buttonPos, multiplier);
					aabbMax = scaleVec3Pivot(aabbMax, buttonPos, multiplier);
					bbox.push({aabbMin, aabbMax});

					// check if point is in box
					const isInBBox = (p.x >= aabbMin.x && p.x <= aabbMax.x) &&
									 (p.y >= aabbMin.y && p.y <= aabbMax.y) &&
									 (p.z >= aabbMin.z && p.z <= aabbMax.z);
					if(isInBBox) return true;
				}
			}

			// check hovering
			if(tryHovering){
				const p2D = HandTracking.getHoverScreenPosition();
				for(var i = 0; i < bbox.length; i++){
					const isInBBOX = isScreenPosInBBOX(p2D, bbox[i].aabbMin, bbox[i].aabbMax, script.worldCamera2);
					if(isInBBOX) return true;
				}
			}
		}

		// no hits
		return false;
	}


	if(script.doHighlighting){
		// create highlight animation
		highlightAnim = new AnimateProperty(function(v, vLinear){
			// user callback
			script.highlightAnim.callback(vLinear);
	
			// scale (if enabled)
			if(script.doScaleOnHighlight){
				const scaleMultiplier = remap(v, 0, 1, 1, script.highlightAnimScale);
				script.highlightScale = scaleMultiplier; // make public for other animations to use
				trf.setLocalScale(startScale.uniformScale(scaleMultiplier));
			}
		});
		highlightAnim.startFunction = function(){
			script.onHighlight.callback(!highlightAnim.getReversed()); // user callback
		}
		highlightAnim.duration = script.highlightDurations.x;
		highlightAnim.reverseDuration = script.highlightDurations.y;
		highlightAnim.easeFunction = EaseFunctions.Cubic.Out;
		highlightAnim.easeFunction = EaseFunctions.Cubic.InOut;
		highlightAnim.setReversed(true);
	}


	var highlightSoundPool = script.highlightSound ? new InstSoundPooled([script.highlightSound], 1, .2) : null; // create sound pool to automatically deal with sound overlaps when highlights occur too often 
	function highlight(){
		if(!isHighlighted3DButton){
			if(highlightSoundPool && !highlightAnim.isPlaying()) highlightSoundPool.instance(); // play highlight sound
	
			if(highlightAnim && script.doHighlighting){
				highlightAnim.setReversed(false);
				highlightAnim.start();
			}
		}

		isHighlighted3DButton = true;
	}
	
	function unHighlight(){
		if(isHighlighted3DButton){
			if(highlightAnim && script.doHighlighting){
				highlightAnim.setReversed(true);
				highlightAnim.start();
			}
		}

		isHighlighted3DButton = false;
	}


	function press(){
		if(pressAnim.getReversed()){
			pressAnim.setReversed(false);
			pressAnim.start();
		}
	}

	function unPress(){
		// pressAnim out
		if(pressAnim.getReversed()) return; // only if not already out
		pressAnim.setReversed(true);
		pressAnim.pulse(0);
		pressAnim.start();

		// touch end
		script.onRelease.callback();
	}

	function call(){
        if(script.behaviorName) global.behaviorSystem.sendCustomTrigger(script.behaviorName);
		script.onPress.callback(false);
	}


	// placeholders
	var prvCursorInButton = false;
	var prvPinchInButton = false;


	// continuous distance check for highlight anim and continuous press
	var handInteraction3DEvent = script.createEvent("UpdateEvent");
	handInteraction3DEvent.bind(function(){
		// get cursor position
		const cursorPos = HandTracking.getPinchPosition() || HandTracking.getHoverWorldPosition();

		// check if button is enabled and if cursor position is valid
		if(!isPressAllowed() || !cursorPos){
			prvCursorInButton = false;
			return;
		}

		// if cursor is in button
		const cursorInButton = isInButton(cursorPos);
		if(!prvCursorInButton && cursorInButton){ // first frame of highlight
			highlight();
		}else if(prvCursorInButton && !cursorInButton){ // first frame of un-highlight
			unHighlight();
		}

		// pinch check
		const pinchInButton = cursorInButton && HandTracking.getPinching(); // if pinching in button
		if(pinchInButton && !prvPinchInButton && prvCursorInButton){ // first frame of pinching in button (but cursor has to have been in button already)
			rankedAction(rankedLabel, script.rankedPriority, function(){ // check with other existing interactions in the scene
				press();
				call();
			});
		}else if(!pinchInButton && prvPinchInButton){ // first frame of no pinch, but cursor is in button
			unPress();
		}else if(pinchInButton && script.continuous){ // continuous pinch
			rankedAction(rankedLabel, script.rankedPriority, call); // if continuous, check with other existing interactions in the scene
		}
		prvCursorInButton = cursorInButton;
		prvPinchInButton = pinchInButton;
	});
}
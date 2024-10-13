// Max van Leeuwen
//  maxvanleeuwen.com



// Example:
// Creating a menu, adding 3 buttons in the main ring, and 1 sub-button under 'button1'
//
//      var menu = new SpectaclesRadialMenu.Create();                                               // Radial instance
//      var button1 = menu.addButton(script.button1, "button1");                                    // 1st button on main radial
//      var button2 = menu.addButton(script.button2, "button2");                                    // 2nd button on main radial
//      var button3 = menu.addButton(script.button3, "button3");                                    // 3rd button on main radial
//      var subButton1 = menu.addSubButton("button1", script.button1SubVisual1, "button1sub");      // Sub-button under button1
//
// Bind a callback to button1:
//
//      button1.onPress.add(function(){
//          print('button 1 pressed!')    
//      })
//
// Bind a callback to button1, but this time to 'onPressAndClosed' - this is called when the button is pressed and the menu has fully closed:
//
//      button1.onPressAndClosed.add(function(){
//          print('button 1 pressed, and menu fully closed!')
//      })
//  
// Interacting with the menu, by using some hand tracking setup (called 'HandTracking' here) that has start/move/end events for finger-pinching detection 🤏
// The radial needs to receive the following events:
//  - onPinchStart(pinchPos, headPos)
//  - onPinchHold(pinchPos)
//  - onPinchEnd()
//
//      HandTracking.onPinchStart.add(function(pinchPos){
//          menu.onPinchStart(pinchPos);
//      });
//      HandTracking.onPinchHold.add(function(pinchPos){
//          menu.onPinchHold(pinchPos);
//      });
//      HandTracking.onPinchEnd.add(function(){
//          menu.onPinchEnd();
//      });
//
//
//
// Some optional customization properties and their defaults:
//
//      menu.radius = 6                                     Radial radius (world units). Default is 6cm.
//      menu.subRadius = 12                                 Radial radius (world units) of sub-buttons ring. Default is 12cm.
//      menu.centerRadius = 2                               Radius inside the ring to unselect any radial buttons (usually around 1/3rd of the menu's radius value feels about right). Default is 2 rad.
//      menu.subOffsetDistance = .12                        Radial offset to evenly space sub-buttons with. Default is 0.12 rad.
//      menu.buttonSize = 3                                 Local button size. Default is 3 (cm if using unit scale visuals).
//      menu.radialRotation = 0                             Offset the radial's rotation (radians 0-2pi, clockwise). Default is 0.
//
// Build the menu when done!
//      menu.build()
//
// To disable the menu (so it won't open when onPinchStart is called), use:
//      menu.disable()
//      menu.enable()
//
//
//
// Some other useful helper functions:
//      menu.isOpen()                                       Returns true if radial is open.
//      menu.isEnabled()                                    Returns true if radial is enabled.
//      menu.getHighlightedButton()                         Get currently highlighted button (or null).
//      menu.getAllButtons()                                Returns list of button objects by name.
//      menu.getRootObject()                                Returns the root SceneObject (handy for parenting extra visuals to the radial).
//      menu.openCloseAnim                                  AnimateProperty instance called when opening/closing the radial.   
//      menu.onNoneHighlighted                              Callback: on all buttons unhighlighted.
//
//
//
// To disable a specific button, use its 'isEnabled' property:
//      button.isEnabled = false
//
// Button objects return a bunch of data that you can use, here are the most important ones:
//      .buttonName (string)
//      .sceneObject (button SceneObject)
//      .subOffsetDistance (float, distance in radians between sub-buttons)
//      .highlightAnim (AnimateProperty instance with default scale animation, played when highlighting/unhighlighting)
//      .pressAnim (AnimateProperty instance with default scale animation, played when pressing/releasing)
//      .isEnabled (bool, button is not highlighted or pressed when false)
//      .onPress (callback: on button press)
//      .onPressAndClosed (callback: on button press, after menu is closed)
//      .onHighlight (callback: on highlight)
//      .onUnHighlight (callback: on unhighlight)
//
// Animations can be customized on buttons, too:
//      .highlightAnim                                      AnimateProperty instance with default scale animation, played when highlighting/unhighlighting
//      .pressAnim                                          AnimateProperty instance with default scale animation, played when pressing/releasing
//      .subShowAnim                                        (Sub-buttons only) AnimateProperty instance with default scale animation, played when showing/hiding this sub-button
//
// Here's an example of how to change the default highlight scaling animation to one that fades in:
//      button.highlightAnim.updateFunction = function(v){
//          button.sceneObject.getComponent("Component.Visual").mainPass.baseColor = new vec4(1, 1, 1, v); // white, with alpha 'v'
//      }
//
// The following animations can be found all the way at the end of this script, you can copy&paste these constructors into your own script and override them:
//      createHighlightAnim()                               Creates the highlight scale in/out animation
//      createPressAnim()                                   Creates the press/release animation
//      createSubShowAnim()                                 Creates the sub-buttons show/hide animation









// Requires LSQuickScripts 2.31
if(!global.lsqs) throw("LSQuickScripts is missing! Install it from maxvanleeuwen.com/lsquickscripts");

// access
global.SpectaclesRadialMenu = script;
script.Create = Create;



//@ui {"widget":"label"}
//@ui {"widget":"separator"}
//@ui {"widget":"label", "label":"<big><b>Spectacles Radial Menu 🕶️</b> <small>by Max van Leeuwen"}
//@ui {"widget":"label", "label":"Easily create radial menus!"}
//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"Requires LSQuickScripts"}
//@ui {"widget":"separator"}

//@ui {"widget":"label"}
//@ui {"widget":"group_start", "label":"<b>Initial Setup"}
    //@ui {"widget":"label", "label":"Use <font color='#56b1fc'>new SpectaclesRadialMenu.Create()"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.addButton(</font><font color='#f5e3d5'>obj</font>, <font color='#f5e3d5'>name</font><font color='#56b1fc'>)</font> → returns button"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.addSubButton(</font><font color='#f5e3d5'>mainName</font>, <font color='#f5e3d5'>obj</font>, <font color='#f5e3d5'>name</font><font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.build()"}
    //@ui {"widget":"label"}
    //@ui {"widget":"label", "label":"<small><font color='#f5e3d5'>obj</font>: Your button (SceneObject)"}
    //@ui {"widget":"label", "label":"<small><font color='#f5e3d5'>name</font>: Unique button name (string)"}
    //@ui {"widget":"label", "label":"<small><font color='#f5e3d5'>mainName</font>: Parent button's name"}
    //@ui {"widget":"label", "label":"<small><font color='#f5e3d5'>button</font>: Object"}
//@ui {"widget":"group_end"}

//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"group_start", "label":"<b>Callbacks"}
    //@ui {"widget":"label", "label":"<small>Bind using <font color='#56b1fc'><i>.add</i></font> and <font color='#56b1fc'><i>.remove</i></font>"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onPinchStart(</font><font color='#f5e3d5'>pos<font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onPinchHold(</font><font color='#f5e3d5'>pos<font color='#56b1fc'>)"}
    //@ui {"widget":"label", "label":"• <font color='#56b1fc'>.onPinchEnd()"}
//@ui {"widget":"group_end"}

//@ui {"widget":"label"}
//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"<b>See the top of this script for more info!"}
//@ui {"widget":"label"}

//@ui {"widget":"label"}
//@ui {"widget":"separator"}
//@ui {"widget":"label"}
//@input Component.Camera worldCamera
//@ui {"widget":"label"}




function Create(){
    var self = this;

    /**
     * @description Radial radius (world units). Default is 6cm.
    */
    this.radius = 6;

    /**
     * @description Radial radius (world units) of sub-buttons ring. Default is 12cm.
    */
    this.subRadius = 12;

    /**
     * @description Radius inside the ring to unselect any radial buttons (usually around 1/3rd of the menu's radius value feels about right). Default is 2 rad.
    */
    this.centerRadius = 2;

    /**
     * @description Radial offset to evenly space sub-buttons with. Default is 0.12 rad.
     * Tip: You can set a custom per-button subOffsetDistance when using addButton()!
    */
    this.subOffsetDistance = .12;

    /**
     * @description Local button size. Default is 3 (cm if using unit scale visuals).
    */
    this.buttonSize = 3;

    /**
     * @description Offset the radial's rotation (radians 0-2pi, clockwise). Default is 0.
    */
    this.radialRotation = 0;

    /**
     * @description Flip button visuals. Default is false.
    */
    this.flipped = false;

    /**
	 * @description Add a button to this radial.
     * Arguments:
     *      sceneObject (SceneObject, button visual)
     *      buttonName (string, unique button name)
     *      subOffsetDistance (OPTIONAL, sub-buttons under this main button will be evenly spaced by this amount)
     * 
     * Returns button object, containing:
     *      buttonName (string)
     *      sceneObject (button SceneObject)
     *      subOffsetDistance (float, distance in radians between sub-buttons)
     *      buttonTrf (Transform component on sceneObject)
     *      highlightAnim (AnimateProperty instance with default scale animation, played when highlighting/unhighlighting)
     *      pressAnim (AnimateProperty instance with default scale animation, played when pressing/releasing)
     *      canvasPos (vec2 position on menu canvas, build required)
     *      canvasAngle (radians, the angle of this button on the radial, build required)
     *      subRingRange (radians, the maximum search angle for sub-button interactions, build required)
     *      isEnabled (bool, button is not highlighted or pressed when false)
     *      doPressAnimation (bool, enabled once press callbacks are added)
     *      onPress (callback: on button press)
     *      onPressAndClosed (callback: on button press, after menu is closed)
     *      onHighlight (callback: on highlight)
     *      onUnHighlight (callback: on unhighlight)
    */
    this.addButton = addButton;

    /**
	 * @description Add a sub-button to this radial.
     * Arguments:
     *      mainButtonName (string, name of button on main ring to parent this button to)
     *      sceneObject (SceneObject, button visual)
     *      buttonName (string, unique button name)
     * 
     * Returns button object, containing:
     *      buttonName (string)
     *      sceneObject (button SceneObject)
     *      buttonTrf (Transform component on sceneObject)
     *      subShowAnim (AnimateProperty instance with default scale animation, played when showing/hiding this sub-button)
     *      highlightAnim (AnimateProperty instance with default scale animation, played when highlighting/unhighlighting)
     *      pressAnim (AnimateProperty instance with default scale animation, played when pressing/releasing)
     *      mainButtonName (string, name of parent button)
     *      canvasPos (vec2 position on menu canvas, build required)
     *      canvasAngle (radians, the angle of this button on the radial, build required)
     *      isEnabled (bool, button is not highlighted or pressed when false)
     *      doPressAnimation (bool, true by default for sub buttons)
     *      onPress (callback: on button press)
     *      onPressAndClosed (callback: on button press, after menu is closed)
     *      onHighlight (callback: on highlight)
     *      onUnHighlight (callback: on unhighlight)
    */
    this.addSubButton = addSubButton;

    /**
	 * @description Open the radial. 
     * Arguments:
     *      vec3 (pinch world position, where radial will be placed) 
    */
    this.onPinchStart = onPinchStart;

    /**
	 * @description While pinching, update the pinch position on every frame.
     *      vec3 (pinch world position) */
    this.onPinchHold = onPinchHold;

    /**
	 * @description Close the radial when pinching stops.
    */
    this.onPinchEnd = () => onPinchEnd(false);

    /**
	 * @description AnimateProperty instance called when opening/closing the radial.
     * The root sceneobject is scaled from 0 to 1, and it is enabled or disabled in the .startFunction() and .endFunction().
     * To modify this animation, see LSQuickScripts for more information on the AnimateProperty class!
    */
    this.openCloseAnim;

    /**
	 * @description Callback: on all buttons unhighlighted.
    */
    this.onNoneHighlighted = new Callback();

    /**
	 * @description Returns true if radial is open.
    */
    this.isOpen = () => isOpen;

    /**
	 * @description Get currently highlighted button (or null).
    */
    this.getHighlightedButton = () => highlightedButton;

    /**
	 * @description Important! Build the radial (call this after all buttons and customizations have been added).
    */
    this.build = buildMenu;

    /**
	 * @description Close the radial if open (without calling any callbacks), and don't allow it to be opened again until enable() is called.
    */
    this.disable = disable;

    /**
	 * @description Allow the radial to be opened, if disable() was called earlier.
    */
    this.enable = enable;

    /**
	 * @description Returns true if radial is enabled.
    */
    this.isEnabled = () => isEnabled;

    /**
	 * @description Returns list of button objects by name.
    */
    this.getAllButtons = getAllButtons;

    /**
	 * @description Returns the root SceneObject (handy for parenting extra visuals to the radial).
    */
    this.getRootObject = () => root;



    // --- private



    // params
    const subButtonDelayEffect = .1;

    // placeholders
    var root; // menu root sceneobject
    var rootTrf; // transform component on menu root sceneobject
    var isOpen = false; // true if the menu is currently open
    var isEnabled = true; // radial enable()/disable() toggle

    var buttons = {}; // all buttons (by button name)
    var mainButtons = {}; // all main buttons
    var parentedToButtons = {}; // sub buttons in lists, under the name of their parent button for easy lookup

    var highlightedButton;  // currently highlighted button
    var highlightedMainButton; // keeping track of the main button that's still highlighted, while a sub ring is opened
    var lastPickedButton; // store the button that was picked earlier
    var parentOfOpenSubButtons; // highlighted main button on prv frame (to anim-out the sub-buttons)

    var menuPos; // world space position of menu
    var menuFwd; // world space fwd of menu
    var canvasScale; // canvas scale (vec2) to use for planar projection

    var pressAnimDelay; // the DoDelay instance awaiting radial out anim after a button was pressed (press/release anim comes first)
    var awaitingClosedMenu; // delay for onPressAndClosed callback
    var pinchStartDelay; // pinch start delay (1 frame)     // seems a bit odd (and needs some managing to do safely), but this makes it possible to call radial.disable() or onPinchEnd after a pinch start interaction happened on the same frame!
                                                            // this can be mega useful if there are checks done to ensure radial is allowed to open on the frame itself. Or if interaction binding order is wrong way around.



    function init(){
        root = global.scene.createSceneObject("radial");
        rootTrf = root.getTransform();

        // create open/close anim, arbitrary durations etc (can all be changed by user at a later time)
        self.openCloseAnim = new AnimateProperty(function(v){
            rootTrf.setLocalScale(vec3.one().uniformScale(v));
        });
        self.openCloseAnim.duration = .2;
        self.openCloseAnim.reverseDuration = .15;
        self.openCloseAnim.easeFunction = EaseFunctions.Cubic.Out;
        self.openCloseAnim.reverseEaseFunction = EaseFunctions.Cubic.InOut;
        self.openCloseAnim.startFunction = function(){
            if(!self.openCloseAnim.getReversed()){ // if showing
                root.enabled = true; // enable on start
            }
        }
        self.openCloseAnim.endFunction = function(){
            if(self.openCloseAnim.getReversed()){ // if hiding
                root.enabled = false; // disable on end
            }
        }
        self.openCloseAnim.setReversed(false);
        self.openCloseAnim.pulse(0); // start hidden
    }
    init();



    function addButton(sceneObject, buttonName, subOffsetDistance){
        if(buttonName in buttons){
            print('Button not added, name already exists on radial: ' + buttonName);
            return;
        }

        // prepare SceneObject
        sceneObject.setParent(root);
        var buttonTrf = sceneObject.getTransform();

        // make animators
        var highlightAnim = createHighlightAnim(buttonTrf, self.buttonSize);
        var pressAnim = createPressAnim(buttonTrf, self.buttonSize);

        // register
        var button = {
            buttonName,
            sceneObject,
            subOffsetDistance : subOffsetDistance || self.subOffsetDistance,
            buttonTrf,
            highlightAnim,
            pressAnim,
            canvasPos : null, // to be filled
            canvasAngle : null, // to be filled
            subRingRange : null, // to be filled
            isEnabled : true,
            doPressAnimation : false, // enabled once press callbacks are added
            onPress : new Callback(),
            onPressAndClosed : new Callback(),
            onHighlight : new Callback(),
            onUnHighlight : new Callback()
        }

        // after all internal onPress callbacks are added, keep track of external callbacks to switch press animation
        button.onPress.onCallbackAdded = function(){
            button.doPressAnimation = true; // enable press animations from here on forward
            button.onPress.onCallbackAdded = function(){}; // stop checking on next callback add
        }

        // register
        buttons[buttonName] = button; // store to full list
        mainButtons[buttonName] = button; // store to main buttons list

        // return
        return button;
    }



    function addSubButton(mainButtonName, sceneObject, buttonName){
        if(buttonName in buttons){
            print('Button not added, name already exists on radial: ' + buttonName);
            return;
        }
        if(!(mainButtonName in buttons)){
            print('Button not added, main button does not exist on radial: ' + mainButtonName);
            return;
        }

        // prepare SceneObject
        sceneObject.setParent(root);
        var buttonTrf = sceneObject.getTransform();

        // make animators
        var subShowAnim = createSubShowAnim(buttonTrf, self.buttonSize);
        var highlightAnim = createHighlightAnim(buttonTrf, self.buttonSize);
        var pressAnim = createPressAnim(buttonTrf, self.buttonSize);

        // register
        var button = {
            buttonName,
            sceneObject,
            buttonTrf,
            subShowAnim,
            highlightAnim,
            pressAnim,
            mainButtonName,
            canvasPos : null, // to be filled
            canvasAngle : null, // to be filled
            isEnabled : true,
            doPressAnimation : true, // true by default for sub buttons
            onPress : new Callback(),
            onPressAndClosed : new Callback(),
            onHighlight : new Callback(),
            onUnHighlight : new Callback()
        }
        buttons[buttonName] = button; // store to full list

        // store in a list under its main button's name for easy lookup later
        if(!parentedToButtons[mainButtonName]) parentedToButtons[mainButtonName] = [];
        parentedToButtons[mainButtonName].push(button);

        // return
        return button;
    }



    function buildMenu(){
        const PI2 = Math.PI * 2;
        const noRotation = self.flipped ? quat.quatIdentity() : quat.angleAxis(Math.PI, vec3.up()); // flipped by default to match viewport front-facing direction

        // rotational offsets for different button counts to always keep the first button in the center
        function getAngleOffset(n){
            if(n == 2) return 0;
            return Math.PI*.5;
        }

        // main ring
        const mainButtonsCount = Object.keys(mainButtons).length;
        const standardAngleOffset = getAngleOffset(mainButtonsCount) + self.radialRotation;
        var i = 0;
        for(let button of Object.values(mainButtons)){
            // reset existing
            button.canvasPos = null;

            // get angle
            const ratio = i/mainButtonsCount;
            const angle = ratio * PI2 + standardAngleOffset;

            // get position
            var localPos = new vec3(
                Math.cos(angle) * self.radius,
                Math.sin(angle) * self.radius,
                0
            );

            // transform
            button.buttonTrf.setLocalPosition(localPos);
            button.buttonTrf.setLocalRotation(noRotation);
            button.buttonTrf.setLocalScale(vec3.one().uniformScale(self.buttonSize));

            // reset anims on start (in case of user-wrapped functions on the updateFunctions)
            button.highlightAnim.pulse(0);
            button.pressAnim.pulse(0);


            // check for sub buttons
            const subButtons = parentedToButtons[button.buttonName];
            if(subButtons){
                // get sub buttons count
                const subButtonsCount = subButtons.length;

                // store total range (radians) for sub button interactions (with 2 buttons overshoot, one on each side)
                button.subRingRange = button.subOffsetDistance * (subButtonsCount + 2);

                // place all sub buttons on a secondary ring, offset to match the main button's position
                for(var j = 0; j < subButtonsCount; j++){
                    var subButton = subButtons[j];
                    
                    // reset existing
                    subButton.canvasPos = null;

                    // get angle
                    const distFromMainButton = subButtonsCount == 1 ? 0 : remap(j/(subButtonsCount-1), 0, 1, -1, 1); // [-1, 1] normalized distance from main button
                    const subRange = button.subOffsetDistance * subButtonsCount; // total width along ring this row of sub buttons is allowed to span
                    const angleOffset = subRange * distFromMainButton; // angle along ring to place buttons at
                    const subAngle = angle + angleOffset;
                    
                    // get position
                    var localPos = new vec3(
                        Math.cos(subAngle) * self.subRadius,
                        Math.sin(subAngle) * self.subRadius,
                        0
                    );

                    // transform
                    subButton.buttonTrf.setLocalPosition(localPos);
                    subButton.buttonTrf.setLocalRotation(noRotation);
                    subButton.buttonTrf.setLocalScale(vec3.one().uniformScale(self.buttonSize));

                    // reset anims on start (in case of user-wrapped functions on the updateFunctions)
                    subButton.highlightAnim.pulse(0);
                    subButton.pressAnim.pulse(0);

                    // show/hide anim pulse on start
                    subButton.subShowAnim.pulse(0);

                    // slightly delay the show/hide animations for a wave-effect
                    subButton.subShowAnim.delay = Math.abs(distFromMainButton) * subButtonDelayEffect;
                    subButton.subShowAnim.reverseDelay = subButton.subShowAnim.delay * .5; // arbitrary faster out-anim, looks nicer
                }
            }

            // main button iterator
            i++;
        }
    }



    function onPinchStart(pinchPos){
        // delay this whole function with 1 frame, see explanation next to var pinchStartDelay
        if(pinchStartDelay) pinchStartDelay.stop();
        pinchStartDelay = new DoDelay(function(){
            pinchStartDelay = null;

            // check if radial is currently enabled
            if(!isEnabled) return;
    
            // await previous radial menu out anim first (if an option was selected)
            if(pressAnimDelay || (lastPickedButton && self.openCloseAnim.isPlaying())) return;
    
            // reset state
            if(lastPickedButton){
                lastPickedButton.highlightAnim.setReversed(false); // reset animations on previously picked button
                lastPickedButton.highlightAnim.pulse(0);
                lastPickedButton.pressAnim.pulse(0); // always forward, no need to set !reversed
                
                // reset animations on sub-buttons
                const subButtons = parentedToButtons[lastPickedButton.mainButtonName] || parentedToButtons[lastPickedButton.buttonName]; // try this button or its main button (this button could be a sub-button)
                if(subButtons){
                    for(var i = 0; i < subButtons.length; i++){
                        var subButton = subButtons[i];
    
                        subButton.highlightAnim.setReversed(false);
                        subButton.highlightAnim.pulse(0);
                        subButton.pressAnim.pulse(0);
                        subButton.subShowAnim.setReversed(false);
                        subButton.subShowAnim.pulse(0);
                    }
                }
            }
            if(highlightedMainButton){
                highlightedMainButton.highlightAnim.setReversed(false); // reset animations on previously highlighted main button
                highlightedMainButton.highlightAnim.pulse(0);
            }
            highlightedButton = null;
            highlightedMainButton = null;
            lastPickedButton = null;
            parentOfOpenSubButtons = null;
    
            // set transforms
            rootTrf.setWorldPosition(pinchPos);
            const lookAtPos = script.worldCamera.getTransform().getWorldPosition();
            var lookAtUserRot = quat.lookAt(pinchPos.sub(lookAtPos), vec3.up());
            rootTrf.setWorldRotation(lookAtUserRot);
            
            // if awaiting a delayed callback still, do it now
            if(awaitingClosedMenu) awaitingClosedMenu.now();
            awaitingClosedMenu = null;
    
            // show
            self.openCloseAnim.setReversed(false);
            self.openCloseAnim.start();
            isOpen = true;
    
            menuPos = pinchPos;
            menuFwd = rootTrf.forward;
            canvasScale = new vec2(self.radius*2, self.radius*2);
        }).byFrame();
    }



    function onPinchHold(pinchPos){
        if(!isOpen || self.openCloseAnim.isPlaying()) return; // radial is not opened right now, ignore 'cursor' movements

        // check if in inner center of ring
        const distFromCenter = pinchPos.distance(rootTrf.getWorldPosition());
        const inInnerCenter = distFromCenter < self.centerRadius;
        if(inInnerCenter){
            newHighlightedButton(null);
            return;
        }

        // check if currently in main ring or in sub ring (purely by distance from the center)
        const isInSubring = distFromCenter > interp(self.radius, self.subRadius, .5);

        // highscores for search
        var closestButton = {
            dist : Infinity,
            button : null,
        }

        // pinch on canvas
        var pinchCanvasPos = projectPointToPlane(pinchPos, menuPos, menuFwd, canvasScale);
        pinchCanvasPos.x = remap(pinchCanvasPos.x, 0, 1, 1, -1); // 1-x and around 0
        pinchCanvasPos.y = remap(pinchCanvasPos.y, 0, 1, -1, 1); // around 0
        const pinchAngle = Math.atan2(pinchCanvasPos.y, pinchCanvasPos.x);

        // search buttons for closest one (2D on canvas)
        for(let button of Object.values(buttons)){
            const isMainButton = !button.mainButtonName;

            // if main button but cursor is in sub-ring, ignore
            if(isMainButton && isInSubring) continue;

            // if sub-button of inactive main, ignore
            if(!isMainButton){
                if(!parentOfOpenSubButtons) continue;
                if(parentOfOpenSubButtons.buttonName != button.mainButtonName) continue;
            }

            // if sub-button of disabled main, ignore
            const mainButton = buttons[button.mainButtonName]; // get main button of this button (if any)
            if(mainButton && !mainButton.isEnabled) continue;

            // set canvas pos and angle (if not done already for this button)
            if(!button.canvasPos){
                const buttonPos = button.buttonTrf.getWorldPosition();
                var canvasPos = projectPointToPlane(buttonPos, menuPos, menuFwd, canvasScale);
                canvasPos.x = remap(canvasPos.x, 0, 1, 1, -1); // 1-x and around 0
                canvasPos.y = remap(canvasPos.y, 0, 1, -1, 1); // around 0
                button.canvasPos = canvasPos;
                button.canvasAngle = Math.atan2(canvasPos.y, canvasPos.x);
            }

            // if in sub-ring but not near any sub-buttons in the currently active main, ignore
            if(!isMainButton && mainButton.subRingRange){ // if this button's main button has a valid subRingRange value
                const angleDiff = circularDistance(pinchAngle, mainButton.canvasAngle, Math.PI*2); // main-to-pinch angle difference, circular
                if(angleDiff > mainButton.subRingRange) continue;
            }

            // check distance
            let newDist = pinchCanvasPos.distance(button.canvasPos);
            if(newDist < closestButton.dist){
                closestButton.dist = newDist;
                closestButton.button = button;
            }
        }
        newHighlightedButton(closestButton.button);
    }



    function unHighlightButton(b){
        b.onUnHighlight.callback(); // trigger unhighlight callback
        var t = b.highlightAnim.getTimeRatio();
        b.highlightAnim.setReversed(true);
        b.highlightAnim.start(1-t);
    }



    function newHighlightedButton(button){
        if(highlightedButton == button){ // if no change (compared to prv highlightedButton)
            if(!button){ // if no button currently highlighted
                if(highlightedMainButton) unHighlightButton(highlightedMainButton); // unhighlight prv main
                parentOfOpenSubButtons = null; // reset
                highlightedMainButton = null;
            }
            return;
        }


        // highlight-out on currently highlighted
        if(highlightedButton){
            
            // keep main button highlighted when its sub is opened
            var skipUnhighlightForThisMain;
            if(parentOfOpenSubButtons){
                if(highlightedButton == parentOfOpenSubButtons){ // on first frame
                    highlightedMainButton = highlightedButton;
                    skipUnhighlightForThisMain = true;
                    highlightedButton = null;
                }
            }

            // unhighlight the previous button
            if(!skipUnhighlightForThisMain && !highlightedButton.highlightAnim.getReversed()){
                unHighlightButton(highlightedButton);
            }
        }


        // check if open sub-buttons need to be closed
        const inCurrentSubMenu = (!parentOfOpenSubButtons||!button)?false : (parentOfOpenSubButtons.buttonName == button.mainButtonName); // check if the currently highlighted button is a sub-button of the active parent
        const isTheSameMainButton = (!parentOfOpenSubButtons||!button)?false : (parentOfOpenSubButtons.buttonName == button.buttonName); // check if this is the same parent button as the one that's currently showing sub-buttons
        if(parentOfOpenSubButtons){
            if(!isTheSameMainButton && !inCurrentSubMenu){
                // unhighlight old main
                if(highlightedMainButton) unHighlightButton(highlightedMainButton);
                highlightedMainButton = null;

                // sub-buttons anim-out if not in currently active sub-buttons
                collapseSubButtons(parentOfOpenSubButtons);
                parentOfOpenSubButtons = null;
            }
        }


        // if a button is highlighted and enabled
        if(button && button.isEnabled){
            highlightedButton = button;
            lastPickedButton = button;

            if(button != highlightedMainButton){ // if not currently highlighted because of being the sub's main
                highlightedButton.onHighlight.callback(); // trigger highlight callback
    
                // highlight anim-in on this button
                button.highlightAnim.setReversed(false);
                button.highlightAnim.start();
            }

            // check if any sub-buttons on this button, open if not done already
            if(!isTheSameMainButton && !inCurrentSubMenu && !button.mainButtonName){ // only open sub-buttons if this button is a parent button
                openSubButtons(button);
                parentOfOpenSubButtons = button;
            }

        // if no button is highlighted
        }else{
            self.onNoneHighlighted.callback();
            parentOfOpenSubButtons = null;
            highlightedButton = null;
            highlightedMainButton = null;
        }
    }



    // anim-in all sub-buttons on this parent button
    function openSubButtons(parentButton){
        const subButtons = parentedToButtons[parentButton.buttonName];
        if(subButtons){
            for(var i = 0; i < subButtons.length; i++){
                var subButton = subButtons[i];
                subButton.subShowAnim.setReversed(false);
                subButton.subShowAnim.start();
            }
        }
    }



    // anim-out all sub-buttons on this parent button
    function collapseSubButtons(parentButton){
        if(!parentOfOpenSubButtons) return;
        const subButtons = parentedToButtons[parentButton.buttonName];
        if(subButtons){
            for(var i = 0; i < subButtons.length; i++){
                var subButton = subButtons[i];
                if(!subButton.subShowAnim.getReversed()){
                    var t = subButton.subShowAnim.getTimeRatio();
                    subButton.subShowAnim.setReversed(true);
                    subButton.subShowAnim.start(1-t);
                }
            }
        }
    }



    function onPinchEnd(disabled){ // 'disabled' closes the radial because of the disable() toggle
        if(pinchStartDelay) pinchStartDelay.stop();
        pinchStartDelay = new DoDelay(function(){
            pinchStartDelay = null;
            
            isOpen = false;
    
            // hide radial
            if(!self.openCloseAnim.getReversed()){
                // select highlighted button
                if(highlightedButton){
                    highlightedButton.highlightAnim.stop(); // don't do highlight-out, as pressAnim now takes over
                    if(!disabled) highlightedButton.onPress.callback(); // trigger press callback
                    
                    // press animation
                    if(highlightedButton.doPressAnimation){
                        highlightedButton.pressAnim.setReversed(false);
                        highlightedButton.pressAnim.start();
                    }
                }
    
                stopPressAnimDelay(); // to be sure, stop the press anim delay before starting a new one
                pressAnimDelay = new DoDelay(function(){
                    var t = self.openCloseAnim.getTimeRatio();
                    self.openCloseAnim.setReversed(true);
                    self.openCloseAnim.start(1-t);
                    pressAnimDelay = null;
    
                    // on press and closed
                    if(awaitingClosedMenu) awaitingClosedMenu.now(); // call previous delayed callback right away if already requesting another one
                    if(lastPickedButton){
                        awaitingClosedMenu = new DoDelay(function(){
                            if(lastPickedButton) lastPickedButton.onPressAndClosed.callback();
                            awaitingClosedMenu = null;
                        }).byTime(self.openCloseAnim.reverseDuration + .01); // tiny bit extra time to be sure
                    }
                });
                pressAnimDelay.byTime(highlightedButton ? (highlightedButton.pressAnim.duration * .5) : 0); // start radial-out anim after press anim, with 50% overlap for a snappy feeling
            }
        }).byFrame();
        
    }

    function stopPressAnimDelay(){
        if(pressAnimDelay){
            pressAnimDelay.stop();
            pressAnimDelay = null;
        }
    }

    function disable(){
        if(!isEnabled) return; // already disabled
        isEnabled = false;
        if(pinchStartDelay) pinchStartDelay.stop();
        pinchStartDelay = null;
        onPinchEnd(true);
    }

    function enable(){
        isEnabled = true;
    }

    function getAllButtons(){
        return buttons;
    }
}









// animation constructors



// creates a default show/hide animation for sub-buttons with arbitrary duration etc, can be changed later by user
// feel free to copy this function to your own script, modify it, and overwrite the subButton.subShowAnim property with it!
function createSubShowAnim(trf, buttonSize){
    // animation update function
    var anim = new AnimateProperty(function(v){
        trf.setLocalScale(vec3.one().uniformScale(v * buttonSize)); // scale
    });

    // enable/disable sub-buttons when not visible
    anim.startFunction = function(){
        if(!anim.getReversed()){ // if showing
            trf.getSceneObject().enabled = true; // enable on start
        }
    }
    anim.endFunction = function(){
        if(anim.getReversed()){ // if hiding
            trf.getSceneObject().enabled = false; // disable on end
        }
    }

    // durations and easing
    anim.duration = .2;
    anim.reverseDuration = .15;
    anim.easeFunction = EaseFunctions.Cubic.Out;
    anim.reverseEaseFunction = EaseFunctions.Cubic.InOut;
    return anim;
}



// creates a default highlight/unhighlight animation with arbitrary duration etc, can be changed later by user
// feel free to copy this function to your own script, modify it, and overwrite the button.highlightAnim property with it!
function createHighlightAnim(trf, buttonSize){
    // parameters
    const depthOffset = -2.5; // highlight depth (cm)
    const upscale = 1.3; // highlight scale multiplier

    // store the starting position in the animation's startFunction, so the offset is relative to where the animation begins each time
    var startPos;

    // animation update function
    var anim = new AnimateProperty(function(v){
        var scaleMult = remap(v, 0, 1, 1, upscale); // custom highlight scale strength
        trf.setLocalScale(vec3.one().uniformScale(buttonSize * scaleMult)); // scale
        if(startPos) trf.setLocalPosition(startPos.add(vec3.forward().uniformScale(v * depthOffset))); // position
    });

    // on animation start
    anim.startFunction = function(){
        if(!startPos) startPos = trf.getLocalPosition(); // get the starting position for this button and animate its position from there
    }

    // durations and easing
    anim.duration = .2;
    anim.reverseDuration = .15;
    anim.easeFunction = EaseFunctions.Cubic.Out;
    anim.reverseEaseFunction = EaseFunctions.Cubic.InOut;
    return anim;
}



// creates a default press/release animation with arbitrary duration etc, can be changed later by user
// this animation only plays forward! since a button press is never kept for longer durations, it automatically does the in & out animation in sequence
// feel free to copy this function to your own script, modify it, and overwrite the button.pressAnim property with it!
function createPressAnim(trf, buttonSize){
    // parameters
    const pushedScale = .2; // scale when fully pushed in
    
    // store the starting size in the animation's startFunction, so the offset is relative to where the animation begins each time
    var startSize;
    
    // animation update function
    var anim = new AnimateProperty(function(v){
        // this animation is sometimes pulsed at 0 to reset, in that case just scale back to buttonSize (instead of to the old startSize)
        if(!anim.isPlaying() && v == 0){
            trf.setLocalScale(vec3.one().uniformScale(buttonSize));
            return;
        }

        // do a button push-in and push-out animation
        const centerRemapped = centerRemap(v, .3, 0); // remap 0-1 to 0-1-0 to create push-in and push-out with a custom center (arbitrary, this value just looks nice)
        const secondHalf = centerRemapped.passedCenter > 0; // true if past the center of the animation
        const eased = interp(0, 1, centerRemapped.remapped, secondHalf ? EaseFunctions.Cubic.In : EaseFunctions.Cubic.InOut); // easing depending on wether this is the in-animation or out-animation
        const pushScale = remap(eased, 0, 1, 1, pushedScale); // remap eased curve to the push-in amount
        trf.setLocalScale(startSize.uniformScale(pushScale)); // apply scale
    });

    // on animation start
    anim.startFunction = function(){
        startSize = trf.getLocalScale(); // get the starting size for this button and animate its scale from there
    }

    // durations and easing
    anim.duration = .3;
    anim.easeFunction = EaseFunctions.Linear.InOut; // the easing is happening inside the update function in this case!
    return anim;
}
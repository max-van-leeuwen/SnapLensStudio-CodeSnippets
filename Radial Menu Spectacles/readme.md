# Radial Menu for Lens Studio (Spectacles 🕶️)

<br>If you’re developing for the Spectacles, this script creates Radial Menus for you!
<br><br>Fully animated, customizable, supporting per-button secondary rings, and with a bunch of callbacks.
<br>The interactions are easy to bind to - I recommend using my [Hand Tracking](https://github.com/max-van-leeuwen/SnapLensStudio-CodeSnippets/tree/main/Hand%20Tracking%20Setup) setup + Spectacles Interaction Kit.
<br><br>Examples shown in video are included in the download.

<br>
<img src="https://github.com/max-van-leeuwen/SnapLensStudio-CodeSnippets/blob/main/Radial Menu Spectacles/Media/preview.gif"/>

<br>

(This script needs [LSQuickScripts](https://maxvanleeuwen.com/lsquickscripts) in your project in order to work.)

<br><br>

## Usage
- [Creating a Radial Menu](#creating-a-radial-menu)
- [Binding Callbacks](#binding-callbacks)
- [Interacting with Hand Tracking](#interacting-with-hand-tracking)
- [Customization Options](#customization-options)
- [Helper Functions](#helper-functions)
- [Button Properties](#button-properties)
- [Customizing Button Animations](#customizing-button-animations)



## Creating a Radial Menu
Create a menu and add buttons using the global `SpectaclesRadialMenu` instance.
```javascript
var menu = new SpectaclesRadialMenu.Create(); // Radial instance
var button1 = menu.addButton(script.button1, "button1"); // 1st button on main radial
var button2 = menu.addButton(script.button2, "button2"); // 2nd button on main radial
var button3 = menu.addButton(script.button3, "button3"); // 3rd button on main radial
var subButton1 = menu.addSubButton("button1", script.button1SubVisual1, "button1sub"); // Sub-button under button1
```

## Binding Callbacks
### Example: Simple Button Press
Bind a callback to `button1`:
```javascript
button1.onPress.add(function(){
    print('button 1 pressed!')    
});
```

### Example: Button Press on Menu Close
Bind a callback to `button1` that triggers when the button is pressed and after the menu has fully closed:
```javascript
button1.onPressAndClosed.add(function(){
    print('button 1 pressed, and menu fully closed!');
});
```

## Interacting with Hand Tracking
Use hand tracking events (e.g., pinching gestures) to interact with the radial menu:
```javascript
HandTracking.onPinchStart.add(function(pinchPos){
    menu.onPinchStart(pinchPos);
});
HandTracking.onPinchHold.add(function(pinchPos){
    menu.onPinchHold(pinchPos);
});
HandTracking.onPinchEnd.add(function(){
    menu.onPinchEnd();
});
```

This [Hand Tracking](https://github.com/max-van-leeuwen/SnapLensStudio-CodeSnippets/tree/main/Hand%20Tracking%20Setup) setup makes the pinch callback easy to set up. It is also included in the example project.

## Customization Options
Adjust properties of the radial menu:
- `menu.radius` - Radial radius (world units). Default: `6cm`.
- `menu.subRadius` - Radius of the sub-buttons ring. Default: `12cm`.
- `menu.centerRadius` - Radius inside the ring to unselect radial buttons. Default: `2 rad`.
- `menu.subOffsetDistance` - Radial offset to space sub-buttons. Default: `0.12 rad`.
- `menu.buttonSize` - Local button size. Default: `3cm`.
- `menu.radialRotation` - Offset the radial's rotation (0-2pi, clockwise). Default: `0`.

### Build the Menu
Once customized, build the menu:
```javascript
menu.build();
```

## Enabling and Disabling the Menu
Control the menu's activation state:
```javascript
menu.disable();
menu.enable();
```

## Helper Functions
Useful functions for interacting with the radial menu:
- `menu.isOpen()` - Returns `true` if the radial is open.
- `menu.isEnabled()` - Returns `true` if the radial is enabled.
- `menu.getHighlightedButton()` - Get the currently highlighted button (or `null`).
- `menu.getAllButtons()` - Returns a list of button objects by name.
- `menu.getRootObject()` - Returns the root `SceneObject`.
- `menu.openCloseAnim` - Animation instance for opening/closing.
- `menu.onNoneHighlighted` - Callback: when all buttons are unhighlighted.

## Button Properties

### Button Object Data
Button objects provide the following options:
- `.buttonName` (string)
- `.sceneObject` (button `SceneObject`)
- `.subOffsetDistance` (float, distance in radians between sub-buttons)
- `.highlightAnim` (AnimateProperty instance for highlighting)
- `.pressAnim` (AnimateProperty instance for pressing)
- `.isEnabled` (bool)
- `.onPress` (callback: on button press)
- `.onPressAndClosed` (callback: on button press, after menu is closed)
- `.onHighlight` (callback: on highlight)
- `.onUnHighlight` (callback: on unhighlight)

<br>

Customizing animations on buttons, for example the highlight animation:
```javascript
button.highlightAnim.updateFunction = function(v){
    button.sceneObject.getComponent("Component.Visual").mainPass.baseColor = new vec4(1, 1, 1, v); // white, with transparency 'v'
};
```

For more information on these animation functions, see the AnimateProperty class in [LSQuickScripts](https://github.com/max-van-leeuwen/SnapLensStudio-CodeSnippets/tree/main/LSQuickScripts)!
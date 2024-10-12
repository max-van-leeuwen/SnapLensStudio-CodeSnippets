# Hand Tracking Manager for Lens Studio

<br>This script creates super handy callbacks for hand tracking - whether it's on mobile, Spectacles, or emulating using tap & hover in the preview panel!
<br>On Spectacles, this should be combined with Spectacles Interaction Kit.
<br>
<br>[twitter (@maksvanleeuwen)](https://twitter.com/maksvanleeuwen)

<br><br>

<p float="left">
  <img src="https://github.com/max-van-leeuwen/SnapLensStudio-CodeSnippets/blob/main/Hand Tracking Setup/Media/inspector.png" width="400"/>
  <img src="https://github.com/max-van-leeuwen/SnapLensStudio-CodeSnippets/blob/main/Hand Tracking Setup/Media/preview.gif"/>
</p>

<br>

(This script needs [LSQuickScripts](https://maxvanleeuwen.com/lsquickscripts) in your project in order to work.)

<br><br>

## Usage

### Callbacks (any hand)

Bind using `.add(f)` and `.remove(f)`.

- **`.onPinchStart`** → (`pos`, `isTap`)
- **`.onPinchHold`** → (`pos`, `isTap`)
- **`.onPinchEnd`** → (`pos`, `isTap`)
- **`.onTrackStart`** → (`isTap`)
- **`.onTrackEnd`** → (`isTap`)
- **`.onActiveHandChange`** → (`prvHand`, `curHand`)

### Tracking Info

- **`.getActiveHand()`** → `Hand`
- **`.getDominantHand()`** → `Hand`
- **`.getPinching()`** → `bool`
- **`.getPinchPosition()`** → `vec3`
- **`.getPinchForward()`** → `vec3 (normalized)`
- **`.getPinchUp()`** → `vec3 (normalized)`
- **`.getHoverScreenPosition()`** → `vec2`
- **`.getHoverWorldPosition()`** → `vec3`

## Data Types

- **`pos`**: position `vec3`, world space
- **`isTap`**: bool if emulated (preview panel tapping instead of pinch)
- **`Hand`**: string ('left'|'right')

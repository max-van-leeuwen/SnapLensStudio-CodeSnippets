# Hand Tracking Manager for Lens Studio

Some handy interaction helpers with tap emulation for Lens Studio.
<br>[twitter (@maksvanleeuwen)](https://twitter.com/maksvanleeuwen)

<br>

<img src="https://github.com/max-van-leeuwen/SnapLensStudio-CodeSnippets/blob/main/Hand Tracking Setup/Media/preview.gif" />

<br>

## Usage

### Callbacks (any hand)

Bind using `.add(f)` and `.remove(f)`.

- **`.onPinchStart`** → (`Pos`, `isTap`)
- **`.onPinchHold`** → (`Pos`, `isTap`)
- **`.onPinchEnd`** → (`Pos`, `isTap`)
- **`.onTrackStart`** → (`isTap`)
- **`.onTrackEnd`** → (`isTap`)
- **`.onActiveHandChange`** → (`prvHand`, `curHand`)

### Tracking Info

- **`.getActiveHand()`** → `Hand`
- **`.getDominantHand()`** → `Hand`
- **`.getPinching()`** → `bool`
- **`.getPinchPosition()`** → `vec3`

## Data Types

- **`Pos`**: position `vec3`, world space
- **`isTap`**: bool if emulated (not Hand Tracking)
- **`Hand`**: string ('left'|'right')

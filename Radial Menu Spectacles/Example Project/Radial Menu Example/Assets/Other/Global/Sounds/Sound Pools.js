// Max & Liisi
//  maxandliisi.com
//  by Max van Leeuwen - maxvanleeuwen.com

// Pools sound components together, to avoid hitting the 32-component limit
// 🔊 tick sounds (radial menu and other places) by Cyriel Verkuijlen



// access
global.SoundPools = script;



// params
const waitTime = .09; // minimum wait time inbetween instances
const poolSizeTick = 1; // 1 audio component per asset


//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"On Spectacles, there is an Audio Component limit. This script makes sound pools of commonly played assets, which can be called from anywhere."}
//@ui {"widget":"label"}



// tick sounds

//@input Asset.AudioTrackAsset[] tick1Asset
const tick1Pool = new InstSoundPooled(script.tick1Asset, poolSizeTick, waitTime);
script.tick1 = tick1Pool.instance;

//@input Asset.AudioTrackAsset[] tick2Asset
const tick2Pool = new InstSoundPooled(script.tick2Asset, poolSizeTick, waitTime);
script.tick2 = tick2Pool.instance;

//@input Asset.AudioTrackAsset[] tick3Asset
const tick3Pool = new InstSoundPooled(script.tick3Asset, poolSizeTick, waitTime);
script.tick3 = tick3Pool.instance;

//@input Asset.AudioTrackAsset[] tick4Asset
const tick4Pool = new InstSoundPooled(script.tick4Asset, poolSizeTick, waitTime);
script.tick4 = tick4Pool.instance;

//@input Asset.AudioTrackAsset[] tick5Asset
const tick5Pool = new InstSoundPooled(script.tick5Asset, poolSizeTick, waitTime);
script.tick5 = tick5Pool.instance;
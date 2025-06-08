// Max van Leeuwen
//  maxvanleeuwen.com

// Plays the audio asset once, without cut-offs! Tap the screen to try.
// Requires LSQuickScripts



//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"Tap to instance sound!"}
//@ui {"widget":"label"}



//@input Asset.AudioTrackAsset audio
script.createEvent("TouchStartEvent").bind(function(){ // on each tap
    instSound(script.audio); // play this audio
});
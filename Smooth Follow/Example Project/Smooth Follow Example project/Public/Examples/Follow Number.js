// Max van Leeuwen
// twitter      @maksvanleeuwen
// instagram    @max.van.leeuwen
// maxvanleeuwen.com
//
// Smooth Follow on a number in code
// Tap to see an interpolate animation to a new random value, printed in the logger



// create smooth follow
var smoothFollower = new SmoothFollow();
smoothFollower.smoothing = 1;
smoothFollower.onValueChange = function(v){ // set callback
    print(v); // print current value
}

// feed the smooth following a new random number on each tap
function smoothlyInterpolateToNewNumber(){
    var v = Math.random();
    smoothFollower.addValue(v);
}
var newNumberEvent = script.createEvent("TapEvent");
newNumberEvent.bind(smoothlyInterpolateToNewNumber);
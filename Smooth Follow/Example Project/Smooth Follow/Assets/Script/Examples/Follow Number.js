// Max van Leeuwen
//  @maksvanleeuwen
//  links.maxvanleeuwen.com
//
// Smooth Follow on a value (like numbers, vec2, vec3, or quat)
// Tap to generate a random number, and see the previous value animate towards it (printed in logger)



//@ui {"widget":"label"}
//@ui {"widget":"label", "label":"tap to interpolate to a new random number"}
//@ui {"widget":"label", "label":"(open this script for more info)"}
//@ui {"widget":"label"}



// create follower
var follower = new SmoothFollow();
follower.smoothing = .15;
follower.onUpdate.add(function(v){
    print(v); // print current value on each smoothing frame
});



// feed the smooth following a new random number on each tap
var newNumberEvent = script.createEvent("TapEvent");
newNumberEvent.bind(function(){
    var v = Math.random();
    follower.addValue(v);
});
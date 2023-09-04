// Max van Leeuwen
// twitter      @maksvanleeuwen
// instagram    @max.van.leeuwen
// maxvanleeuwen.com
//
// Smooth Follow example, made compatible with behavior script.



//@ui {"widget":"label", "label":"This makes Smooth Follow"}
//@ui {"widget":"label", "label":"compatible with behavior script!"}
//@ui {"widget":"label"}



// inputs
//@input SceneObject objectToFollow
//@input float smoothing = 1

//@ui {"widget":"label"}
//@input bool doPosition = true
//@input bool doPositionX = true {"showIf":"doPosition"}
//@input bool doPositionY = true {"showIf":"doPosition"}
//@input bool doPositionZ = true {"showIf":"doPosition"}

//@ui {"widget":"label"}
//@input bool doRotation = true

//@ui {"widget":"label"}
//@input bool doScale = true



// create following instance
var smoothFollower = new SmoothFollow();
smoothFollower.follow = script.objectToFollow;
smoothFollower.apply = script.getSceneObject();
smoothFollower.smoothing = script.smoothing;
smoothFollower.translation = script.doPosition;
smoothFollower.translationX = script.doPositionX;
smoothFollower.translationY = script.doPositionY;
smoothFollower.translationZ = script.doPositionZ;
smoothFollower.rotation = script.doRotation;
smoothFollower.scale = script.doScale;



// provide access to Behavior script
script.startSmoothFollow = smoothFollower.start; // start following
script.stopSmoothFollow = smoothFollower.stop; // stop following
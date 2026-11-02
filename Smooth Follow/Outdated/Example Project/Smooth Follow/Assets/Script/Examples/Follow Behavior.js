// Max van Leeuwen
//  maxvanleeuwen.com

// Smooth Follow example, made compatible with behavior script.



//@ui {"widget":"label", "label":"This script makes Smooth Follow compatible with behavior scripts!"}
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
smoothFollower.target = script.objectToFollow;
smoothFollower.follow = script.getSceneObject();
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
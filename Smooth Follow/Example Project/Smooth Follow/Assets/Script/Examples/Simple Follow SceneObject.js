// Max van Leeuwen
//  maxvanleeuwen.com

// Simple Smooth Follow example



//@input SceneObject target
//@input float smoothing



var smoothFollower = new SmoothFollow();
smoothFollower.target = script.target;
smoothFollower.follow = script.getSceneObject();
smoothFollower.smoothing = script.smoothing;
smoothFollower.start();
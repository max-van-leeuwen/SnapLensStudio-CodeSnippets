// Max van Leeuwen
//  @maksvanleeuwen
//  links.maxvanleeuwen.com

// Simple Smooth Follow example



//@input SceneObject objectToFollow
//@input float smoothing



var smoothFollower = new SmoothFollow();
smoothFollower.follow = script.objectToFollow;
smoothFollower.apply = script.getSceneObject();
smoothFollower.smoothing = script.smoothing;

smoothFollower.start();
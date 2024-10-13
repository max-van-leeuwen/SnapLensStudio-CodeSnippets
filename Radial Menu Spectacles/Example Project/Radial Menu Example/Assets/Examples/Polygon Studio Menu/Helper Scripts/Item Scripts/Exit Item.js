// Max van Leeuwen
//  @maksvanleeuwen
//  links.maxvanleeuwen.com

// Access to template items



//@ui {"widget":"label"}
//@input SceneObject smoke1
script.smoke1 = script.smoke1.getTransform(); // overwrite with transform
//@input SceneObject smoke2
script.smoke2 = script.smoke2.getTransform();
//@input SceneObject smoke3
script.smoke3 = script.smoke3.getTransform();
//@input SceneObject doorRotationAnchor
script.doorRotationAnchor = script.doorRotationAnchor.getTransform();

// start and end rotations for door
script.doorRotationStart = script.doorRotationAnchor.getLocalRotation();
script.doorRotationEnd = script.doorRotationStart.multiply(quat.angleAxis(Math.PI*.7, vec3.up())); // arbitrary amount

// visuals to animate when removeMode is toggled
//@input Component.RenderMeshVisual[] removeModeVisuals
// Max van Leeuwen
//  maxvanleeuwen.com

// Radial Menu example



// inputs
//@input SceneObject sliceTemplate // button template SceneObject
//@input int slices // amount of buttons (slices) to add to the radial



// create a new radial menu instance
const menu = new SpectaclesRadialMenu.Create();

// menu stylization
menu.buttonSize = 1;
menu.radius = 5;


// procedural button visuals!
// create rotated copies of sliceTemplate, with unique materials on it
for(let i = 0; i < script.slices; i++){

    // duplicate and get its child objects
    let obj = script.getSceneObject().copyWholeHierarchy(script.sliceTemplate);
    let rotObj = obj.getChild(0);                           // rotation obj
    let imgObj = obj.getChild(0).getChild(0);               // Image component obj
    let txtObj = obj.getChild(0).getChild(0).getChild(0);   // Text component obj
    
    // make unique material in Image component
    let img = imgObj.getComponent("Component.Image");
    let mat = img.getMaterial(0);
    let newMat = mat.clone();
    img.clearMaterials();
    img.addMaterial(newMat);

    // set material parameter (slices count)
    newMat.mainPass.sliceCount = script.slices;

    // set image rotation for this button
    let rot = quat.angleAxis( (i/script.slices) * Math.PI * -2, vec3.forward());
    rotObj.getTransform().setLocalRotation(rot);

    // set text (digits)
    let buttonName = (i+1).toString(); // button ID starting at 1 (string))
    txtObj.getComponent("Component.Text").text = buttonName;

    // create a button on the radial out of this SceneObject
    let button = menu.addButton(obj, "button" + buttonName);

    // bind an action to this button!
    button.onPress.add(function(){
        print('button ' + buttonName + ' pressed!');
    });

    // here, I'm changing the 'button highlight' animation for each button to make it custom: I want the button to move away from the center, and increase in brightness.
    // this updateFunction is called once per frame, with 'v' being the 0-1 animation value.
    // for more info on this type of scripted animation, see LSQuickScript's AnimateProperty class!
    button.highlightAnim.updateFunction = function(v){
        button.sceneObject.getChild(0).getChild(0).getTransform().setLocalPosition(new vec3(0, v, 0)); // move away from center when highlighted
        button.sceneObject.getChild(0).getChild(0).getComponent("Component.Image").mainPass.highlight = v; // set shader parameter (brightness when highlighted)
    }
    button.highlightAnim.duration = .15; // shorter animation duration
}


// wrapping an additional animation to the 'menu open/close' animation
const buttons = menu.getAllButtons();
menu.openCloseAnim.updateFunction = wrapFunction(menu.openCloseAnim.updateFunction, function(v){
    for(let buttonName in buttons){
        let button = buttons[buttonName];
        button.sceneObject.getChild(0).getChild(0).getComponent("Component.Image").mainPass.opacity = v; // make all buttons on radial fade-in/out while opening/closing
    }
});


// bind pinch interactions
HandTracking.onPinchStart.add(menu.onPinchStart);
HandTracking.onPinchHold.add(menu.onPinchHold);
HandTracking.onPinchEnd.add(menu.onPinchEnd);


// all set, let's build the radial! from here on forward, HandTracking pinch interactions will work with the radial
menu.build();


// hide the original template object
script.sliceTemplate.enabled = false;
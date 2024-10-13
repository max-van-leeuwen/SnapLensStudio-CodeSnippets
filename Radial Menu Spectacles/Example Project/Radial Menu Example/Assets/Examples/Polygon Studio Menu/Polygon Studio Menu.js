// Max van Leeuwen
//  maxvanleeuwen.com

// Radial Menu example
// For the full implementation of this specific Radial Menu, see Polygon Studio: https://maxandliisi.com/polygon-studio



// inputs
//@input SceneObject buttons

// sub-colors
//@ui {"widget":"label"}
//@ui {"widget":"group_start", "label":"colors"}
    /*
    @typedef subColors
    @property {vec3} color {"widget": "color"}
    */
    //@input subColors[] colorPalette
    
    // NOTE if you made any changes to the radial menu's colors,
    // print them by enabling the following function and copy/paste what comes out of that into PLY_to_Polygon_Studio.py! That way, the .PLY->.JS conversion tool will still work.
    // printColorIndices(); // <- uncomment me!

    //@input Asset.Material colorPalettePaint
//@ui {"widget":"group_end"}


// buttons
//@ui {"widget":"label"}
//@ui {"widget":"group_start", "label":"buttons"}
    //@input SceneObject exitButton
    //@input SceneObject colorButton
    //@input SceneObject removeButton
    //@input SceneObject snappingButton
    //@input SceneObject addMeshButton

    //@ui {"widget":"label"}
    //@input SceneObject subColorTemplateButton
    //@input SceneObject subTriangleMeshButton
    //@input SceneObject subSphereMeshButton
    //@input SceneObject subBoxMeshButton
    //@input SceneObject subTorusMeshButton
    //@input SceneObject subDolphinMeshButton
//@ui {"widget":"group_end"}



// placeholders
var radial;
var buttons; // all main buttons on the radial
var colorButtonShaders;
var colorIndex; // current color index
var removeModeAnim;



function init(){
    script.buttons.enabled = false; // hide button visuals from scene

    // build radial menu
    createRadial();
}
script.createEvent("OnStartEvent").bind(init);



function createRadial(){
    // initialize radial
    radial = new SpectaclesRadialMenu.Create();
    radial.buttonSize = 1.5;
    radial.radius = 5;
    radial.centerRadius = 3;
    radial.subRadius = 11; // slightly larger radius for sub-buttons ring

    // when no buttons are highlighted, don't show hand text hint
    radial.onNoneHighlighted.add(Hints.hideHandText);

    // wrap to the startfunction of the radial's open/close animation
    radial.openCloseAnim.startFunction = wrapFunction(radial.openCloseAnim.startFunction, function(inAnim){
        // when closing, don't show hand text hint anymore
        if(!inAnim) SoundPools.tick4();
        else Hints.hideHandText();
    });


    // different tick sounds assigned to different presses/highlights on radial
    function mainHighlightSound(){
        SoundPools.tick1();
    }
    function colorSubHighlightSound(){
        SoundPools.tick5();
    }
    function meshSubHighlightSound(){
        SoundPools.tick2();
    }
    function pressSound(){
        SoundPools.tick3();
    }


    // add main buttons
    buttons = [];

    var exitButton = radial.addButton(script.exitButton, "exit");
    exitButton.onPress.add(function(){
        pressSound();
    }); // callback
    exitButton.highlightAnim.updateFunction = wrapFunction(exitButton.highlightAnim.updateFunction, extraExitButtonHighlightUpdate); // wrap a custom highlight animation
    exitButton.onHighlight.add(function(){
        let txt = "main menu"; // tooltip
        Hints.showHandText(txt);
        mainHighlightSound();
    });
    buttons.push(exitButton); // store button to main buttons list
    
    var colorButton = radial.addButton(script.colorButton, "color");
    colorButton.subOffsetDistance = .12; // arbitrary
    colorButton.onHighlight.add(function(){
        let txt = 'colors';
        Hints.showHandText(txt);
        mainHighlightSound();
    });
    buttons.push(colorButton);

    var removeButton = radial.addButton(script.removeButton, "remove");
    removeButton.onPress.add(function(){
        onRemove();
        pressSound();
    });
    removeButton.highlightAnim.updateFunction = wrapFunction(removeButton.highlightAnim.updateFunction, extraRemoveButtonHighlightUpdate);
    removeButton.onHighlight.add(function(){
        let txt = removeMode ? "stop removing" : "remove triangles";
        Hints.showHandText(txt);
        mainHighlightSound();
    });
    buttons.push(removeButton);

    var snappingButton = radial.addButton(script.snappingButton, "snapping");
    snappingButton.onPress.add(function(){
        onSnapping(snappingButton);
        pressSound();
    }); // call with current button as argument
    snappingButton.onHighlight.add(function(){
        let txt = isSnapping ? "disable snapping" : "enable snapping";
        Hints.showHandText(txt);
        mainHighlightSound();
    });
    buttons.push(snappingButton);

    var addMeshButton = radial.addButton(script.addMeshButton, "addMesh");
    addMeshButton.subOffsetDistance = .20; // arbitrary
    addMeshButton.onHighlight.add(function(){
        let txt = "add mesh";
        Hints.showHandText(txt);
        mainHighlightSound();
    });
    buttons.push(addMeshButton);


    // add sub buttons

    // colors (create new SceneObjects per color, based on template)
    colorButtonShaders = [];
    for(var i = 0; i < script.colorPalette.length; i++){
        var subColorButtonObject = script.getSceneObject().copyWholeHierarchy(script.subColorTemplateButton);

        // custom color per button
        var subColorButtonScript = subColorButtonObject.getComponent("Component.Script");
        var mat = subColorButtonScript.colorObject.getMaterial(0).clone();
        colorButtonShaders.push(mat);
        subColorButtonScript.colorObject.clearMaterials();
        subColorButtonScript.colorObject.addMaterial(mat);
        mat.mainPass.c = script.colorPalette[i].color;

        // create with callback
        var subColorButton = radial.addSubButton("color", subColorButtonObject, "subColor" + i.toString());
        subColorButton.onPress.add(function(index){
            return function(){
                onColorPress(index);
                pressSound();
            };
        }(i));
        subColorButton.onHighlight.add(function(index){
            return function(){
                Hints.hideHandText();
                onColorHighlight(index);
                colorSubHighlightSound();
            };
        }(i));
    }


    // meshes
    
    var subDolphinMeshButton = radial.addSubButton("addMesh", script.subDolphinMeshButton, "subDolphinMesh");
    subDolphinMeshButton.onPress.add(function(){
        pressSound();
    });
    subDolphinMeshButton.onHighlight.add(function(){
        let txt = "dolphin";
        Hints.showHandText(txt);
        meshSubHighlightSound();
    });

    var subTorusMeshButton = radial.addSubButton("addMesh", script.subTorusMeshButton, "subTorusMesh");
    subTorusMeshButton.onPress.add(function(){
        pressSound();
    });
    subTorusMeshButton.onHighlight.add(function(){
        let txt = "torus";
        Hints.showHandText(txt);
        meshSubHighlightSound();
    });

    var subBoxMeshButton = radial.addSubButton("addMesh", script.subBoxMeshButton, "subBoxMesh");
    subBoxMeshButton.onPress.add(function(){
        pressSound();
    });
    subBoxMeshButton.onHighlight.add(function(){
        let txt = "box";
        Hints.showHandText(txt);
        meshSubHighlightSound();
    });
    
    var subSphereMeshButton = radial.addSubButton("addMesh", script.subSphereMeshButton, "subSphereMesh");
    subSphereMeshButton.onPress.add(function(){
        pressSound();
    });
    subSphereMeshButton.onHighlight.add(function(){
        let txt = "sphere";
        Hints.showHandText(txt);
        meshSubHighlightSound();
    });
    
    var subTriangleMeshButton = radial.addSubButton("addMesh", script.subTriangleMeshButton, "subTriangleMesh");
    subTriangleMeshButton.onPress.add(function(){
        pressSound();
    });
    subTriangleMeshButton.onHighlight.add(function(){
        let txt = "triangle";
        Hints.showHandText(txt);
        meshSubHighlightSound();
    });
    

    // interactions (always listening to HandTracking)
    HandTracking.onPinchStart.add(radial.onPinchStart);
    HandTracking.onPinchHold.add(radial.onPinchHold);
    HandTracking.onPinchEnd.add(radial.onPinchEnd);



    // remove mode buttons animation
    removeModeAnim = new AnimateProperty(function(v){
        const disableButtonScale = vec3.one().uniformScale(radial.buttonSize * remap(v, 0, 1, 1, .5));

        for(var i = 0; i < buttons.length; i++){
            if(buttons[i].buttonName == "remove") continue;

            // removeMode visual
            const button = buttons[i];
            const item = button.sceneObject.getComponent("Component.Script");
            if(!item || !item.removeModeVisuals) continue;
            for(var j = 0; j < item.removeModeVisuals.length; j++){ // apply removeMode mix value to visuals
                item.removeModeVisuals[j].mainPass.removeMode = v;
            }

            // smaller scale
            buttons[i].sceneObject.getTransform().setLocalScale(disableButtonScale);
        }
    });
    removeModeAnim.startFunction = function(){
        const enable = removeModeAnim.getReversed(); // disable buttons on animation start
        if(!enable){
            for(var i = 0; i < buttons.length; i++){
                if(buttons[i].buttonName == "remove") continue;
                buttons[i].isEnabled = false;
            }
        }
    }
    removeModeAnim.endFunction = function(){
        const enable = removeModeAnim.getReversed(); // enable buttons on animation end
        if(enable){
            for(var i = 0; i < buttons.length; i++){
                if(buttons[i].buttonName == "remove") continue;
                buttons[i].isEnabled = true;
            }
        }
    }
    removeModeAnim.duration = .2;

    // prepare removeModeAnim's visuals (making materials unique)
    for(var i = 0; i < buttons.length; i++){
        if(buttons[i].buttonName == "remove") continue;
        const item = buttons[i].sceneObject.getComponent("Component.Script");
        if(!item) continue;
        for(var j = 0; j < item.removeModeVisuals.length; j++){
            const visual = item.removeModeVisuals[j];
            const mat = visual.getMaterial(0).clone();
            visual.clearMaterials();
            visual.addMaterial(mat);
        }
    }


    // build radial!
    radial.build();

    // emulate color press on some initial color
    onColorPress(2); // random index
}



// on remove mode toggle, change the radial button's visuals (arg: anim in, bool)
function removeModeVisuals(v){
    removeModeAnim.setReversed(!v);
    removeModeAnim.start();
}



// button presses

var removeMode = false;
function onRemove(){
    removeMode = !removeMode;
    removeModeVisuals(removeMode);
    Hints.setRemoveMode(removeMode); // show hint next to hand
    
    // show hand hint
    if(removeMode){
        new DoDelay(function(){
            Hints.showHandText("pinch a triangle to remove")
        }).byTime(.5)
    }else{
        Hints.hideHandText();
    }
}

function onColorPress(n){
    colorIndex = n;
    onColorHighlight(n);
}

var isSnapping = true;
function onSnapping(button){
    isSnapping = !isSnapping;

    // get access to specific snapping visuals in radial menu
    const item = button.sceneObject.getComponent("Component.Script");

    // set shaders
    item.functionalityVisual.getMaterial(0).mainPass.turnedOff = !isSnapping;
    item.functionalityVisual2.getMaterial(0).mainPass.turnedOff = !isSnapping;
}



// button highlights

function onColorHighlight(n){
    const c = script.colorPalette[n].color;

    script.colorPalettePaint.mainPass.selectedColor = c;
    for(var i = 0; i < colorButtonShaders.length; i++){
        colorButtonShaders[i].mainPass.isSelected = i==n;
    }
}



// custom button highlight updates

function extraExitButtonHighlightUpdate(v){
    const exitButtonScript = script.exitButton.getComponent("Component.Script");

    // smoke animation
	const newSmokeScale = vec3.one().uniformScale(v);
	exitButtonScript.smoke1.setLocalScale(newSmokeScale);
	exitButtonScript.smoke2.setLocalScale(newSmokeScale);
	exitButtonScript.smoke3.setLocalScale(newSmokeScale);
    
    // door animation
	const newDoorRotation = quat.slerp(exitButtonScript.doorRotationStart, exitButtonScript.doorRotationEnd, v);
	exitButtonScript.doorRotationAnchor.setLocalRotation(newDoorRotation);
}


function extraRemoveButtonHighlightUpdate(v){
    // get remove button script
    const item = script.removeButton.getComponent("Component.Script");
	
    // trash pieces
    const newTrashScale = vec3.one().uniformScale(v);
    item.trash1.setLocalScale(newTrashScale);
    item.trash2.setLocalScale(newTrashScale);
    item.trash3.setLocalScale(newTrashScale);

    // can
    item.canTrf.setLocalPosition(vec3.lerp( item.canTrf1.getLocalPosition(), item.canTrf2.getLocalPosition(), v));
    item.canTrf.setLocalRotation(quat.slerp( item.canTrf1.getLocalRotation(), item.canTrf2.getLocalRotation(), v));

    // lid
    item.lidTrf.setLocalPosition(vec3.lerp( item.lidTrf1.getLocalPosition(), item.lidTrf2.getLocalPosition(), v));
    item.lidTrf.setLocalRotation(quat.slerp( item.lidTrf1.getLocalRotation(), item.lidTrf2.getLocalRotation(), v));
}
// Max van Leeuwen
//  @maksvanleeuwen
//  links.maxvanleeuwen.com

// Access to template items



// visuals to animate when removeMode is toggled
//@input Component.RenderMeshVisual[] removeModeVisuals

// make functionalityVisual unique immediately
//@input Component.RenderMeshVisual functionalityVisual
const functionalityVisualMat = script.functionalityVisual.getMaterial(0).clone();
script.functionalityVisual.clearMaterials();
script.functionalityVisual.addMaterial(functionalityVisualMat);

// make functionalityVisual2 unique immediately
//@input Component.RenderMeshVisual functionalityVisual2
const functionalityVisualMat2 = script.functionalityVisual2.getMaterial(0).clone();
script.functionalityVisual2.clearMaterials();
script.functionalityVisual2.addMaterial(functionalityVisualMat2);
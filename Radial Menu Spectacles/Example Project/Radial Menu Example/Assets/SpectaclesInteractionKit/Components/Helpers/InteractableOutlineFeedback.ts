import {Interactable} from "../Interaction/Interactable/Interactable"

@component
export class InteractableOutlineFeedback extends BaseScriptComponent {
  @input
  @hint("This is the material that will provide the mesh outline")
  targetOutlineMaterial: Material

  @input("vec4", "{1, 1, 0.04, 1}")
  @hint("This is the colour of the outline when hovered")
  @widget(new ColorWidget())
  hoveringColor: vec4 = new vec4(1, 1, 0.04, 1)

  @input("vec4", "{1, 1, 1, 1}")
  @hint("This is the colour of the outline when pinched")
  @widget(new ColorWidget())
  activatingColor: vec4 = new vec4(1, 1, 1, 1)

  @input
  @hint("This is the thickness of the outline")
  outlineWeight: number = 0.25

  @input
  @hint("These are the meshes that will be outlined on pinch/hover")
  meshVisuals: RenderMeshVisual[]

  private interactable: Interactable
  private outlineEnabled: boolean = true

  private highlightMaterial: Material

  onAwake() {
    this.defineScriptEvents()
  }

  private defineScriptEvents() {
    this.createEvent("OnStartEvent").bind(() => {
      this.init()

      this.createEvent("OnEnableEvent").bind(() => {
        this.outlineEnabled = true
      })

      this.createEvent("OnDisableEvent").bind(() => {
        this.outlineEnabled = false
        this.removeMaterialFromRenderMeshArray()
      })
    })
  }

  init() {
    this.highlightMaterial = this.targetOutlineMaterial.clone()
    this.highlightMaterial.mainPass.lineWeight = this.outlineWeight

    if (!this.targetOutlineMaterial) {
      throw new Error("Please ensure Material is added in the inspector.")
    }
    this.highlightMaterial = this.targetOutlineMaterial.clone()
    this.highlightMaterial.mainPass.lineWeight = this.outlineWeight
    this.highlightMaterial.mainPass.lineColor = this.hoveringColor

    this.interactable = this.getSceneObject().getComponent(
      Interactable.getTypeName()
    )
    if (!this.interactable) {
      throw new Error(
        "No interactable was found - please ensure that a component matching the Interactable typename provided was added to this SceneObject."
      )
    }

    this.setupInteractableCallbacks()
  }

  addMaterialToRenderMeshArray() {
    if (!this.outlineEnabled) {
      return
    }
    for (let i = 0; i < this.meshVisuals.length; i++) {
      const matCount = this.meshVisuals[i].getMaterialsCount()

      let addMaterial = true
      for (let k = 0; k < matCount; k++) {
        const material = this.meshVisuals[i].getMaterial(k)

        if (material.isSame(this.highlightMaterial)) {
          addMaterial = false
          break
        }
      }

      if (addMaterial) {
        const materials = this.meshVisuals[i].materials
        materials.unshift(this.highlightMaterial)
        this.meshVisuals[i].materials = materials
      }
    }
  }

  removeMaterialFromRenderMeshArray() {
    for (let i = 0; i < this.meshVisuals.length; i++) {
      let materials = []

      const matCount = this.meshVisuals[i].getMaterialsCount()

      for (let k = 0; k < matCount; k++) {
        const material = this.meshVisuals[i].getMaterial(k)

        if (material.isSame(this.highlightMaterial)) {
          continue
        }

        materials.push(material)
      }

      this.meshVisuals[i].clearMaterials()

      for (var k = 0; k < materials.length; k++) {
        this.meshVisuals[i].addMaterial(materials[k])
      }
    }
  }

  setupInteractableCallbacks() {
    this.interactable.onHoverEnter.add(() => {
      this.addMaterialToRenderMeshArray()
    })

    this.interactable.onHoverExit.add(() => {
      this.removeMaterialFromRenderMeshArray()
    })

    this.interactable.onTriggerStart.add(() => {
      this.highlightMaterial.mainPass.lineColor = this.activatingColor
    })

    this.interactable.onTriggerEnd.add(() => {
      this.highlightMaterial.mainPass.lineColor = this.hoveringColor
    })

    this.interactable.onTriggerCanceled.add(() => {
      this.highlightMaterial.mainPass.lineColor = this.hoveringColor
      this.removeMaterialFromRenderMeshArray()
    })
  }
}

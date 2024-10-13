import {Interactable} from "../Interaction/Interactable/Interactable"
import {ToggleButton} from "../UI/ToggleButton/ToggleButton"

/*
 * PinchButton provides basic pinch button functionality for the prefab pinch button.
 * It is meant to be added to a Scene Object with an Interactable component, with visual behavior configured in the Lens Studio scene.
 */

@component
export class ToggleFeedback extends BaseScriptComponent {
  @input
  toggledOffMaterial: Material
  @input
  toggledOffSelectMaterial: Material
  @input
  toggledOnMaterial: Material
  @input
  toggledOnSelectMaterial: Material
  @input
  disabledMaterial: Material
  @input
  meshVisuals: RenderMeshVisual[]

  private toggleButton: ToggleButton
  private interactable: Interactable

  private materials: Material[]

  onAwake() {
    this.materials = [
      this.toggledOffMaterial,
      this.toggledOffSelectMaterial,
      this.toggledOnMaterial,
      this.toggledOnSelectMaterial,
      this.disabledMaterial,
    ]

    this.defineScriptEvents()
  }

  private defineScriptEvents() {
    this.createEvent("OnStartEvent").bind(() => {
      this.init()
    })
  }

  init() {
    this.toggleButton = this.getSceneObject().getComponent(
      ToggleButton.getTypeName()
    )

    this.interactable = this.getSceneObject().getComponent(
      Interactable.getTypeName()
    )

    if (this.interactable === null || this.interactable === undefined) {
      throw new Error(
        "UIToggleButtonCustomize script requires an Interactable on the ToggleButton"
      )
    }

    this.setupInteractableCallbacks(this.interactable)
  }

  private removeMaterials(): void {
    for (let i = 0; i < this.meshVisuals.length; i++) {
      let materials = []

      const matCount = this.meshVisuals[i].getMaterialsCount()

      for (let k = 0; k < matCount; k++) {
        const material = this.meshVisuals[i].getMaterial(k)

        if (this.materials.includes(material)) {
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

  // Changes the material of each RenderMeshVisual provided.
  private changeMeshes(material: Material): void {
    this.removeMaterials()

    this.meshVisuals.forEach(function (mesh) {
      mesh.addMaterial(material)
    })
  }

  // Sets up interactable callbacks.
  setupInteractableCallbacks(interactable) {
    interactable.onTriggerStart.add(() => {
      this.changeMeshes(
        this.toggleButton.isToggledOn
          ? this.toggledOnSelectMaterial
          : this.toggledOffSelectMaterial
      )
    })

    interactable.onTriggerCanceled.add(() => {
      this.changeMeshes(
        this.toggleButton.isToggledOn
          ? this.toggledOnMaterial
          : this.toggledOffMaterial
      )
    })

    this.toggleButton.createEvent("OnEnableEvent").bind(() => {
      this.changeMeshes(
        this.toggleButton.isToggledOn
          ? this.toggledOnMaterial
          : this.toggledOffMaterial
      )
    })

    this.toggleButton.createEvent("OnDisableEvent").bind(() => {
      this.changeMeshes(this.disabledMaterial)
    })

    this.toggleButton.onStateChanged.add((isToggledOn) => {
      this.changeMeshes(
        this.toggleButton.enabled === false
          ? this.disabledMaterial
          : isToggledOn
          ? this.toggledOnMaterial
          : this.toggledOffMaterial
      )
    })
  }
}

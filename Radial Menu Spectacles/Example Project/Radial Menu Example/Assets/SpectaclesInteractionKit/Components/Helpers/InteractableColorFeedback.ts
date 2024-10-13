import {SIK} from "../../SIK"
import {Interactable} from "../Interaction/Interactable/Interactable"

@component
export class InteractableColorFeedback extends BaseScriptComponent {

  @input("vec4", "{0.28, 0.28, 0.28, 1}")
  @widget(new ColorWidget())
  defaultColor: vec4 = new vec4(0.28, 0.28, 0.28, 1)

  @input("vec4", "{0.28, 0.28, 0.28, 1}")
  @widget(new ColorWidget())
  hoverColor: vec4 = new vec4(0.28, 0.28, 0.28, 1)

  @input("vec4", "{0.46, 0.46, 0.46, 1}")
  @widget(new ColorWidget())
  pinchedColor: vec4 = new vec4(0.46, 0.46, 0.46, 1)

  @input("vec4", "{1, 1, 1, 0}")
  @widget(new ColorWidget())
  disabledColor: vec4 = new vec4(1, 1, 1, 0)

  @input
  @hint(
    "The meshes which will have their baseColor changed on pinch/hover events"
  )
  meshVisuals: RenderMeshVisual[]

  private interactable: Interactable 

  onAwake() {
    this.defineScriptEvents()
  }

  private defineScriptEvents() {
    this.createEvent("OnStartEvent").bind(() => {
      this.init()
    })
  }

  init() {
    this.interactable = this
      .getSceneObject()
      .getComponent(Interactable.getTypeName())
    if (this.interactable === null || this.interactable === undefined) {
      throw new Error(
        "PointerColorVisual script requires an Interactable on the same SceneObject"
      )
    }
    this.setupMaterials()
    this.setupInteractableCallbacks(this.interactable)
  }

  changeColor(color: vec4): void {
    if (color === undefined) {
      print("Color not defined - cannot change color using PointerColorVisual")
      return
    }
    this.meshVisuals.forEach(function (mesh) {
      if (mesh.mainMaterial.mainPass.baseColor !== undefined) {
        mesh.mainMaterial.mainPass.baseColor = color
      }
    })
  }

  setupInteractableCallbacks(interactable: Interactable ) {
    interactable.onHoverEnter.add(() => {
      this.changeColor(this.hoverColor)
    })
    interactable.onHoverExit.add(() => {
      this.changeColor(this.defaultColor)
    })
    interactable.onTriggerStart.add(() => {
      this.changeColor(this.pinchedColor)
    })
    interactable.onTriggerEnd.add(() => {
      this.changeColor(this.hoverColor)
    })
    interactable.onTriggerCanceled.add(() => {
      this.changeColor(this.defaultColor)
    })
    interactable.createEvent("OnEnableEvent").bind(() => {
      this.changeColor(this.defaultColor)
    })
    interactable.createEvent("OnDisableEvent").bind(() => {
      this.changeColor(this.disabledColor)
    })
  }

  setupMaterials() {
    this.meshVisuals.forEach(function (mesh) {
      mesh.mainMaterial = mesh.mainMaterial.clone()
    })
    this.changeColor(this.defaultColor)
  }
}

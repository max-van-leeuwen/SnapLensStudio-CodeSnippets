import {Interactable} from "../Interaction/Interactable/Interactable"

@component
export class InteractableSquishFeedback extends BaseScriptComponent {
  @input
  @hint("This is the SceneObject that will be squished on hover/pinch")
  squishObject: SceneObject
  @input
  @hint("This is how much the squishObject will squish along the y-axis")
  @widget(new SliderWidget(0, 1, 0.01))
  verticalSquish: number = 0.5
  @input
  @hint("This is how much the squishObject will squish along the x-axis")
  @widget(new SliderWidget(0, 1.5, 0.01))
  horizontalSquish: number = 0.5

  private interactable: Interactable
  private initialPinch: number = null
  private initialScale: vec3
  private squishScale: vec3
  private squishEnabled: boolean = true

  onAwake() {
    this.defineScriptEvents()
  }

  private defineScriptEvents() {
    this.createEvent("OnStartEvent").bind(() => {
      this.init()

      this.createEvent("OnEnableEvent").bind(() => {
        this.squishEnabled = true
      })

      this.createEvent("OnDisableEvent").bind(() => {
        this.squishEnabled = false
      })
    })
  }

  init() {
    this.initialScale = this.squishObject.getTransform().getLocalScale()
    this.squishScale = new vec3(
      this.initialScale.x * this.horizontalSquish,
      this.initialScale.y * this.verticalSquish,
      this.initialScale.z
    )

    this.interactable = this.getSceneObject().getComponent(
      Interactable.getTypeName()
    )
    if (!this.interactable) {
      throw new Error("PointerSquishVisual script requires an Interactable")
    }

    this.setupInteractableCallbacks()
  }

  resetScale() {
    this.squishObject.getTransform().setLocalScale(this.initialScale)
    this.initialPinch = null
  }

  updateSquish(event) {
    let currentPinch = event.interactor.interactionStrength
    if (
      currentPinch !== null &&
      this.initialPinch !== null &&
      this.squishEnabled
    ) {
      let pinchScale = MathUtils.remap(
        Math.max(this.initialPinch, currentPinch),
        Math.min(this.initialPinch, 0.95),
        1,
        0,
        1
      )
      this.squishObject
        .getTransform()
        .setLocalScale(
          vec3.lerp(this.initialScale, this.squishScale, pinchScale)
        )
    }
  }

  setupInteractableCallbacks() {
    this.interactable.onHoverEnter.add((event) => {
      this.initialPinch = event.interactor.interactionStrength
    })
    this.interactable.onHoverUpdate.add(this.updateSquish.bind(this))
    this.interactable.onHoverExit.add(this.resetScale.bind(this))
    this.interactable.onTriggerCanceled.add(this.resetScale.bind(this))
  }
}

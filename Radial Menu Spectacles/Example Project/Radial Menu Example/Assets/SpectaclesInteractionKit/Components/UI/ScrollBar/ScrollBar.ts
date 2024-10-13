import {DragType} from "../../../Core/Interactor/Interactor"
import {DragInteractorEvent} from "../../../Core/Interactor/InteractorEvent"
import NativeLogger from "../../../Utils/NativeLogger"
import {Interactable} from "../../Interaction/Interactable/Interactable"
import {ScrollView, ScrollViewEventArgs} from "../ScrollView/ScrollView"

const TAG = "ScrollBar"

/*
 * ScrollBar handles the logic of passing information between ScrollView and the ScrollBar SceneObject/Interactable.
 */
@component
export class ScrollBar extends BaseScriptComponent {
  private scrollView: ScrollView
  private scrollViewSceneObject: SceneObject

  private scrollViewScreenTransform: ScreenTransform

  private interactable: Interactable

  private transform: Transform

  @input
  @hint(
    "The mesh visual of the scroll bar, used to calculate the height offset that should be used to prevent the mesh from extending past the canvas. This mesh will also be disabled whenever setting this component to disabled."
  )
  @allowUndefined
  private _scrollBarMeshVisual: RenderMeshVisual | null = null

  @input
  @hint(
    "How far (in cm) the top edge of the ScrollBar mesh should sit from the edge of the canvas when at the top of the content."
  )
  private _boundingHeightOffset: number = 0

  private boundingHeight: number

  private yOrigin: number

  private log = new NativeLogger(TAG)

  onAwake() {
    this.createEvent("OnStartEvent").bind(() => {
      this.transform = this.getSceneObject().getTransform()

      this.scrollView = this.findScrollView()
      this.scrollViewSceneObject = this.scrollView.getSceneObject()
      this.scrollViewScreenTransform = this.scrollViewSceneObject.getComponent(
        "Component.ScreenTransform"
      )

      this.interactable = this.setupInteractable()

      this.boundingHeight = this.calculateBoundingHeight()
      this.yOrigin = this.scrollViewSceneObject
        .getTransform()
        .getLocalPosition().y

      this.setupScrollViewCallbacks()

      this.reset()
    })
  }

  private setupInteractable() {
    const interactable = this.getSceneObject().getComponent(
      Interactable.getTypeName()
    )

    if (interactable === null) {
      throw new Error("ScrollBar requires an interactable to function.")
    }

    interactable.onDragStart((event) => {
      if (event.interactor.dragType === DragType.Touchpad) {
        this.touchpadDragUpdate(event)
      } else {
        this.sixDofDragUpdate(event)
      }
    })

    interactable.onDragUpdate((event) => {
      if (event.interactor.dragType === DragType.Touchpad) {
        this.touchpadDragUpdate(event)
      } else {
        this.sixDofDragUpdate(event)
      }
    })

    interactable.enableInstantDrag = true

    return interactable
  }

  private setupScrollViewCallbacks() {
    this.scrollView.onReady.add(() => {
      this.reset()
    })

    this.scrollView.onScrollUpdate.add((event) => {
      this.onScroll(event)
    })

    this.scrollView.onSnapUpdate.add((event) => {
      this.onScroll(event)
    })
  }

  private onScroll(event: ScrollViewEventArgs) {
    // If there is no overflow, don't move ScrollBar at all.
    if (this.overflow <= 0) {
      return
    }

    const position = this.transform.getLocalPosition()
    position.y =
      this.yOrigin +
      MathUtils.lerp(
        this.boundingHeight,
        -this.boundingHeight,
        this.scrollPercentage
      )

    this.transform.setLocalPosition(position)
  }

  private calculateBoundingHeight() {
    const scrollViewHeight = this.scrollView.scrollAreaSize.y

    /**
     *  aabbMax returns the maximum value along one side of an axis, unrotated/unscaled.
     * If aabbMax.x = 10 units, then the actual x-length of the mesh (before scaling) is 20 units.
     */
    let aabb = this.scrollBarMeshVisual?.mesh.aabbMax ?? vec3.zero()

    // In the case that the mesh is scaled/rotated, transform the AABB dimensions.
    aabb = this.getTransform().getWorldScale().scale(aabb)
    aabb = this.getSceneObject()
      .getTransform()
      .getWorldRotation()
      .multiplyVec3(aabb)

    const localAabb = this.scrollViewSceneObject
      .getTransform()
      .getInvertedWorldTransform()
      .multiplyDirection(aabb)

    const boundingHeight =
      scrollViewHeight / 2 - localAabb.y - this.boundingHeightOffset

    if (boundingHeight <= 0) {
      this.log.e(
        `Bounding height of the ScrollBar is negative. Reduce the boundingHeightOffset parameter for proper ScrollBar behavior.`
      )
    }

    return boundingHeight
  }

  private touchpadDragUpdate(event: DragInteractorEvent) {
    const deltaY = event.dragVector.y
    const newPercentage =
      this.scrollPercentage - deltaY / (this.boundingHeight * 2)

    if (newPercentage < 0 || newPercentage > 1) {
      this.scrollToEdge(newPercentage < 0)
      return
    }

    this.scrollView.scrollBy(new vec2(0, deltaY * this.scrollRatio))
  }

  private sixDofDragUpdate(event: DragInteractorEvent) {
    if (
      event.interactor.planecastPoint !== null &&
      event.planecastDragVector !== null
    ) {
      const newDragPoint = event.interactor.planecastPoint
      const deltaY = this.localizeDragVector(event.planecastDragVector).y

      if (
        this.scrollViewScreenTransform.worldPointToLocalPoint(newDragPoint).y >=
        1
      ) {
        this.scrollToEdge(true)
        return
      }
      if (
        this.scrollViewScreenTransform.worldPointToLocalPoint(newDragPoint).y <=
        -1
      ) {
        this.scrollToEdge(false)
        return
      }

      const newPercentage =
        this.scrollPercentage - deltaY / (this.boundingHeight * 2)
      if (newPercentage < 0 || newPercentage > 1) {
        this.scrollToEdge(newPercentage < 0)
        return
      }

      this.scrollView.scrollBy(new vec2(0, deltaY * this.scrollRatio))
    }
  }

  private get scrollRatio() {
    return -this.overflow / (this.boundingHeight * 2)
  }

  private localizeDragVector(dragVector: vec3): vec2 {
    const transform = this.scrollViewSceneObject.getTransform()

    const localXAxis = transform.getWorldRotation().multiplyVec3(vec3.right())

    const localYAxis = transform.getWorldRotation().multiplyVec3(vec3.up())

    const localizedX = localXAxis.dot(dragVector) / transform.getWorldScale().x
    const localizedY = localYAxis.dot(dragVector) / transform.getWorldScale().y

    return new vec2(localizedX, localizedY)
  }

  private scrollToEdge(topEdge: boolean) {
    const adjustedPercentage = topEdge
      ? this.scrollPercentage
      : -(1 - this.scrollPercentage)

    this.scrollView.scrollBy(new vec2(0, -adjustedPercentage * this.overflow))
  }

  // Search through the siblings of this SceneObject to allow for the script instantiation use case.
  private findScrollView(): ScrollView {
    const parent = this.getSceneObject().getParent()
    const children = parent?.children ?? null

    if (children === null) {
      throw new Error(
        "Sibling SceneObject with ScrollView component not found. Ensure that the ScrollView owner is a sibling of the ScrollBar owner."
      )
    }

    for (let child of children) {
      const scrollView = child.getComponent(ScrollView.getTypeName())

      if (scrollView !== null) {
        return scrollView
      }
    }

    throw new Error(
      "Sibling SceneObject with ScrollView component not found. Ensure that the ScrollView owner is a sibling of the ScrollBar owner."
    )
  }

  get scrollPercentage() {
    return this.scrollView.scrollPercentage
  }

  get overflow() {
    return this.scrollView.overflow
  }

  get scrollBarMeshVisual(): RenderMeshVisual {
    return this._scrollBarMeshVisual
  }

  set scrollBarMeshVisual(mesh: RenderMeshVisual) {
    this._scrollBarMeshVisual = mesh

    if (this.scrollView) {
      this.boundingHeight = this.calculateBoundingHeight()
    }
  }

  /**
   * @returns how far (in cm) the top edge of the ScrollBar mesh should sit from the edge of the canvas when at the top of the content.
   */
  get boundingHeightOffset(): number {
    return this._boundingHeightOffset
  }

  /**
   * Sets the offset between the top edge of the mesh and the edge of the canvas.
   * @param offset - how far (in cm) the top edge of the ScrollBar mesh should sit from the edge of the canvas when at the top of the content.
   */
  set boundingHeightOffset(offset: number) {
    this._boundingHeightOffset = offset

    if (this.scrollView) {
      this.boundingHeight = this.calculateBoundingHeight()
    }
  }

  get isEnabled(): boolean {
    return this.scrollBarMeshVisual.enabled
  }

  set isEnabled(enabled: boolean) {
    this.scrollBarMeshVisual.enabled = enabled
  }

  reset() {
    // If the ScrollView has not been found yet due to script execution ordering, then defer the reset for later.
    if (!this.scrollView) {
      return
    }
    this.boundingHeight = this.calculateBoundingHeight()

    this.yOrigin = this.scrollViewSceneObject
      .getTransform()
      .getLocalPosition().y

    const position = this.transform.getLocalPosition()
    position.y = this.yOrigin + this.boundingHeight

    this.transform.setLocalPosition(position)
  }
}

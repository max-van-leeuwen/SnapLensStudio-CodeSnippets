import {CancelSet} from "../../../Utils/animate"
import {
  EdgeSelector,
  EdgeType,
  ScrollView,
  ScrollViewEventArgs,
} from "./ScrollView"

import {InteractorEvent} from "../../../Core/Interactor/InteractorEvent"
import Event from "../../../Utils/Event"
import {averageVec2, smoothDamp, smoothSlide} from "../../../Utils/mathUtils"
import {MovingAverageFilter} from "../../../Utils/MovingAverageFilter"
import {BufferedBoundariesProvider} from "./boundariesProvider/BufferedBoundariesProvider"
import {SceneObjectBoundariesProvider} from "./boundariesProvider/SceneObjectBoundariesProvider"

const TAG = "ScrollProvider"

export type ScrollProviderConfig = {
  scrollArea: SceneObjectBoundariesProvider
  enableScrollInertia: boolean
  enableScrollLimit: boolean
  scrollLimit: number
  enableHorizontalScroll: boolean
  enableVerticalScroll: boolean
  scrollView: ScrollView
  screenTransform: ScreenTransform
  updateEvent: UpdateEvent
}

const VELOCITY_WINDOW_SIZE = 5

const DECELERATE_TIME = 2.0
// The minimum speed to keep moving the content during update frames.
const DECELERATE_MIN_SPEED = 0.1

const ELASTIC_TIME = 0.4
// The minimum distance from content edge to keep moving the content during update frames.
const ELASTIC_MIN_DISTANCE = 0.05

/**
 * Describes the scrolling logic between the content and the container
 */
export class ScrollProvider {
  private onScrollUpdateEvent = new Event<ScrollViewEventArgs>()
  readonly onScrollUpdate = this.onScrollUpdateEvent.publicApi()

  private onSnapUpdateEvent = new Event<ScrollViewEventArgs>()
  readonly onSnapUpdate = this.onSnapUpdateEvent.publicApi()

  private onReadyEvent = new Event()
  readonly onReady = this.onReadyEvent.publicApi()

  private content!: SceneObjectBoundariesProvider
  private contentScrollLimit!: BufferedBoundariesProvider
  private scrollArea = this.config.scrollArea
  private scrollView = this.config.scrollView

  private cancelSet = new CancelSet()

  private isXOverflow = false
  private isYOverflow = false

  private _enableScrollInertia: boolean
  private dragVelocity: vec2 = vec2.zero()
  private inertiaVelocity: vec2 = vec2.zero()

  private dragVelocityFilter = new MovingAverageFilter<vec2>(
    VELOCITY_WINDOW_SIZE,
    vec2.zero,
    averageVec2
  )

  private decelerateTime = DECELERATE_TIME
  private decelerateMinSpeed = DECELERATE_MIN_SPEED

  private elasticTime = ELASTIC_TIME
  private elasticMinDistance = ELASTIC_MIN_DISTANCE

  private _scrollLimit: number
  private enableScrollLimit: boolean

  private _contentLength: number = 0
  private contentOrigin = vec2.zero()

  private isGrabbed: boolean = false

  constructor(private config: ScrollProviderConfig) {
    this._enableScrollInertia = config.enableScrollInertia

    this._scrollLimit = config.scrollLimit
    this.enableScrollLimit = config.enableScrollLimit

    this.config.updateEvent.bind((event) => {
      this.update()
    })
  }

  /**
   * @returns if this class is ready to be used, which means
   * that content is set
   */
  get isReady(): boolean {
    return this.content !== undefined
  }

  /**
   * @returns if the ScrollView will continue scrolling on release
   */
  get enableScrollInertia(): boolean {
    return this._enableScrollInertia
  }

  /**
   * Toggles if the ScrollView should continue scrolling on release
   */
  set enableScrollInertia(enableScrollInertia: boolean) {
    this._enableScrollInertia = enableScrollInertia
  }

  /**
   * @returns what amount of the scroll area should always be occupied
   */
  get scrollLimit(): number {
    return this._scrollLimit
  }

  /**
   * Sets the amount of the scroll area should always be occupied
   */
  set scrollLimit(limit: number) {
    this._scrollLimit = limit
  }

  /**
   * @returns the content position in local space
   */
  get contentPosition(): vec3 {
    return this.content.position
  }

  /**
   * Sets the position of the content in local space
   */
  set contentPosition(position: vec3) {
    this.content.position = position
  }

  /**
   * @returns the content length along the Y-axis
   */
  get contentLength(): number {
    return this._contentLength
  }

  /**
   * Sets the true length of the content in the case of pooling / other non-default use cases
   */
  set contentLength(length: number) {
    this._contentLength = length
  }

  /**
   * Resets the content origin for the purpose of calculating scrollPercentage.
   * Assumes that the ScrollView is currently at the top of content in the pooling use case.
   */
  resetContentOrigin() {
    const originOffset = this.getOffsetToEdge({x: -1, y: 1, type: "Content"})
    this.contentOrigin = new vec2(
      this.contentPosition.x + originOffset.x,
      this.contentPosition.y + originOffset.y
    )
  }

  get overflow() {
    const scrollAreaSize = this.convertLocalUnitsToParentUnits(
      this.scrollArea.size
    )

    const scrollViewHeight = scrollAreaSize.y
    return this.contentLength - scrollViewHeight
  }

  get scrollPercentage() {
    const scrollPercentage =
      MathUtils.clamp(
        -this.contentOrigin.y + this.contentPosition.y,
        0,
        this.overflow
      ) / this.overflow

    return scrollPercentage
  }

  onGrabStart(event: InteractorEvent) {
    this.dragVelocityFilter.clear()
    this.isGrabbed = true
    this.dragVelocity = vec2.zero()
  }

  onGrabEnd(event: InteractorEvent) {
    this.isGrabbed = false
    this.updateInertiaVelocity()
    this.dragVelocity = vec2.zero()
  }

  /**
   * Sets scroll content. Should be called only one time to initialize the content
   * and binds to onStartEvent.
   * @param content - defines content boundaries
   */
  setContent(content: SceneObjectBoundariesProvider): void {
    if (this.content !== undefined) {
      throw new Error("Content is already initialized in ScrollProvider.")
    }

    this.content = content
    this.contentScrollLimit = new BufferedBoundariesProvider(
      this.content,
      Rect.create(0, 0, 0, 0)
    )
    this.recomputeBoundaries()

    // Sometimes this will be called after the user instantiates the ScrollView and sets the contentLength, so we ensure that prior values are respected.
    if (this.contentLength === 0) {
      this.contentLength = this.convertLocalUnitsToParentUnits(
        this.content.size
      ).y
    }

    this.onReadyEvent.invoke()
  }

  /**
   * Recomputes content and scroll area boundaries
   */
  recomputeBoundaries(): void {
    this.content.recomputeStartingBoundaries()
    this.scrollArea.recomputeStartingBoundaries()

    const scrollAreaSize = this.scrollArea.boundaries.getSize()
    const invertedLimit = 1.0 - this.scrollLimit
    this.contentScrollLimit.buffer = Rect.create(
      invertedLimit * scrollAreaSize.x,
      invertedLimit * scrollAreaSize.x,
      invertedLimit * scrollAreaSize.y,
      invertedLimit * scrollAreaSize.y
    )

    this.isYOverflow = this.scrollArea.size.y < this.content.size.y
    this.isXOverflow = this.scrollArea.size.x < this.content.size.x
  }

  /**
   * Scrolls content according to a drag vector, along the enabled axis
   * @param dragVector - 2D vector to move the content
   */
  scrollBy(dragVector: vec2): void {
    if (this.isGrabbed && getDeltaTime() === 0) {
      return
    }

    const deltaX =
      this.scrollView.enableHorizontalScroll && this.isXOverflow
        ? dragVector.x
        : 0
    const deltaY =
      this.scrollView.enableVerticalScroll && this.isYOverflow
        ? dragVector.y
        : 0

    this.content.position = this.content.position.add(
      new vec3(deltaX, deltaY, 0)
    )

    if (this.enableScrollLimit && this.isEdgeInsideScrollArea("ScrollLimit")) {
      this.limitToEdgeInstantly("ScrollLimit")
      this.dragVelocity = vec2.zero()
    } else if (this.isGrabbed) {
      const rawVelocity = new vec2(deltaX, deltaY).uniformScale(
        1 / getDeltaTime()
      )

      this.dragVelocity = this.dragVelocityFilter.filter(rawVelocity, getTime())
    }

    this.onScrollUpdateEvent.invoke({
      contentPosition: this.content.position,
    })
  }

  /**
   * Snaps content to the selected edges
   * @param selectedEdges - Struct that describes the selected edge as an {@link EdgeSelector}
   */
  snapToEdges(selectedEdges: EdgeSelector): void {
    this.content.position = this.content.position.add(
      this.getOffsetToEdge(selectedEdges)
    )
  }

  /**
   * Checks if both inputted content edges are fully visible in the ScrollArea.
   * @param xEdge - 0 if not checking any x-axis edge, 1 for right edge, -1 for left edge.
   * @param yEdge - 0 if not checking any y-axis edge, 1 for top edge, -1 for bottom edge.
   */
  checkContentEdgeFullyVisible(xEdge: 0 | 1 | -1, yEdge: 0 | 1 | -1): boolean {
    let visible = true

    const contentOffset = this.contentOffset

    if (xEdge !== 0) {
      if (xEdge === 1) {
        visible = visible && contentOffset.right >= 0
      } else if (yEdge === -1) {
        visible = visible && contentOffset.left <= 0
      }
    }

    if (yEdge !== 0) {
      if (yEdge === 1) {
        visible = visible && contentOffset.top >= 0
      } else if (yEdge === -1) {
        visible = visible && contentOffset.bottom <= 0
      }
    }

    return visible
  }

  private offsetBetween(a: Rect, b: Rect): Rect {
    return Rect.create(
      a.left - b.left,
      a.right - b.right,
      a.bottom - b.bottom,
      a.top - b.top
    )
  }

  get contentOffset(): Rect {
    return this.offsetBetween(
      this.scrollArea.boundaries,
      this.content.boundaries
    )
  }

  get scrollLimitOffset(): Rect {
    return this.offsetBetween(
      this.scrollArea.boundaries,
      this.contentScrollLimit.boundaries
    )
  }

  // Simulates physics (velocity upon release, friction, elasticity when past edge) when the user is not grabbing the ScrollView.
  private update() {
    if (this.isGrabbed || getDeltaTime() === 0) {
      return
    }

    const initialEdgeSelector = this.selectEdgesInsideScrollArea("Content")
    if (
      this.inertiaVelocity.equal(vec2.zero()) &&
      initialEdgeSelector.x === 0 &&
      initialEdgeSelector.y === 0
    ) {
      return
    }

    const deltaTime = getDeltaTime()

    let currentPosition = this.content.position
    let currentVelocity = this.inertiaVelocity

    // Apply friction to decelerate the contents post-interaction.
    const frictionResults = this.applyFriction(
      currentPosition,
      currentVelocity,
      this.decelerateTime,
      deltaTime
    )

    currentPosition = frictionResults[0]
    currentVelocity = frictionResults[1]

    this.content.position = currentPosition

    // Ensure that the content does not exceed the scroll limit boundaries, zeroing out the velocity if reaching the limit.
    if (this.enableScrollLimit && this.isEdgeInsideScrollArea("ScrollLimit")) {
      this.limitToEdgeInstantly("ScrollLimit")
      currentPosition = this.content.position
      currentVelocity = vec2.zero()
    }

    // Apply elasticity to return the contents within the boundaries.
    const elasticityResults = this.applyElasticity(
      currentPosition,
      currentVelocity,
      this.elasticTime,
      deltaTime
    )

    currentPosition = elasticityResults[0]
    currentVelocity = elasticityResults[1]

    this.content.position = currentPosition

    // If the content is within the ScrollArea boundaries and has a low enough velocity, stop moving the contents to reduce update cost.
    let currentEdgeSelector = this.selectEdgesInsideScrollArea("Content")
    if (
      currentEdgeSelector.x === 0 &&
      Math.abs(this.inertiaVelocity.x) < this.decelerateMinSpeed
    ) {
      currentVelocity.x = 0
    }
    if (
      currentEdgeSelector.y === 0 &&
      Math.abs(this.inertiaVelocity.y) < this.decelerateMinSpeed
    ) {
      currentVelocity.y = 0
    }

    this.inertiaVelocity = currentVelocity

    this.onScrollUpdateEvent.invoke({
      contentPosition: this.content.position,
    })
  }

  /**
   * If there is a edge of the given type inside the scroll area, instantly snap to the edge.
   * @param edgeType The type of edge to snap to.
   */
  private limitToEdgeInstantly(edgeType: EdgeType): void {
    const snapEdges: EdgeSelector = this.selectEdgesInsideScrollArea(edgeType)
    const targetPositionOffset = this.getOffsetToEdge(snapEdges)
    this.content.position = this.content.position.add(targetPositionOffset)
  }

  /**
   * Returns true if any edge of the given type is inside the scroll region, as long as the content is
   * large enough in that dimension to be scrollable.
   * @param edgeType the type of edge to check for
   */
  private isEdgeInsideScrollArea(edgeType: EdgeType) {
    const edgesInsideScrollArea = this.selectEdgesInsideScrollArea(edgeType)
    return (
      (this.isXOverflow && edgesInsideScrollArea.x !== 0) ||
      (this.isYOverflow && edgesInsideScrollArea.y !== 0)
    )
  }

  private selectEdgesInsideScrollArea(edgeType: EdgeType): EdgeSelector {
    const snapEdges: EdgeSelector = {x: 0, y: 0, type: edgeType}
    const offset =
      edgeType === "Content" ? this.contentOffset : this.scrollLimitOffset

    /**
     * only try to snap if there is an overflow in the x dimension
     */
    if (this.isXOverflow) {
      if (offset.left < 0) {
        /*
         * if left border inside the scroll area,
         * snap to left side
         */
        snapEdges.x = -1
      } else if (offset.right > 0) {
        /*
         * if right border inside the scroll area,
         * snap to right side
         */
        snapEdges.x = 1
      }
    }

    /**
     * only try to snap if there is an overflow in the y dimension
     */
    if (this.isYOverflow) {
      if (offset.top > 0) {
        /*
         * if top border inside the scroll area,
         * snap to top side
         */
        snapEdges.y = 1
      } else if (offset.bottom < 0) {
        /*
         * if bottom border inside the scroll area,
         * snap to bottom side
         */
        snapEdges.y = -1
      }
    }

    return snapEdges
  }

  private getOffsetToEdge(selectedEdges: EdgeSelector): vec3 {
    const offset =
      selectedEdges.type === "Content"
        ? this.contentOffset
        : this.scrollLimitOffset

    const targetPositionOffset = vec2.zero()
    if (selectedEdges.x === -1) {
      targetPositionOffset.x = offset.left
    } else if (selectedEdges.x === 1) {
      targetPositionOffset.x = offset.right
    }

    if (selectedEdges.y === 1) {
      targetPositionOffset.y = offset.top
    } else if (selectedEdges.y === -1) {
      targetPositionOffset.y = offset.bottom
    }

    const worldUnitOffset =
      this.convertLocalUnitsToParentUnits(targetPositionOffset)

    return new vec3(worldUnitOffset.x, worldUnitOffset.y, 0)
  }

  private updateInertiaVelocity() {
    let newInertiaVelocity = vec2.zero()

    if (Math.sign(this.dragVelocity.x) === Math.sign(this.inertiaVelocity.x)) {
      newInertiaVelocity.x = this.dragVelocity.x + this.inertiaVelocity.x
    } else {
      newInertiaVelocity.x = this.dragVelocity.x
    }

    if (Math.sign(this.dragVelocity.y) === Math.sign(this.inertiaVelocity.y)) {
      newInertiaVelocity.y = this.dragVelocity.y + this.inertiaVelocity.y
    } else {
      newInertiaVelocity.y = this.dragVelocity.y
    }

    this.inertiaVelocity = newInertiaVelocity
  }

  private applyFriction(
    position: vec3,
    velocity: vec2,
    decelerateTime: number,
    deltaTime: number
  ): [vec3, vec2] {
    const edgeSelector = this.selectEdgesInsideScrollArea("Content")

    // If the content is within the X-axis bounds, move the contents along the X-axis and apply friction.
    if (this.scrollView.enableHorizontalScroll && edgeSelector.x === 0) {
      const smoothResults = smoothSlide(
        position.x,
        velocity.x,
        decelerateTime,
        deltaTime
      )
      position.x = smoothResults[0]
      velocity.x = smoothResults[1]
    }

    // If the content is within the Y-axis bounds, move the contents along the Y-axis and apply friction.
    if (this.scrollView.enableVerticalScroll && edgeSelector.y === 0) {
      const smoothResults = smoothSlide(
        position.y,
        velocity.y,
        decelerateTime,
        deltaTime
      )
      position.y = smoothResults[0]
      velocity.y = smoothResults[1]
    }

    return [position, velocity]
  }

  private applyElasticity(
    position: vec3,
    velocity: vec2,
    elasticTime: number,
    deltaTime: number
  ): [vec3, vec2] {
    const edgeSelector = this.selectEdgesInsideScrollArea("Content")
    const contentOffset = this.getOffsetToEdge(edgeSelector)

    // If the content is past the X-axis bounds, return the content closer to the boundary.
    if (this.scrollView.enableHorizontalScroll && edgeSelector.x !== 0) {
      const contentLimitX = position.x + contentOffset.x

      const smoothResults = smoothDamp(
        position.x,
        contentLimitX,
        velocity.x,
        elasticTime,
        deltaTime
      )
      position.x = smoothResults[0]
      velocity.x = smoothResults[1]

      // If the content is close enough to the bounds, place the content exactly on the boundary to reduce update cost.
      if (Math.abs(position.x - contentLimitX) < this.elasticMinDistance) {
        position.x = contentLimitX
        velocity.x = 0
      }
    }

    // If the content is past the Y-axis bounds, return the content closer to the boundary.
    if (this.scrollView.enableVerticalScroll && edgeSelector.y !== 0) {
      const contentLimitY = position.y + contentOffset.y

      const smoothResults = smoothDamp(
        position.y,
        contentLimitY,
        velocity.y,
        elasticTime,
        deltaTime
      )
      position.y = smoothResults[0]
      velocity.y = smoothResults[1]

      // If the content is close enough to the bounds, place the content exactly on the boundary to reduce update cost.
      if (Math.abs(position.y - contentLimitY) < this.elasticMinDistance) {
        position.y = contentLimitY
        velocity.y = 0
      }
    }

    return [position, velocity]
  }

  /**
   * Converts the offset (normalized -1 to 1) to local units relative to the ScrollView canvas.
   */
  public convertLocalOffsetToParentOffset(offset: Rect): Rect {
    const bottomLeftCorner = new vec2(offset.left, offset.bottom)
    const topRightCorner = new vec2(offset.right, offset.top)

    const bottomLeftOffsetWorld =
      this.convertLocalUnitsToParentUnits(bottomLeftCorner)
    const topRightOffsetWorld =
      this.convertLocalUnitsToParentUnits(topRightCorner)

    return Rect.create(
      bottomLeftOffsetWorld.x,
      topRightOffsetWorld.x,
      bottomLeftOffsetWorld.y,
      topRightOffsetWorld.y
    )
  }

  /**
   * Converts local units (normalized -1 to 1) to world units relative to the ScrollView canvas.
   */
  private convertLocalUnitsToWorldUnits(localUnits: vec2): vec2 {
    const origin = this.config.screenTransform.localPointToWorldPoint(
      vec2.zero()
    )

    const invertQuat = this.config.screenTransform
      .getSceneObject()
      .getTransform()
      .getWorldRotation()
      .invert()

    const worldUnits = this.config.screenTransform
      .localPointToWorldPoint(localUnits)
      .sub(origin)

    return invertQuat.multiplyVec3(worldUnits)
  }

  /**
   * Converts local units (-1 to 1) to parent units relative to the ScrollView canvas.
   */
  public convertLocalUnitsToParentUnits(localUnits: vec2): vec2 {
    const worldUnits = this.convertLocalUnitsToWorldUnits(localUnits)

    return new vec3(worldUnits.x, worldUnits.y, 0).div(
      this.config.screenTransform.getTransform().getWorldScale()
    )
  }
}

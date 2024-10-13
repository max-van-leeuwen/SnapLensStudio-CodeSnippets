import Event, {PublicApi} from "../../Utils/Event"
import NativeLogger from "../../Utils/NativeLogger"
import {
  PinchDetectionSelection,
  PinchDetector,
} from "./GestureProvider/PinchDetection/PinchDetector"
import {JointNode, JOINT_HIERARCHY} from "./Joints"

import WorldCameraFinderProvider from "../CameraProvider/WorldCameraFinderProvider"
import {BaseHand} from "./BaseHand"
import DefaultHandTrackingAssetProvider from "./DefaultHandTrackingAssetProvider"
import GestureModuleProvider from "./GestureProvider/GestureModuleProvider"
import PalmTapDetector from "./GestureProvider/PalmTapDetection/PalmTapDetector"
import {PalmTapDetectionEvent} from "./GestureProvider/PalmTapDetectionEvent"
import {HandType} from "./HandType"
import {HandVisuals} from "./HandVisuals"
import {Keypoint} from "./Keypoint"
import {LandmarkName} from "./LandmarkNames"
import {TargetingData} from "./TargetingData"

export type BaseHandConfig = {
  handType: HandType
  isDominantHand: boolean
}

export enum TrackingEvent {
  OnTrackingStarted = "OnTrackingStarted",
  OnTrackingLost = "OnTrackingLost",
}

const TAG = "TrackedHand"
const HAND_FACING_THRESHOLD = 40.0
const POINTING_PITCH_THRESHOLD = -60.0

export type OrientationVectors = {
  forward: vec3
  right: vec3
  up: vec3
  cameraForward: vec3
}

/**
 * Manages a tracked hand, instantiates fingers and wrists.
 * Also manages the {@link ObjectTracking3D} and creates
 * the needed scene object hierarchy to achieve hand mesh visualization as well as landmarks tracking
 */
export default class TrackedHand implements BaseHand {
  // Dependency injection
  private handTrackingAssetProvider: DefaultHandTrackingAssetProvider =
    DefaultHandTrackingAssetProvider.getInstance()
  protected sceneObjectManager: ScriptScene = global.scene
  private worldCamera: WorldCameraFinderProvider =
    WorldCameraFinderProvider.getInstance()
  private gestureModuleProvider: GestureModuleProvider =
    GestureModuleProvider.getInstance()

  // Native Logging
  private log = new NativeLogger(TAG)

  // SceneObject
  private _enabled = true
  private isDestroyed = false
  private ownerSceneObject: SceneObject

  // Events
  private onEnabledChangedEvent = new Event<boolean>()
  readonly onEnabledChanged = this.onEnabledChangedEvent.publicApi()

  private onHandFoundEvent = new Event()
  readonly onHandFound = this.onHandFoundEvent.publicApi()

  private onHandLostEvent = new Event()
  readonly onHandLost = this.onHandLostEvent.publicApi()

  readonly onPinchDown: PublicApi<void>
  readonly onPinchUp: PublicApi<void>
  readonly onPinchCancel: PublicApi<void>

  // Tracking
  private objectTracking3DComponent: ObjectTracking3D

  // Keypoints
  private keypoints = new Map<string, Keypoint>()
  private handVisuals?: HandVisuals
  private allPoints: Keypoint[] = []
  private thumbFingerPoints: Keypoint[] = []
  private indexFingerPoints: Keypoint[] = []
  private middleFingerPoints: Keypoint[] = []
  private ringFingerPoints: Keypoint[] = []
  private pinkyFingerPoints: Keypoint[] = []

  // Pinch
  private pinchDetector: PinchDetector

  // Palm Tap
  private palmTapDetector?: PalmTapDetector

  private _isDominantHand = this.config.isDominantHand

  private _targetingData: TargetingData | null = null

  constructor(private config: BaseHandConfig) {
    this.ownerSceneObject = this.sceneObjectManager.createSceneObject(
      this.handType === "left" ? "LeftHandModelOwner" : "RightHandModelOwner"
    )
    this.ownerSceneObject.setParent(
      this.worldCamera.getComponent().getSceneObject()
    )

    this.objectTracking3DComponent = this.ownerSceneObject.createComponent(
      "Component.ObjectTracking3D"
    )

    if (this.objectTracking3DComponent === undefined) {
      throw new Error("Failed to create Component.ObjectTracking3D")
    }

    this.objectTracking3DComponent.trackingAsset =
      this.handTrackingAssetProvider.get(this.config.handType)
    this.objectTracking3DComponent.objectIndex = 0
    this.objectTracking3DComponent.trackingMode =
      ObjectTracking3D.TrackingMode.Attachment

    const logObjectTrackingEvent = (eventName: TrackingEvent) => {
      this.log.d(
        `Received event from ObjectTracking3D: handType: ${this.config.handType}, eventType: ${eventName}`
      )
    }
    this.objectTracking3DComponent.onTrackingStarted = () => {
      logObjectTrackingEvent(TrackingEvent.OnTrackingStarted)
      this.onHandFoundEvent.invoke()
      this.log.v("HandEvent : " + "Hand Found Event")
    }
    this.objectTracking3DComponent.onTrackingLost = () => {
      logObjectTrackingEvent(TrackingEvent.OnTrackingLost)
      this.onHandLostEvent.invoke()
      this.log.v("HandEvent : " + "Hand Lost Event")
    }

    this.attachJoints(JOINT_HIERARCHY.children)

    this.setKeypointCollections()

    this.pinchDetector = new PinchDetector({
      handType: this.config.handType,
      thumbTip: this.thumbTip,
      indexTip: this.indexTip,
      onHandLost: this.onHandLost,
      isTracked: () => {
        return this.isTracked()
      },
      pinchDetectionSelection: PinchDetectionSelection.LensCoreML,
    })
    this.onPinchDown = this.pinchDetector.onPinchDown
    this.onPinchUp = this.pinchDetector.onPinchUp
    this.onPinchCancel = this.pinchDetector.onPinchCancel

    const gestureModule = this.gestureModuleProvider.getGestureModule()

    try {
      if (gestureModule !== undefined) {
        const gestureHandType =
          this.handType === "right"
            ? GestureModule.HandType.Right
            : GestureModule.HandType.Left
        gestureModule.getTargetingDataEvent(gestureHandType).add((args) => {
          const rayOriginInWorld: vec3 = args.rayOriginInWorld
          const rayDirectionInWorld: vec3 = args.rayDirectionInWorld

          this._targetingData = {
            targetingDirectionInWorld: rayDirectionInWorld,
            targetingLocusInWorld: rayOriginInWorld,
          }
          this.log.v(
            "HandEvent : " +
              "Targeting Data Event" +
              " rayOriginInWorld: " +
              rayOriginInWorld +
              " rayDirectionInWorld: " +
              rayDirectionInWorld
          )
        })
      }
    } catch (error) {
      this.log.e(`Error subscribing to targeting ray event: ${error}`)
    }

    try {
      if (this.handType === "right") {
        this.palmTapDetector = new PalmTapDetector(GestureModule.HandType.Right)
      }
    } catch (error) {
      this.log.w("PalmTapDetector is not supported")
    }
  }

  get enabled(): boolean {
    return this._enabled
  }

  /** @inheritdoc */
  setEnabled(isEnabled: boolean) {
    if (this._enabled === isEnabled) {
      return
    }

    this._enabled = isEnabled
    this.objectTracking3DComponent.enabled = this.enabled
    this.onEnabledChangedEvent.invoke(this._enabled)
    this.log.v(
      "HandEvent : " + "Hand Enabled Changed Event" + " to " + this._enabled
    )
  }

  /** @inheritdoc */
  isFacingCamera(): boolean {
    if (!this.isTracked()) {
      return false
    }

    const facingCameraAngle = this.getFacingCameraAngle()
    return Boolean(
      facingCameraAngle !== null && facingCameraAngle < HAND_FACING_THRESHOLD
    )
  }

  /** @inheritdoc */
  isInTargetingPose(): boolean {
    if (!this.isTracked()) {
      return false
    }

    const pitchAngle = this.getPalmPitchAngle()

    return (
      !this.isFacingCamera() &&
      pitchAngle !== null &&
      pitchAngle > POINTING_PITCH_THRESHOLD
    )
  }

  /** @inheritdoc */
  getPinchDirection(): quat | null {
    if (!this.isTracked()) {
      return null
    }

    const thumbTipPosition = this.thumbTip.position
    const thumbKnucklePosition = this.thumbKnuckle.position
    const indexMidJointPosition = this.indexMidJoint.position

    const forward = thumbTipPosition.sub(thumbKnucklePosition).normalize()
    const right = indexMidJointPosition.sub(thumbKnucklePosition).normalize()
    const up =
      this.handType === "right" ? right.cross(forward) : forward.cross(right)

    return quat.lookAt(forward, up)
  }

  private getHandOrientation(): OrientationVectors {
    /**
     * 1. Create a right vector between the index and middle distals
     * 2. Create a forward vector between the wrist and middle distal
     * 3. Derive an up vector from the previous two vectors
     */
    const handRightVector = this.indexMidJoint.position
      .sub(this.middleMidJoint.position)
      .normalize()
    const handForwardVector = this.middleMidJoint.position
      .sub(this.wrist.position)
      .normalize()
    const handUpVector = handRightVector.cross(handForwardVector)

    const handToCameraVector = this.worldCamera
      .getWorldPosition()
      .sub(this.wrist.position)
      .normalize()

    return {
      forward: handForwardVector,
      right: handRightVector,
      up: handUpVector,
      cameraForward: handToCameraVector,
    }
  }

  /** @inheritdoc */
  getFacingCameraAngle(): number | null {
    if (!this.isTracked()) {
      return null
    }

    /**
     * Apply the camera to wrist direction against the derived up vector to get facing angle
     */
    const handOrientationVectors = this.getHandOrientation()
    const dotHandCamera = handOrientationVectors.up.dot(
      handOrientationVectors.cameraForward
    )

    const angle =
      MathUtils.RadToDeg *
      Math.acos(
        this.config.handType === "right" ? dotHandCamera : -dotHandCamera
      )

    return angle
  }

  /** @inheritdoc */
  getPalmPitchAngle(): number | null {
    if (!this.isTracked()) {
      return null
    }

    /**
     * Compare the hand's forward direction to world up
     */
    const handOrientationVectors = this.getHandOrientation()
    const dotHandUp = handOrientationVectors.forward.dot(vec3.up())
    const angle = 90 - MathUtils.RadToDeg * Math.acos(dotHandUp)

    return angle
  }

  /** @inheritdoc */
  getPalmCenter(): vec3 | null {
    if (!this.isTracked()) {
      return null
    }

    return this.indexKnuckle.position
      .add(this.pinkyKnuckle.position)
      .add(this.middleToWrist.position)
      .uniformScale(1.0 / 3.0)
  }

  /** @inheritdoc */
  get wrist(): Keypoint {
    return this.getKeypoint(LandmarkName.WRIST)
  }

  /** @inheritdoc */
  get thumbProximal(): Keypoint {
    return this.thumbToWrist
  }

  /** @inheritdoc */
  get thumbToWrist(): Keypoint {
    return this.getKeypoint(LandmarkName.WRIST_TO_THUMB)
  }

  /** @inheritdoc */
  get thumbIntermediate(): Keypoint {
    return this.thumbBaseJoint
  }

  /** @inheritdoc */
  get thumbBaseJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.THUMB_0)
  }

  /** @inheritdoc */
  get thumbDistal(): Keypoint {
    return this.thumbKnuckle
  }

  /** @inheritdoc */
  get thumbKnuckle(): Keypoint {
    return this.getKeypoint(LandmarkName.THUMB_1)
  }

  /** @inheritdoc */
  get thumbPad(): Keypoint {
    return this.thumbMidJoint
  }

  /** @inheritdoc */
  get thumbMidJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.THUMB_2)
  }

  /** @inheritdoc */
  get thumbTip(): Keypoint {
    return this.getKeypoint(LandmarkName.THUMB_3)
  }

  /** @inheritdoc */
  get indexProximal(): Keypoint {
    return this.indexToWrist
  }

  /** @inheritdoc */
  get indexToWrist(): Keypoint {
    return this.getKeypoint(LandmarkName.WRIST_TO_INDEX)
  }

  /** @inheritdoc */
  get indexIntermediate(): Keypoint {
    return this.indexKnuckle
  }

  /** @inheritdoc */
  get indexKnuckle(): Keypoint {
    return this.getKeypoint(LandmarkName.INDEX_0)
  }

  /** @inheritdoc */
  get indexDistal(): Keypoint {
    return this.indexMidJoint
  }

  /** @inheritdoc */
  get indexMidJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.INDEX_1)
  }

  /** @inheritdoc */
  get indexPad(): Keypoint {
    return this.indexUpperJoint
  }

  /** @inheritdoc */
  get indexUpperJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.INDEX_2)
  }

  /** @inheritdoc */
  get indexTip(): Keypoint {
    return this.getKeypoint(LandmarkName.INDEX_3)
  }

  /** @inheritdoc */
  get middleProximal(): Keypoint {
    return this.middleToWrist
  }

  /** @inheritdoc */
  get middleToWrist(): Keypoint {
    return this.getKeypoint(LandmarkName.WRIST_TO_MIDDLE)
  }

  /** @inheritdoc */
  get middleIntermediate(): Keypoint {
    return this.middleKnuckle
  }

  /** @inheritdoc */
  get middleKnuckle(): Keypoint {
    return this.getKeypoint(LandmarkName.MIDDLE_0)
  }

  /** @inheritdoc */
  get middleDistal(): Keypoint {
    return this.middleMidJoint
  }

  /** @inheritdoc */
  get middleMidJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.MIDDLE_1)
  }

  /** @inheritdoc */
  get middlePad(): Keypoint {
    return this.middleUpperJoint
  }

  /** @inheritdoc */
  get middleUpperJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.MIDDLE_2)
  }

  /** @inheritdoc */
  get middleTip(): Keypoint {
    return this.getKeypoint(LandmarkName.MIDDLE_3)
  }

  /** @inheritdoc */
  get ringProximal(): Keypoint {
    return this.ringToWrist
  }

  /** @inheritdoc */
  get ringToWrist(): Keypoint {
    return this.getKeypoint(LandmarkName.WRIST_TO_RING)
  }

  /** @inheritdoc */
  get ringIntermediate(): Keypoint {
    return this.ringKnuckle
  }

  /** @inheritdoc */
  get ringKnuckle(): Keypoint {
    return this.getKeypoint(LandmarkName.RING_0)
  }

  /** @inheritdoc */
  get ringDistal(): Keypoint {
    return this.ringMidJoint
  }

  /** @inheritdoc */
  get ringMidJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.RING_1)
  }

  /** @inheritdoc */
  get ringPad(): Keypoint {
    return this.ringUpperJoint
  }

  /** @inheritdoc */
  get ringUpperJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.RING_2)
  }

  /** @inheritdoc */
  get ringTip(): Keypoint {
    return this.getKeypoint(LandmarkName.RING_3)
  }

  /** @inheritdoc */
  get pinkyProximal(): Keypoint {
    return this.pinkyToWrist
  }

  /** @inheritdoc */
  get pinkyToWrist(): Keypoint {
    return this.getKeypoint(LandmarkName.WRIST_TO_PINKY)
  }

  /** @inheritdoc */
  get pinkyIntermediate(): Keypoint {
    return this.pinkyKnuckle
  }
  /** @inheritdoc */
  get pinkyKnuckle(): Keypoint {
    return this.getKeypoint(LandmarkName.PINKY_0)
  }

  /** @inheritdoc */
  get pinkyDistal(): Keypoint {
    return this.pinkyMidJoint
  }

  /** @inheritdoc */
  get pinkyMidJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.PINKY_1)
  }

  /** @inheritdoc */
  get pinkyPad(): Keypoint {
    return this.pinkyUpperJoint
  }

  /** @inheritdoc */
  get pinkyUpperJoint(): Keypoint {
    return this.getKeypoint(LandmarkName.PINKY_2)
  }

  /** @inheritdoc */
  get pinkyTip(): Keypoint {
    return this.getKeypoint(LandmarkName.PINKY_3)
  }

  /** @inheritdoc */
  get thumbFinger(): Keypoint[] {
    return this.thumbFingerPoints
  }

  /** @inheritdoc */
  get indexFinger(): Keypoint[] {
    return this.indexFingerPoints
  }

  /** @inheritdoc */
  get middleFinger(): Keypoint[] {
    return this.middleFingerPoints
  }

  /** @inheritdoc */
  get ringFinger(): Keypoint[] {
    return this.ringFingerPoints
  }

  /** @inheritdoc */
  get pinkyFinger(): Keypoint[] {
    return this.pinkyFingerPoints
  }

  /** @inheritdoc */
  get points(): Keypoint[] {
    return this.allPoints
  }

  /** @inheritdoc */
  get handType(): HandType {
    return this.config.handType
  }

  /** @inheritdoc */
  get isDominantHand(): boolean {
    return this._isDominantHand
  }

  /** @inheritdoc */
  get objectTracking3D(): ObjectTracking3D {
    return this.objectTracking3DComponent
  }

  /** @inheritdoc */
  get targetingData(): TargetingData | null {
    return this._targetingData
  }

  /** @inheritdoc */
  isTracked(): boolean {
    return this.objectTracking3DComponent.isTracking()
  }

  /** @inheritdoc */
  getSceneObject(): SceneObject {
    return this.ownerSceneObject
  }

  /** @inheritdoc */
  setIsDominantHand(isDominantHand: boolean): void {
    this._isDominantHand = isDominantHand
  }

  /** @inheritdoc */
  isPinching(): boolean {
    return this.pinchDetector.isPinching()
  }

  /** @inheritdoc */
  isTapping(): PalmTapDetectionEvent {
    if (this.palmTapDetector === undefined) {
      return {
        state: "unsupported",
      }
    } else {
      return {
        state: "available",
        data: {isTapping: this.palmTapDetector.isTapping},
      }
    }
  }

  /** @inheritdoc */
  getPinchStrength(): number | null {
    if (!this.isTracked()) {
      return null
    }

    return this.pinchDetector.getPinchStrength()
  }

  /** @inheritdoc */
  setTrackingMode(trackingMode: ObjectTracking3D.TrackingMode): void {
    this.objectTracking3DComponent.trackingMode = trackingMode
  }

  /** @inheritdoc */
  getHandVisuals(): HandVisuals | null {
    return this.handVisuals ?? null
  }

  /** @inheritdoc */
  attachHandVisuals(handVisuals: HandVisuals): void {
    this.handVisuals = handVisuals
    this.objectTracking3DComponent.trackingMode =
      ObjectTracking3D.TrackingMode.ProportionsAndPose
    this.handVisuals.root.setParent(this.ownerSceneObject)

    // Wrist
    this.wrist.addAttachmentPoint(this.handVisuals.wrist)

    // Thumb
    this.thumbToWrist.addAttachmentPoint(this.handVisuals.thumbToWrist)
    this.thumbBaseJoint.addAttachmentPoint(this.handVisuals.thumbBaseJoint)
    this.thumbKnuckle.addAttachmentPoint(this.handVisuals.thumbKnuckle)
    this.thumbMidJoint.addAttachmentPoint(this.handVisuals.thumbMidJoint)
    this.thumbTip.addAttachmentPoint(this.handVisuals.thumbTip)

    // Index
    this.indexToWrist.addAttachmentPoint(this.handVisuals.indexToWrist)
    this.indexKnuckle.addAttachmentPoint(this.handVisuals.indexKnuckle)
    this.indexMidJoint.addAttachmentPoint(this.handVisuals.indexMidJoint)
    this.indexUpperJoint.addAttachmentPoint(this.handVisuals.indexUpperJoint)
    this.indexTip.addAttachmentPoint(this.handVisuals.indexTip)

    // Middle
    this.middleToWrist.addAttachmentPoint(this.handVisuals.middleToWrist)
    this.middleKnuckle.addAttachmentPoint(this.handVisuals.middleKnuckle)
    this.middleMidJoint.addAttachmentPoint(this.handVisuals.middleMidJoint)
    this.middleUpperJoint.addAttachmentPoint(this.handVisuals.middleUpperJoint)
    this.middleTip.addAttachmentPoint(this.handVisuals.middleTip)

    // Ring
    this.ringToWrist.addAttachmentPoint(this.handVisuals.ringToWrist)
    this.ringKnuckle.addAttachmentPoint(this.handVisuals.ringKnuckle)
    this.ringMidJoint.addAttachmentPoint(this.handVisuals.ringMidJoint)
    this.ringUpperJoint.addAttachmentPoint(this.handVisuals.ringUpperJoint)
    this.ringTip.addAttachmentPoint(this.handVisuals.ringTip)

    // Pinky
    this.pinkyToWrist.addAttachmentPoint(this.handVisuals.pinkyToWrist)
    this.pinkyKnuckle.addAttachmentPoint(this.handVisuals.pinkyKnuckle)
    this.pinkyMidJoint.addAttachmentPoint(this.handVisuals.pinkyMidJoint)
    this.pinkyUpperJoint.addAttachmentPoint(this.handVisuals.pinkyUpperJoint)
    this.pinkyTip.addAttachmentPoint(this.handVisuals.pinkyTip)
  }

  /** @inheritdoc */
  detachHandVisuals(handVisuals: HandVisuals): void {
    if (this.handVisuals !== handVisuals) {
      return
    }

    this.objectTracking3DComponent.trackingMode =
      ObjectTracking3D.TrackingMode.Attachment
    this.keypoints.forEach((keypoint) => keypoint.clearAttachmentPoint())
    this.handVisuals = undefined
  }

  /**
   * Destroys the hand and associated keypoints
   */
  destroy(): void {
    if (this.isDestroyed) {
      return
    }

    this.ownerSceneObject.destroy()
    this.isDestroyed = true
  }

  private attachJoints(children: JointNode[]) {
    for (const joint of children) {
      this.keypoints.set(
        joint.name,
        new Keypoint(joint.name, this.objectTracking3DComponent)
      )
      this.attachJoints(joint.children)
    }
  }

  private getKeypoint(landmarkName: LandmarkName): Keypoint {
    const keypoint = this.keypoints.get(landmarkName as string)
    if (!keypoint) {
      throw new Error(`Keypoint ${landmarkName} is not supported.`)
    }

    return keypoint
  }

  private setKeypointCollections() {
    this.thumbFingerPoints.push(
      this.thumbToWrist,
      this.thumbBaseJoint,
      this.thumbKnuckle,
      this.thumbMidJoint,
      this.thumbTip
    )
    this.indexFingerPoints.push(
      this.indexToWrist,
      this.indexKnuckle,
      this.indexMidJoint,
      this.indexUpperJoint,
      this.indexTip
    )
    this.middleFingerPoints.push(
      this.middleToWrist,
      this.middleKnuckle,
      this.middleMidJoint,
      this.middleUpperJoint,
      this.middleTip
    )
    this.ringFingerPoints.push(
      this.ringToWrist,
      this.ringKnuckle,
      this.ringMidJoint,
      this.ringUpperJoint,
      this.ringTip
    )
    this.pinkyFingerPoints.push(
      this.pinkyToWrist,
      this.pinkyKnuckle,
      this.pinkyMidJoint,
      this.pinkyUpperJoint,
      this.pinkyTip
    )
    this.allPoints.push(
      ...this.thumbFingerPoints,
      ...this.indexFingerPoints,
      ...this.middleFingerPoints,
      ...this.ringFingerPoints,
      ...this.pinkyFingerPoints
    )
  }
}

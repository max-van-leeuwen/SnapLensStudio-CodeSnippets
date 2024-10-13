import WorldCameraFinderProvider from "../../../Providers/CameraProvider/WorldCameraFinderProvider"
import {BaseHand} from "../../../Providers/HandInputData/BaseHand"
import {HandInputData} from "../../../Providers/HandInputData/HandInputData"
import {HandType} from "../../../Providers/HandInputData/HandType"
import {HandVisuals} from "../../../Providers/HandInputData/HandVisuals"
import TrackedHand from "../../../Providers/HandInputData/TrackedHand"
import SIKLogLevelProvider from "../../../Providers/InteractionConfigurationProvider/SIKLogLevelProvider"
import {SIK} from "../../../SIK"
import animate, {CancelSet} from "../../../Utils/animate"
import {LensConfig} from "../../../Utils/LensConfig"
import {GlowEffectViewModel} from "./GlowEffectViewModel"

const TAG = "GlowEffectView"

const BILLBOARD_ANIMATION_DURATION_SECS = 0.033

const GLOW_QUAD_WORLD_SCALE = new vec3(0.3, 0.3, 0.3)
const PINCH_BASE_BONUS_RATIO = 0.8
const MAX_HAND_MESH_MATERIAL_BRIGHTNESS = 0.35
const PINCH_ANIMATION_DURATION = 0.3

const PINCH_STRENGTH_NEAR_PINCH_EXIT_THRESHOLD = 0.2
const PINCH_STRENGTH_NEAR_PINCH_ENTER_THRESHOLD = 0.5

/*
 * This determines what we consider to be "palm facing the camera", so a smaller value
 * means that your palm would need to be to be looking more "directly" at the camera
 * for us to consider it to be "facing the camera"
 */
const HAND_FACING_CAMERA_THRESHOLD_DEGREES = 90

const VEC3_UP = vec3.up()

export type GlowEffectViewConfig = {
  handType: HandType
  unitPlaneMesh: RenderMesh
  tipGlowMaterial: Material
  idleColor: vec4
  pinchDownColor: vec4
  tapProximityThreshold: number
  pinchTexture: Texture
  tapTexture: Texture
  tipGlowRenderOrder: number
}

/**
 * GlowEffectView controls the glow effect that happens when pinching and tapping.
 *
 * I did not extend View class because while this q
 * acts like a View in the sense that it is messing with UI/visuals, it does so through SceneObjects and textures which are passed
 * in as parameters, instead of needing its own SceneObject hierarchy to be added.
 */
export class GlowEffectView {
  private sikLogLevelProvider = SIKLogLevelProvider.getInstance()

  private updateDispatcher = LensConfig.getInstance().updateDispatcher
  private handProvider: HandInputData = SIK.HandInputData

  private tapGlowEnabled: boolean =
    this.handProvider.getDominantHand().handType === this.config.handType
  private hand: TrackedHand = this.handProvider.getHand(
    this.config.handType as HandType
  )
  private handVisuals: HandVisuals = this.hand.getHandVisuals()
  private indexTipSceneObject: SceneObject = this.handVisuals.indexTip
  private thumbTipSceneObject: SceneObject = this.handVisuals.thumbTip

  // handToTap is the hand NOT passed to this class
  private handToTap: TrackedHand = this.handProvider.getHand(
    this.config.handType === "left" ? "right" : "left"
  )

  private camera = WorldCameraFinderProvider.getInstance()

  /*
   * Pinch glow effect uses a quad with glow material and texture on index
   * and thumb tip, both billboarded towards the camera
   */
  private indexQuadSceneObject: SceneObject = this.setupTipQuadSceneObject(
    this.indexTipSceneObject,
    "indexTipQuadSceneObject"
  )
  private indexQuadTransform: Transform =
    this.indexQuadSceneObject.getTransform()
  private thumbQuadSceneObject: SceneObject = this.setupTipQuadSceneObject(
    this.thumbTipSceneObject,
    "thumbTipQuadSceneObject"
  )
  private thumbQuadTransform: Transform =
    this.thumbQuadSceneObject.getTransform()

  /**
   * Pinch glow effect manipulates these materials to create the "glow"
   */
  private tipGlowMaterialIndexTip: Material =
    this.indexQuadSceneObject.getComponent("Component.RenderMeshVisual")
      .mainMaterial
  private tipGlowMaterialThumbTip: Material =
    this.thumbQuadSceneObject.getComponent("Component.RenderMeshVisual")
      .mainMaterial

  private indexGlowBonusCancelSet = new CancelSet()
  private indexGlowStrengthCancelSet = new CancelSet()

  private thumbGlowBonusCancelSet = new CancelSet()
  private thumbGlowStrengthCancelSet = new CancelSet()

  private indexGlowBonus = 0
  private indexGlowBase = 0
  private thumbGlowBonus = 0
  private thumbGlowBase = 0

  private isInPalmUIMode = false
  private isInTargetingMode = false
  private isInNearPinchMode = false

  private glowEffectViewModel: GlowEffectViewModel = new GlowEffectViewModel({
    handType: this.config.handType as HandType,
    logLevel: this.sikLogLevelProvider.logLevel,
  })

  // Cached value from API .enabled calls
  private _enabled: boolean = true

  constructor(private config: GlowEffectViewConfig) {
    // Connect to ViewModel events. This is how the glow effect will be driven
    this.glowEffectViewModel.animateIndexGlowBase.add(
      (animateGlowBaseUp: boolean) => {
        this.animateIndexGlowBase(animateGlowBaseUp)
      }
    )
    this.glowEffectViewModel.animateIndexGlowBonus.add(
      (animateGlowBonusUp: boolean) => {
        this.animateIndexGlowBonus(animateGlowBonusUp)
      }
    )
    this.glowEffectViewModel.animateThumbGlowBase.add(
      (animateGlowBaseUp: boolean) => {
        this.animateThumbGlowBase(animateGlowBaseUp)
      }
    )
    this.glowEffectViewModel.animateThumbGlowBonus.add(
      (animateGlowBonusUp: boolean) => {
        this.animateThumbGlowBonus(animateGlowBonusUp)
      }
    )
    this.glowEffectViewModel.tapModeChanged((tapModeEntered: boolean) => {
      if (tapModeEntered === true) {
        this.handVisuals.handMesh.mainPass["handGlowTex"] =
          this.config.tapTexture
      } else {
        this.handVisuals.handMesh.mainPass["handGlowTex"] =
          this.config.pinchTexture
      }
    })

    // Set up initial conditions
    this.setIsInPalmUiMode(this.calculateIsInPalmUIMode())
    this.setIsInTargetingMode(this.calculateIsInTargetingMode())

    this.setupPinchEvents()
    this.updateDispatcher
      .createUpdateEvent("GlowEffectViewUpdateEvent")
      .bind(() => {
        // If disabled via API, do not update the glow.
        if (!this._enabled) {
          return
        }
        if (this.hand.getPinchStrength() === 0) {
          if (this.indexQuadSceneObject.enabled) {
            this.indexQuadSceneObject.enabled = false
            this.thumbQuadSceneObject.enabled = false
          }
        } else {
          const cameraPosition = this.camera.getWorldPosition()
          this.indexQuadTransform.setWorldRotation(
            quat.lookAt(
              cameraPosition.sub(this.indexQuadTransform.getWorldPosition()),
              VEC3_UP
            )
          )
          this.thumbQuadTransform.setWorldRotation(
            quat.lookAt(
              cameraPosition.sub(this.thumbQuadTransform.getWorldPosition()),
              VEC3_UP
            )
          )
          if (!this.indexQuadSceneObject.enabled) {
            this.indexQuadSceneObject.enabled = true
            this.thumbQuadSceneObject.enabled = true
          }
        }
        this.setIsInPalmUiMode(this.calculateIsInPalmUIMode())
        this.setIsInTargetingMode(this.calculateIsInTargetingMode())
        this.setIsInNearPinchMode(this.calculateIsInNearPinchMode())
      })
    this.updateDispatcher
      .createLateUpdateEvent("GlowEffectViewLateUpdateEvent")
      .bind(() => {
        // If disabled via API, do not update the glow.
        if (!this._enabled) {
          return
        }
        this.updateMaterial()
      })
  }

  /**
   * Enable/disable the SceneObject's created by this class
   * @param isEnabled boolean representing whether to enable or disable this class
   */
  set enabled(isEnabled: boolean) {
    this._enabled = isEnabled
    this.indexQuadSceneObject.enabled = isEnabled
    this.thumbQuadSceneObject.enabled = isEnabled
  }

  /**
   * Clean up the SceneObject's created by PinchGlow
   */
  destroy(): void {
    this.indexQuadSceneObject.destroy()
    this.thumbQuadSceneObject.destroy()
  }

  private setupTipQuadSceneObject(
    parentSceneObject: SceneObject,
    sceneObjectName: string
  ): SceneObject {
    // Create the quad SceneObject to hold glow material and texture
    const quadSceneObject = global.scene.createSceneObject(sceneObjectName)
    quadSceneObject.setParent(parentSceneObject)
    quadSceneObject.getTransform().setWorldScale(GLOW_QUAD_WORLD_SCALE)

    const quadComponent = quadSceneObject.createComponent(
      "Component.RenderMeshVisual"
    )
    quadComponent.mesh = this.config.unitPlaneMesh
    // Glow quad render order 10,000 in spec: https://snapchat.quip.com/zGdoAmxwxtbL#temp:C:UOBb2c2ed5699bc4e5b91dafdcc3
    quadComponent.setRenderOrder(this.config.tipGlowRenderOrder)

    // Initialize the quad RenderMeshVisual with the glow material
    const tipGlowMaterial = this.config.tipGlowMaterial.clone()
    tipGlowMaterial.mainPass.depthTest = true
    tipGlowMaterial.mainPass.depthWrite = false
    tipGlowMaterial.mainPass.tintColor = this.config.idleColor

    quadComponent.mainMaterial = tipGlowMaterial

    return quadSceneObject
  }

  private updateMaterial(): void {
    const scaledIndexGlowBase = this.indexGlowBase * PINCH_BASE_BONUS_RATIO
    const scaledIndexGlowBonus =
      this.indexGlowBonus * (1 - PINCH_BASE_BONUS_RATIO)
    const combinedIndexGlowFactor = scaledIndexGlowBase + scaledIndexGlowBonus

    const scaledThumbGlowBase = this.thumbGlowBase * PINCH_BASE_BONUS_RATIO
    const scaledThumbGlowBonus =
      this.indexGlowBonus * (1 - PINCH_BASE_BONUS_RATIO)
    const combinedThumbGlowFactor = scaledThumbGlowBase + scaledThumbGlowBonus
    this.applyMaterialUpdates(combinedIndexGlowFactor, combinedThumbGlowFactor)
    this.updateMaterialTintColor(this.indexGlowBonus, this.thumbGlowBonus)

    this.handVisuals.handMesh.mainMaterial.mainPass["brightness"] =
      combinedIndexGlowFactor * MAX_HAND_MESH_MATERIAL_BRIGHTNESS
  }

  private applyMaterialUpdates(
    combinedIndexGlowFactor: number,
    combinedThumbGlowFactor: number
  ): void {
    this.tipGlowMaterialIndexTip.mainPass["fadeLevel"] = combinedIndexGlowFactor
    this.tipGlowMaterialThumbTip.mainPass["fadeLevel"] = combinedThumbGlowFactor
  }

  private updateMaterialTintColor(
    indexGlowBonus: number,
    thumbGlowBonus: number
  ) {
    const indexTintColor = vec4.lerp(
      this.config.idleColor,
      this.config.pinchDownColor,
      indexGlowBonus
    )

    const thumbTintColor = vec4.lerp(
      this.config.idleColor,
      this.config.pinchDownColor,
      thumbGlowBonus
    )

    this.tipGlowMaterialIndexTip.mainPass["tintColor"] = indexTintColor
    this.tipGlowMaterialThumbTip.mainPass["tintColor"] = thumbTintColor
  }

  private setIsInPalmUiMode(isInPalmUIMode: boolean): void {
    if (isInPalmUIMode === this.isInPalmUIMode) {
      return
    }

    this.isInPalmUIMode = isInPalmUIMode

    this.glowEffectViewModel.palmUIModeEvent(this.isInPalmUIMode)
  }

  private setIsInTargetingMode(isInTargetingMode: boolean): void {
    if (isInTargetingMode === this.isInTargetingMode) {
      return
    }

    this.isInTargetingMode = isInTargetingMode

    this.glowEffectViewModel.targetingEvent(this.isInTargetingMode)
  }

  private setIsInNearPinchMode(isInNearPinchMode: boolean): void {
    if (isInNearPinchMode === this.isInNearPinchMode) {
      return
    }

    this.isInNearPinchMode = isInNearPinchMode

    this.glowEffectViewModel.nearPinchEvent(this.isInNearPinchMode)
  }

  private setupPinchEvents(): void {
    this.hand.onPinchDown.add(() => {
      this.glowEffectViewModel.pinchEvent(true)
    })

    this.hand.onPinchUp.add(() => {
      this.glowEffectViewModel.pinchEvent(false)
    })

    this.hand.onPinchCancel.add(() => {
      this.glowEffectViewModel.pinchEvent(false)
    })
  }

  private calculateIsInNearPinchMode(): boolean {
    const pinchStrength = this.hand.getPinchStrength() ?? 0

    if (
      pinchStrength > PINCH_STRENGTH_NEAR_PINCH_ENTER_THRESHOLD &&
      this.isInNearPinchMode === false
    ) {
      return true
    } else if (
      pinchStrength < PINCH_STRENGTH_NEAR_PINCH_EXIT_THRESHOLD &&
      this.hand.isPinching() === false
    ) {
      return false
    }

    return true
  }

  /**
   * @returns boolean
   */
  private calculateIsInTargetingMode(): boolean {
    return !this.isHandFacingCamera(this.hand)
  }

  /**
   * Cannot use this.config.hand.isFacingCamera() as that only triggers if hand
   * is facing directly at camera, where we need more broad definition
   *
   * @param hand the BaseHand to check
   * @returns boolean
   */
  private isHandFacingCamera(hand: BaseHand): boolean {
    const handAngle = hand.getFacingCameraAngle()
    if (
      handAngle === null ||
      handAngle > HAND_FACING_CAMERA_THRESHOLD_DEGREES
    ) {
      return false
    }

    return true
  }

  /*
   * isInPalmUI
   * 1) are both hands tracked
   * 2) are both hands visible / important landmarks visible in the display fov
   * 3) non dominant hand isPalmFacingCamera == true and dominant hand is not facing camera
   * 4) if distance between index finger tip and palm center is less than the threshold
   */
  private calculateIsInPalmUIMode() {
    if (!this.tapGlowEnabled || !this.bothHandsTracked()) {
      return false
    }

    const handToTapPinkyKnuckle = this.handToTap.pinkyKnuckle
    const tappingHandIndexTip = this.hand.indexTip

    if (handToTapPinkyKnuckle === null || tappingHandIndexTip === null) {
      return false
    }

    const handToTapPinkyKnucklePos = handToTapPinkyKnuckle.position
    const tappingHandIndexTipPos = tappingHandIndexTip.position

    if (
      !this.camera.inFoV(handToTapPinkyKnucklePos) ||
      !this.camera.inFoV(tappingHandIndexTipPos)
    ) {
      return false
    }

    if (
      !this.isHandFacingCamera(this.handToTap) ||
      this.isHandFacingCamera(this.hand)
    ) {
      return false
    }

    const handToTapPalmCenterPos = this.handToTap.getPalmCenter()

    if (handToTapPalmCenterPos === null) {
      return false
    }

    const distanceToPalmCenter = tappingHandIndexTipPos.distance(
      handToTapPalmCenterPos
    )

    if (distanceToPalmCenter >= this.config.tapProximityThreshold) {
      return false
    }

    return true
  }

  private bothHandsTracked(): boolean {
    return (
      this.handProvider.getDominantHand().isTracked() &&
      this.handProvider.getNonDominantHand().isTracked()
    )
  }

  private animateIndexGlowBase(animateUp: boolean) {
    this.indexGlowStrengthCancelSet()
    animate({
      cancelSet: this.indexGlowStrengthCancelSet,
      duration: PINCH_ANIMATION_DURATION,
      easing: "ease-in-out-back-cubic",
      start: this.indexGlowBase,
      end: animateUp ? 1 : 0,
      update: (t) => {
        this.indexGlowBase = t
      },
    })
  }

  private animateIndexGlowBonus(animateUp: boolean) {
    this.indexGlowBonusCancelSet()
    animate({
      cancelSet: this.indexGlowBonusCancelSet,
      duration: PINCH_ANIMATION_DURATION,
      easing: "ease-in-out-back-cubic",
      start: this.indexGlowBonus,
      end: animateUp ? 1 : 0,
      update: (t) => {
        this.indexGlowBonus = t
      },
    })
  }

  private animateThumbGlowBase(animateUp: boolean) {
    this.thumbGlowStrengthCancelSet()
    animate({
      cancelSet: this.thumbGlowStrengthCancelSet,
      duration: PINCH_ANIMATION_DURATION,
      easing: "ease-in-out-back-cubic",
      start: this.thumbGlowBase,
      end: animateUp ? 1 : 0,
      update: (t) => {
        this.thumbGlowBase = t
      },
    })
  }

  private animateThumbGlowBonus(animateUp: boolean) {
    this.thumbGlowBonusCancelSet()
    animate({
      cancelSet: this.thumbGlowBonusCancelSet,
      duration: PINCH_ANIMATION_DURATION,
      easing: "ease-in-out-back-cubic",
      start: this.thumbGlowBonus,
      end: animateUp ? 1 : 0,
      update: (t) => {
        this.thumbGlowBonus = t
      },
    })
  }
}

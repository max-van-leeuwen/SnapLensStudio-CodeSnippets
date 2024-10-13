import {HandInputData} from "../../../Providers/HandInputData/HandInputData"
import {HandType} from "../../../Providers/HandInputData/HandType"
import {HandVisuals} from "../../../Providers/HandInputData/HandVisuals"
import TrackedHand from "../../../Providers/HandInputData/TrackedHand"
import {InteractionConfigurationProvider} from "../../../Providers/InteractionConfigurationProvider/InteractionConfigurationProvider"
import {SIK} from "../../../SIK"
import {InputChecker} from "../../../Utils/InputChecker"
import {findSceneObjectByName} from "../../../Utils/SceneObjectUtils"
import {GlowEffectView} from "./GlowEffectView"
import RadialOcclusionView from "./RadialOcclusionView"

const TAG = "HandVisual"

@component
export class HandVisual extends BaseScriptComponent implements HandVisuals {
  @ui.group_start("Hand Visual")
  @input
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Left", "left"),
      new ComboBoxItem("Right", "right"),
    ])
  )
  private handType: string

  @input
  /**
   * Reference to the RenderMeshVisual of the hand mesh.
   */
  handMesh: RenderMeshVisual

  @input
  @hint("The desired render order of the handMesh")
  private handMeshRenderOrder: number = 9999

  @input
  @hint("Parent of both the rig and the mesh")
  /** @inheritdoc */
  root: SceneObject
  @input
  @hint("If checked the HandVisual will attempt to automatically wire joints")
  /**
   * Check to engage [Automatic Setup](#automatic-setup), leave unchecked for [Manual Setup](#manual-setup). Defaults to "true".
   */
  autoJointMapping: boolean = true

  @ui.group_start("Joint Setup")
  @showIf("autoJointMapping", false)
  @input
  @allowUndefined
  /** @inheritdoc */
  wrist: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  thumbToWrist: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  thumbBaseJoint: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  thumbKnuckle: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  thumbMidJoint: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  thumbTip: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  indexToWrist: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  indexKnuckle: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  indexMidJoint: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  indexUpperJoint: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  indexTip: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  middleToWrist: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  middleKnuckle: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  middleMidJoint: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  middleUpperJoint: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  middleTip: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  ringToWrist: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  ringKnuckle: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  ringMidJoint: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  ringUpperJoint: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  ringTip: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  pinkyToWrist: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  pinkyKnuckle: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  pinkyMidJoint: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  pinkyUpperJoint: SceneObject
  @input
  @allowUndefined
  /** @inheritdoc */
  pinkyTip: SceneObject
  @ui.group_end
  @ui.group_start("Glow Effect")
  @input
  @hint("Whether or not the glow effect is enabled")
  private glowEnabled: boolean = true
  @input
  @hint("The plane mesh on which the glow texture/material will be rendered")
  private unitPlaneMesh: RenderMesh
  @input
  @hint("The material which will be manipulated to create the glow effect")
  private tipGlowMaterial: Material
  @input
  @widget(new ColorWidget())
  @hint("The color the glow will be when you are not pinching")
  private idleColor: vec4
  @input
  @widget(new ColorWidget())
  @hint("The color the glow will be when you are pinching")
  private pinchDownColor: vec4
  @input
  @hint(
    "How close index finger of tapping hand has to be to tapped hand to initiate tap glow"
  )
  private tapProximityThreshold: number
  @input
  @hint("The texture applied to the hand when creating pinch glow effect")
  private pinchTexture: Texture
  @input
  @hint("The texture applied to the hand when creating tap glow effect")
  private tapTexture: Texture
  @input
  @hint("The render order of the quad on which the tip glow effect occurs")
  private tipGlowRenderOrder: number = 10000
  @ui.group_end
  @ui.group_start("Radial Gradient Occlusion")
  @input
  @hint("Whether or not the radial gradient occluder is enabled")
  private occluderEnabled: boolean = false
  @input
  @hint("The plane mesh the radial gradient occluder will be rendered")
  private occluderUnitPlaneMesh: RenderMesh
  @input
  @hint("The material which will be create the gradient occlusion effect")
  private radialGradientOcclusionMaterial: Material
  @input
  @hint("The render order of the gradient quad tracked to the hand")
  private gradientQuadRenderOrder: number = 9997
  @ui.group_end
  @ui.group_end

  // Dependencies
  private handProvider: HandInputData = SIK.HandInputData
  private interactionConfigurationProvider: InteractionConfigurationProvider =
    SIK.InteractionConfiguration
  private inputChecker = new InputChecker(TAG)

  private hand: TrackedHand

  private radialOcclusionView: RadialOcclusionView
  private glowEffectView: GlowEffectView

  private _enabled: boolean = true

  private defineScriptEvents() {
    this.createEvent("OnEnableEvent").bind(() => {
      this.defineOnEnableBehavior()
    })

    this.createEvent("OnDisableEvent").bind(() => {
      this.defineOnDisableBehavior()
    })

    this.createEvent("OnDestroyEvent").bind(() => {
      this.defineOnDestroyBehavior()
    })
  }
  protected defineOnEnableBehavior() {
    this.setEnabled(true)
  }
  protected defineOnDisableBehavior() {
    this.setEnabled(false)
  }
  protected defineOnDestroyBehavior() {
    if (this.glowEffectView !== undefined) {
      this.glowEffectView.destroy()
    }
    if (this.radialOcclusionView !== undefined) {
      this.radialOcclusionView.destroy()
    }
    this.hand.detachHandVisuals(this)
  }
  private defineHandEvents() {
    this.hand.onEnabledChanged.add((enabled: boolean) => {
      this._enabled = enabled
      // We shouldn't turn on the hand visuals until the hand has actually been found.
      if (!enabled) {
        this.setEnabled(false)
      }
    })

    this.hand.onHandFound.add(() => {
      if (this._enabled) {
        this.setEnabled(true)
      }
    })

    this.hand.onHandLost.add(() => {
      if (this._enabled) {
        this.setEnabled(false)
      }
    })
  }
  private getJointSceneObject(
    targetSceneObjectName: string,
    root: SceneObject
  ) {
    const sceneObject = findSceneObjectByName(root, targetSceneObjectName)
    if (sceneObject === null) {
      throw new Error(
        `${targetSceneObjectName} could not be found in children of SceneObject: ${this.root.name}`
      )
    }
    return sceneObject
  }
  private setEnabled(enabled: boolean) {
    if (this.glowEffectView !== undefined) {
      this.glowEffectView.enabled = enabled
    }
    if (this.radialOcclusionView !== undefined) {
      this.radialOcclusionView.enabled = enabled
    }
    this.handMesh.enabled = enabled
  }

  onAwake() {
    if (this.handType !== "right") {
      this.hand = this.handProvider.getHand("left")
    } else {
      this.hand = this.handProvider.getHand("right")
    }

    this.wrist = this.autoJointMapping
      ? this.getJointSceneObject("wrist", this.root)
      : this.wrist

    this.thumbToWrist = this.autoJointMapping
      ? this.getJointSceneObject("wrist_to_thumb", this.root)
      : this.thumbToWrist
    this.thumbBaseJoint = this.autoJointMapping
      ? this.getJointSceneObject("thumb-0", this.root)
      : this.thumbBaseJoint
    this.thumbKnuckle = this.autoJointMapping
      ? this.getJointSceneObject("thumb-1", this.root)
      : this.thumbKnuckle
    this.thumbMidJoint = this.autoJointMapping
      ? this.getJointSceneObject("thumb-2", this.root)
      : this.thumbMidJoint
    this.thumbTip = this.autoJointMapping
      ? this.getJointSceneObject("thumb-3", this.root)
      : this.thumbTip
    this.indexToWrist = this.autoJointMapping
      ? this.getJointSceneObject("wrist_to_index", this.root)
      : this.indexToWrist
    this.indexKnuckle = this.autoJointMapping
      ? this.getJointSceneObject("index-0", this.root)
      : this.indexKnuckle
    this.indexMidJoint = this.autoJointMapping
      ? this.getJointSceneObject("index-1", this.root)
      : this.indexMidJoint
    this.indexUpperJoint = this.autoJointMapping
      ? this.getJointSceneObject("index-2", this.root)
      : this.indexUpperJoint
    this.indexTip = this.autoJointMapping
      ? this.getJointSceneObject("index-3", this.root)
      : this.indexTip
    this.middleToWrist = this.autoJointMapping
      ? this.getJointSceneObject("wrist_to_mid", this.root)
      : this.middleToWrist
    this.middleKnuckle = this.autoJointMapping
      ? this.getJointSceneObject("mid-0", this.root)
      : this.middleKnuckle
    this.middleMidJoint = this.autoJointMapping
      ? this.getJointSceneObject("mid-1", this.root)
      : this.middleMidJoint
    this.middleUpperJoint = this.autoJointMapping
      ? this.getJointSceneObject("mid-2", this.root)
      : this.middleUpperJoint
    this.middleTip = this.autoJointMapping
      ? this.getJointSceneObject("mid-3", this.root)
      : this.middleTip
    this.ringToWrist = this.autoJointMapping
      ? this.getJointSceneObject("wrist_to_ring", this.root)
      : this.ringToWrist
    this.ringKnuckle = this.autoJointMapping
      ? this.getJointSceneObject("ring-0", this.root)
      : this.ringKnuckle
    this.ringMidJoint = this.autoJointMapping
      ? this.getJointSceneObject("ring-1", this.root)
      : this.ringMidJoint
    this.ringUpperJoint = this.autoJointMapping
      ? this.getJointSceneObject("ring-2", this.root)
      : this.ringUpperJoint
    this.ringTip = this.autoJointMapping
      ? this.getJointSceneObject("ring-3", this.root)
      : this.ringTip
    this.pinkyToWrist = this.autoJointMapping
      ? this.getJointSceneObject("wrist_to_pinky", this.root)
      : this.pinkyToWrist
    this.pinkyKnuckle = this.autoJointMapping
      ? this.getJointSceneObject("pinky-0", this.root)
      : this.pinkyKnuckle
    this.pinkyMidJoint = this.autoJointMapping
      ? this.getJointSceneObject("pinky-1", this.root)
      : this.pinkyMidJoint
    this.pinkyUpperJoint = this.autoJointMapping
      ? this.getJointSceneObject("pinky-2", this.root)
      : this.pinkyUpperJoint
    this.pinkyTip = this.autoJointMapping
      ? this.getJointSceneObject("pinky-3", this.root)
      : this.pinkyTip

    this.hand.attachHandVisuals(this)
    this.defineHandEvents()
    this.defineScriptEvents()

    this.handMesh.setRenderOrder(this.handMeshRenderOrder)

    /*
     * HandVisuals were not working correctly with frustum culling,
     * instead manually define the AABB for frustum culling
     */
    const min = this.handMesh.mesh.aabbMin
    const max = this.handMesh.mesh.aabbMax

    const pass = this.handMesh.mainMaterial.mainPass
    pass.frustumCullMode = FrustumCullMode.UserDefinedAABB
    pass.frustumCullMin = min
    pass.frustumCullMax = max

    if (!this.glowEnabled) {
      return
    }
    this.glowEffectView = new GlowEffectView({
      handType: this.handType as HandType,
      unitPlaneMesh: this.unitPlaneMesh,
      tipGlowMaterial: this.tipGlowMaterial,
      idleColor: this.idleColor,
      pinchDownColor: this.pinchDownColor,
      tapProximityThreshold: this.tapProximityThreshold,
      tapTexture: this.tapTexture,
      pinchTexture: this.pinchTexture,
      tipGlowRenderOrder: this.tipGlowRenderOrder,
    })

    if (!this.occluderEnabled) {
      return
    }
    this.radialOcclusionView = new RadialOcclusionView({
      handType: this.handType as HandType,
      unitPlaneMesh: this.occluderUnitPlaneMesh,
      radialGradientOcclusionMaterial: this.radialGradientOcclusionMaterial,
      gradientQuadRenderOrder: this.gradientQuadRenderOrder,
    })
  }
}

/**
 * Provides the SceneObject to be attached to the {@link BaseHand}
 */
export interface HandVisuals {
  readonly handMesh: RenderMeshVisual

  /**
   * The root {@link SceneObject}, parent of the hand rig and hand mesh
   */
  readonly root: SceneObject

  /**
   * The {@link SceneObject} of the wrist joint
   */
  readonly wrist: SceneObject

  /**
   * The {@link SceneObject} of the thumbToWrist joint
   */
  readonly thumbToWrist: SceneObject

  /**
   * The {@link SceneObject} of the thumbBaseJoint joint
   */
  readonly thumbBaseJoint: SceneObject

  /**
   * The {@link SceneObject} of the thumbKnuckle joint
   */
  readonly thumbKnuckle: SceneObject

  /**
   * The {@link SceneObject} of the thumbMidJoint joint
   */
  readonly thumbMidJoint: SceneObject

  /**
   * The {@link SceneObject} of the thumbTip joint
   */
  readonly thumbTip: SceneObject

  /**
   * The {@link SceneObject} of the indexToWrist joint
   */
  readonly indexToWrist: SceneObject

  /**
   * The {@link SceneObject} of the indexKnuckle joint
   */
  readonly indexKnuckle: SceneObject

  /**
   * The {@link SceneObject} of the indexMidJoint joint
   */
  readonly indexMidJoint: SceneObject

  /**
   * The {@link SceneObject} of the indexUpperJoint joint
   */
  readonly indexUpperJoint: SceneObject

  /**
   * The {@link SceneObject} of the indexTip joint
   */
  readonly indexTip: SceneObject

  /**
   * The {@link SceneObject} of the middleToWrist joint
   */
  readonly middleToWrist: SceneObject

  /**
   * The {@link SceneObject} of the middleKnuckle joint
   */
  readonly middleKnuckle: SceneObject

  /**
   * The {@link SceneObject} of the middleMidJoint joint
   */
  readonly middleMidJoint: SceneObject

  /**
   * The {@link SceneObject} of the middleUpperJoint joint
   */
  readonly middleUpperJoint: SceneObject

  /**
   * The {@link SceneObject} of the middleTip joint
   */
  readonly middleTip: SceneObject

  /**
   * The {@link SceneObject} of the ringToWrist joint
   */
  readonly ringToWrist: SceneObject

  /**
   * The {@link SceneObject} of the ringKnuckle joint
   */
  readonly ringKnuckle: SceneObject

  /**
   * The {@link SceneObject} of the ringMidJoint joint
   */
  readonly ringMidJoint: SceneObject

  /**
   * The {@link SceneObject} of the ringUpperJoint joint
   */
  readonly ringUpperJoint: SceneObject

  /**
   * The {@link SceneObject} of the ringTip joint
   */
  readonly ringTip: SceneObject

  /**
   * The {@link SceneObject} of the pinkyToWrist joint
   */
  readonly pinkyToWrist: SceneObject

  /**
   * The {@link SceneObject} of the pinkyKnuckle joint
   */
  readonly pinkyKnuckle: SceneObject

  /**
   * The {@link SceneObject} of the pinkyMidJoint joint
   */
  readonly pinkyMidJoint: SceneObject

  /**
   * The {@link SceneObject} of the pinkyUpperJoint joint
   */
  readonly pinkyUpperJoint: SceneObject

  /**
   * The {@link SceneObject} of the pinkyTip joint
   */
  readonly pinkyTip: SceneObject
}

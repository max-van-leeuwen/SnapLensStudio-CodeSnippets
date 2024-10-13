import BillboardController, {
  BillboardConfig,
  RotationAxis,
} from "./BillboardController"

/*
 * Billboard allows an object to rotate to face the camera.
 */
@component
export class Billboard extends BaseScriptComponent {
  private controller: BillboardController

  @ui.group_start("Billboard")
  @input
  private _xAxisEnabled: boolean = false
  @input
  private _yAxisEnabled: boolean = true
  @input
  private _zAxisEnabled: boolean = false
  @input
  @hint("How big the angle must be to start rotating about that axis")
  private _axisBufferDegrees: vec3 = new vec3(0, 0, 0)
  @input
  @hint(
    "How fast the target should rotate to follow camera, instant follow = 1, delay follow = 0.1"
  )
  private _axisEasing: vec3 = new vec3(1, 1, 1)
  @input
  @hint(
    "The expected duration between updates, expecting ~30FPS = 0.033; lower duration = faster rotation"
  )
  @ui.group_end
  duration: number = 0.033

  onAwake() {
    let billboardConfig: BillboardConfig = {
      script: this,
      target: this.getSceneObject(),
      xAxisEnabled: this._xAxisEnabled,
      yAxisEnabled: this._yAxisEnabled,
      zAxisEnabled: this._zAxisEnabled,
      axisBufferDegrees: this._axisBufferDegrees,
      axisEasing: this._axisEasing,
      duration: this.duration,
    }
    this.controller = new BillboardController(billboardConfig)
  }

  /**
   * Immediately resets the SceneObject to the rotation accroding to inputs regardless of easing.
   */
  snapToOffsetRotation() {
    this.controller.resetRotation()
  }

  /**
   * @returns if the SceneObject billboards about the x-axis.
   */
  get xAxisEnabled() {
    return this._xAxisEnabled
  }

  /**
   * @param enabled - defines if the SceneObject billboards about the x-axis.
   */
  set xAxisEnabled(enabled: boolean) {
    if (enabled === this._xAxisEnabled) {
      return
    }
    this._xAxisEnabled = enabled
    this.controller.enableAxisRotation(RotationAxis.X, enabled)
  }

  /**
   * @returns if the SceneObject billboards about the y-axis.
   */
  get yAxisEnabled() {
    return this._yAxisEnabled
  }

  /**
   * @param enabled - defines if the SceneObject billboards about the y-axis.
   */
  set yAxisEnabled(enabled: boolean) {
    if (enabled === this._yAxisEnabled) {
      return
    }
    this._yAxisEnabled = enabled
    this.controller.enableAxisRotation(RotationAxis.Y, enabled)
  }

  /**
   * @returns if the SceneObject billboards about the z-axis.
   */
  get zAxisEnabled() {
    return this._zAxisEnabled
  }

  /**
   * @param enabled - defines if the SceneObject billboards about the z-axis.
   */
  set zAxisEnabled(enabled: boolean) {
    if (enabled === this._zAxisEnabled) {
      return
    }
    this._zAxisEnabled = enabled
    this.controller.enableAxisRotation(RotationAxis.Z, enabled)
  }

  /**
   * @param easing - the vector defining the easing for each axis. For instant follow, use easing = (1,1,1).
   */
  set axisEasing(easing: vec3) {
    if (easing.equal(this._axisEasing)) {
      return
    }
    this._axisEasing = easing
    this.controller.axisEasing = easing
  }

  /**
   * @returns the vector defining the easing for each axis.
   */
  get axisEasing() {
    return this._axisEasing
  }

  /**
   * @param bufferDegrees - the vector defining the buffer for each axis.
   */
  set axisBufferDegrees(bufferDegrees: vec3) {
    if (bufferDegrees.equal(this._axisBufferDegrees)) {
      return
    }
    this._axisBufferDegrees = bufferDegrees
    this.controller.axisBufferDegrees = bufferDegrees
  }

  /**
   * @returns the vector defining the buffer for each axis.
   */
  get axisBufferDegrees() {
    return this._axisBufferDegrees
  }
}

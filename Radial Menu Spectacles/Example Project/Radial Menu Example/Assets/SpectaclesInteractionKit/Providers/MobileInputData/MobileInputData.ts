import {Singleton} from "../../Decorators/Singleton"
import {AnimationManager} from "../../Utils/animate"
import Event from "../../Utils/Event"
import NativeLogger from "../../Utils/NativeLogger"
import {
  OneEuroFilterConfig,
  OneEuroFilterQuat,
  OneEuroFilterVec3,
} from "../../Utils/OneEuroFilter"

const TAG = "MobileInputData"

const TRANSLATE_FILTER_CONFIG: OneEuroFilterConfig = {
  frequency: 60,
  minCutoff: 3.5,
  beta: 0.5,
  dcutoff: 1,
}
const ROTATION_FILTER_CONFIG: OneEuroFilterConfig = {
  frequency: 60,
  minCutoff: 1,
  beta: 2,
  dcutoff: 1,
}

@Singleton
export class MobileInputData {
  public static getInstance: () => MobileInputData

  private log = new NativeLogger(TAG)

  private _motionControllerModule = undefined
  private _motionController: MotionController = undefined

  private animationManager: AnimationManager = AnimationManager.getInstance()
  private translateFilter = new OneEuroFilterVec3(TRANSLATE_FILTER_CONFIG)
  private rotationFilter = new OneEuroFilterQuat(ROTATION_FILTER_CONFIG)
  private _position = vec3.zero()
  private _rotation = quat.quatIdentity()

  private _trackingQuality: MotionController.TrackingQuality =
    MotionController.TrackingQuality.Unknown
  private onTrackingQualityChangeEvent =
    new Event<MotionController.TrackingQuality>()

  /**
   * Public API to subscribe to controller state change events.
   *
   * @returns The public api
   */
  readonly onControllerStateChange = null

  /**
   * Public API to subscribe to tracking quality change events.
   *
   * @returns The public api
   */
  readonly onTrackingQualityChange =
    this.onTrackingQualityChangeEvent.publicApi()

  /** Enables filtering of position and rotation */
  filterPositionAndRotation: boolean = true

  constructor() {
    this.initializeMotionController()

    this.onControllerStateChange =
      this._motionController.onControllerStateChange

    this.onControllerStateChange.add((state) => {
      this.log.d("Controller state changed to : " + state)
    })

    this.update(this.filterPositionAndRotation)
  }

  private initializeMotionController(): void {
    try {
      this._motionControllerModule = require("LensStudio:MotionControllerModule")
      this.log.d("MotionControllerModule created")
    } catch (error) {
      this.log.e("Cannot create MotionControllerModule : " + error)
    }

    let options = MotionController.Options.create()
    options.motionType = MotionController.MotionType.SixDoF

    this._motionController = this._motionControllerModule.getController(
      options
    ) as MotionController

    this._trackingQuality = this._motionController.getTrackingQuality()
  }

  private update(useFilter: boolean = true): void {
    if (this._motionController.isControllerAvailable()) {
      this._position = useFilter
        ? this.translateFilter.filter(
            this._motionController.getWorldPosition(),
            getTime()
          )
        : this._motionController.getWorldPosition()

      this._rotation = useFilter
        ? this.rotationFilter.filter(
            this._motionController.getWorldRotation(),
            getTime()
          )
        : this._motionController.getWorldRotation()
    }

    if (this._trackingQuality !== this._motionController.getTrackingQuality()) {
      this.onTrackingQualityChangeEvent.invoke(
        this._motionController.getTrackingQuality()
      )
      this.log.v(
        "Motion Controller Tracking Quality has changed to : " +
          this._motionController.getTrackingQuality()
      )
      this.translateFilter.reset()
      this.rotationFilter.reset()
    }

    this._trackingQuality = this._motionController.getTrackingQuality()

    this.animationManager.requestAnimationFrame(() =>
      this.update(this.filterPositionAndRotation)
    )
  }

  /**
   * @returns the current Motion Controller module instance.
   */
  get motionController(): MotionController {
    return this._motionController
  }

  /**
   * @returns the current position.
   */
  get position(): vec3 {
    return this._position
  }

  /**
   * @returns the current rotation.
   */
  get rotation(): quat {
    return this._rotation
  }

  /**
   * @returns the current tracking quality.
   */
  get trackingQuality(): MotionController.TrackingQuality {
    return this._motionController.getTrackingQuality()
  }

  /**
   * @returns if the mobile input data provider is available,
   * which means that it is receiving data.
   */
  isAvailable(): boolean {
    return this._motionController.isControllerAvailable()
  }
}

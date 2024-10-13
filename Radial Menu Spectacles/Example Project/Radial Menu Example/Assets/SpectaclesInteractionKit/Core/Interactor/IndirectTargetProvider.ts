import TargetProvider, {
  InteractableHitInfo,
} from "../../Providers/TargetProvider/TargetProvider"
import BaseInteractor from "./BaseInteractor"
import {TargetingMode} from "./Interactor"
import {RaycastInfo, RayProvider} from "./RayProvider"

export type IndirectTargetProviderConfig = {
  rayProvider: RayProvider
  maxRayDistance: number
  targetingVolumeMultiplier?: number
  shouldPreventTargetUpdate: () => boolean
  spherecastRadii: number[]
  spherecastDistanceThresholds: number[]
}

export default class IndirectTargetProvider extends TargetProvider {
  readonly targetingMode: TargetingMode = TargetingMode.Indirect

  private probe = Physics.createGlobalProbe()
  private currentRay: RaycastInfo | null = null
  private targetingVolumeMultiplier: number =
    this.config.targetingVolumeMultiplier ?? 1

  private spherecastRadii: number[] = this.config.spherecastRadii
  private spherecastDistanceThresholds: number[] =
    this.config.spherecastDistanceThresholds

  private _drawDebug = this.interactor.drawDebug

  constructor(
    private interactor: BaseInteractor,
    private config: IndirectTargetProviderConfig
  ) {
    super()
    this._drawDebug = this.interactor.drawDebug
    this.probe.debugDrawEnabled = this.interactor.drawDebug
    if (
      this.config.spherecastRadii.length !==
      this.config.spherecastDistanceThresholds.length
    ) {
      throw new Error(
        "An Interactor's Spherecast Radii and Spherecast Distance Thresholds input arrays are not the same length!"
      )
    }
  }

  get startPoint(): vec3 {
    return this.currentRay?.locus ?? vec3.zero()
  }

  get endPoint(): vec3 {
    return this.startPoint.add(
      this.direction.uniformScale(this.config.maxRayDistance)
    )
  }

  get direction(): vec3 {
    return this.currentRay?.direction ?? vec3.zero()
  }

  set drawDebug(debug: boolean) {
    this._drawDebug = debug

    this.probe.debugDrawEnabled = debug
  }

  get drawDebug(): boolean {
    return this._drawDebug
  }

  /**
   * Can be used to reset inner states
   * Should be called when the hand is not tracked or targeting is blocked
   */
  reset(): void {
    this.config.rayProvider.reset()
  }

  /** @inheritdoc */
  update(): void {
    if (!this.config.rayProvider.isAvailable()) {
      this.config.rayProvider.reset()
      this.updateTargetedItem(null)
      return
    }

    this.currentRay = this.config.rayProvider.getRaycastInfo()
    if (this.currentRay) {
      this.indirectRayCast(this.currentRay)
    }
  }

  /** @inheritdoc */
  destroy(): void {}

  /**
   * Uses a ray cast to detect items in the direct path
   * Starts sphere casting if and only if nothing is found with the ray
   */
  private indirectRayCast(ray: RaycastInfo) {
    this.probe.rayCastAll(
      ray.locus,
      this.endPoint,
      // RaycastHits are automatically sorted from nearest to farthest
      (hits: RayCastHit[]) => {
        const hitInfo = this.getInteractableHitFromRayCast(hits)

        if (hitInfo) {
          this.updateTargetedItem(hitInfo)
          return
        }

        /*
         * If nothing is hit directly by the ray, try sphere cast if ray is sticky or set targeted item to null if not
         * Also, reset to default indirect mode
         */
        if (this.interactor.sphereCastEnabled) {
          this.indirectSphereCast(ray)
        } else {
          this.updateTargetedItem(null)
        }
      }
    )
  }

  /**
   * Does a sphere cast to look for interactables
   * Iterates through size options from smallest to largest until something is found/all options are checked
   */
  private indirectSphereCast(ray: RaycastInfo, index: number = 0): void {
    // Nothing is targeted if no interactables exist, or we've iterated through all sphere options
    if (index >= this.spherecastDistanceThresholds.length) {
      this.updateTargetedItem(null)
      return
    }
    const offset = this.spherecastDistanceThresholds[index]
    const castOrigin = ray.locus.add(ray.direction.uniformScale(offset))
    const castEnd = castOrigin.add(
      ray.direction.uniformScale(this.config.maxRayDistance - offset)
    )

    this.probe.sphereCastAll(
      this.spherecastRadii[index] * this.targetingVolumeMultiplier,
      castOrigin,
      castEnd,
      (hits: RayCastHit[]) => {
        const hitInfo = this.getInteractableHitFromRayCast(hits, offset)
        if (hitInfo) {
          this.updateTargetedItem(hitInfo)
          return
        }

        this.indirectSphereCast(ray, index + 1)
      }
    )
  }

  private updateTargetedItem(hitInfo: InteractableHitInfo | null): void {
    /*
     * We check if the new target is the same, we always update the hit data with the new
     * value
     */
    if (
      hitInfo !== null &&
      this.currentInteractableHitInfo !== null &&
      this.currentInteractableHitInfo.interactable === hitInfo.interactable
    ) {
      this.currentInteractableHitInfo.hit = hitInfo.hit
    }

    // If we shouldn't update the target, we return early
    if (this.config.shouldPreventTargetUpdate()) {
      return
    }

    this._currentInteractableHitInfo = hitInfo
  }
}

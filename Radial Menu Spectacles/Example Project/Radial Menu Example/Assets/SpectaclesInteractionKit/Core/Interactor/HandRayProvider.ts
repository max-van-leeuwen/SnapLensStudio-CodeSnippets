import {HandInputData} from "../../Providers/HandInputData/HandInputData"
import {HandType} from "../../Providers/HandInputData/HandType"
import {SIK} from "../../SIK"
import {RaycastType} from "../HandInteractor/HandInteractor"
import RaycastAnchorHead from "./raycastAlgorithms/RaycastAnchorHead"
import RaycastAnchorVariableShoulder from "./raycastAlgorithms/RaycastAnchorVariableShoulder"
import RaycastBase from "./raycastAlgorithms/RaycastBase"
import RaycastLegacySingleCamera from "./raycastAlgorithms/RaycastLegacySingleCamera"
import RaycastProxy from "./raycastAlgorithms/RaycastProxy"
import {RaycastInfo, RayProvider} from "./RayProvider"

export type HandRayProviderConfig = {
  raycastAlgorithm: RaycastType
  handType: HandType
}

export class HandRayProvider implements RayProvider {
  private raycast: RaycastBase

  private handProvider: HandInputData = SIK.HandInputData

  private hand = this.handProvider.getHand(this.config.handType)

  constructor(private config: HandRayProviderConfig) {
    // Set raycast algorithm used
    switch (config.raycastAlgorithm) {
      case "LegacySingleCamera": {
        this.raycast = new RaycastLegacySingleCamera(this.hand)
        break
      }
      case "AnchorHead": {
        this.raycast = new RaycastAnchorHead(this.hand)
        break
      }
      case "Proxy": {
        this.raycast = new RaycastProxy(this.hand)
        break
      }
      default: {
        this.raycast = new RaycastAnchorVariableShoulder(this.hand)
        break
      }
    }
  }

  /** @inheritdoc */
  getRaycastInfo(): RaycastInfo {
    return (
      this.raycast.getRay() ?? {
        direction: vec3.zero(),
        locus: vec3.zero(),
      }
    )
  }

  /** @inheritdoc */
  isAvailable(): boolean {
    return (
      (this.hand.isInTargetingPose() && this.hand.isTracked()) ||
      this.hand.isPinching()
    )
  }

  /** @inheritdoc */
  reset(): void {
    this.raycast.reset()
  }
}

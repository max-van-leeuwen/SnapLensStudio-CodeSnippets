import {Singleton} from "../../Decorators/Singleton"
import {bfs} from "../../Utils/algorithms"
import BaseWorldCameraProvider from "./BaseWorldCameraProvider"

@Singleton
export default class WorldCameraFinderProvider extends BaseWorldCameraProvider {
  public static getInstance: () => WorldCameraFinderProvider

  constructor() {
    super()
    const cameraComponent = this.lookForCameraComponent()
    if (cameraComponent === null) {
      throw new Error(
        "Could not find any suitable camera in the scene, make sure it is setup correctly"
      )
    }
    if (
      this.lookForDeviceTrackingComponent(cameraComponent.getSceneObject()) ===
      null
    ) {
      throw new Error(
        "Your main camera is currently missing a 'Device Tracking Component'. Set your `Device Tracking Component` with Tracking Mode: World for spatial movement in your Lens."
      )
    }
    this.cameraComponent = cameraComponent
    this.cameraTransform = this.cameraComponent.getTransform()
  }

  private lookForCameraComponent(): Camera | null {
    // Define predicate for bfs
    const predicate = (object: SceneObject): Camera | null => {
      const cameraComponent = object.getComponent("Component.Camera")

      // It is possible the liveTarget is not set, in this case we use the captureTarget
      const targetRenderTarget =
        global.scene.liveTarget !== null
          ? global.scene.liveTarget
          : global.scene.captureTarget

      if (
        object.enabled &&
        cameraComponent !== null &&
        cameraComponent.type === Camera.Type.Perspective &&
        cameraComponent.renderTarget.isSame(targetRenderTarget) &&
        cameraComponent.enabled
      ) {
        return cameraComponent
      } else {
        return null
      }
    }

    // Get root objects from the scene
    const rootObjects = []
    for (let i = 0; i < global.scene.getRootObjectsCount(); i++) {
      rootObjects.push(global.scene.getRootObject(i))
    }

    // return bfs<Camera | null>(rootObjects, predicate)
    return bfs<Camera | null>(rootObjects, predicate)
  }

  private lookForDeviceTrackingComponent(
    sceneObject: SceneObject
  ): DeviceTracking | null {
    const deviceTrackingComponent = sceneObject.getComponent(
      "Component.DeviceTracking"
    )

    return deviceTrackingComponent
  }
}

import WorldCameraFinderProvider from "../../../../../Providers/CameraProvider/WorldCameraFinderProvider"
import NativeLogger from "../../../../../Utils/NativeLogger"

const log = new NativeLogger("SimpleLODRMV")
const DEFAULT_SPACER = 50

/**
 * BACKGROUND
 * A first pass at a naive simple Level Of Detail (LOD) RenderMeshVisual
 * Naive because it only tests distance from the center of the object to the camera ( which will fail with super large objects )
 * ---- possible improvement may may distance in relative z plane to the object
 * Simple because there is no fading between different meshes, instead it just pops to the defined mesh at the defined depth
 * ---- possible improvement is a crossfade
 * That being said, it works pretty dang good
 * ~~~~~~~~~~
 *
 * USAGE
 * Drop this component onto a scene object
 * Drop meshes into the meshes array
 * and select threshaolds at the given index ( or else falls back to default )
 * and add the material that is shared across the rmvs
 * and let it do its thing : )
 */

@component
export class SimpleLODRenderMeshVisual extends BaseScriptComponent {
  @input()
  meshes: RenderMesh[]
  @input()
  thresholds: number[]
  @input()
  material: Material

  private rmvs: RenderMeshVisual[] = []
  private distances: number[] = []
  private object: SceneObject
  private transform: Transform
  private worldCamera: WorldCameraFinderProvider =
    WorldCameraFinderProvider.getInstance()
  private cameraTransform: Transform = this.worldCamera.getTransform()
  private currentIndex: number = 0

  onAwake() {
    this.object = this.getSceneObject()
    this.transform = this.object.getTransform()
    const clonedMaterial = this.material.clone()

    for (let i = 0; i < this.meshes.length; i++) {
      const distanceMesh = this.meshes[i]
      const thisRMV = this.object.createComponent("RenderMeshVisual")
      thisRMV.mesh = distanceMesh
      thisRMV.mainMaterial = clonedMaterial
      thisRMV.enabled = false
      this.rmvs.push(thisRMV)
      this.addDistance(this.thresholds[i] ? this.thresholds[i] : DEFAULT_SPACER)
    }

    this.rmvs[this.currentIndex].enabled = true

    this.createEvent("UpdateEvent").bind(this.update)
  }

  setRenderOrder = (order: number) => {
    for (let i = 0; i < this.rmvs.length; i++) {
      const thisRmv = this.rmvs[i]
      thisRmv.setRenderOrder(order)
    }
  }

  addDistance = (distance: number) => {
    let lastDistance = 0
    if (this.distances.length) {
      lastDistance = this.distances[this.distances.length - 1]
    }

    this.distances.push(distance + lastDistance)
  }

  update = () => {
    //
    // check and compare distances from camera
    //
    const currentDistanceSquared = this.cameraTransform
      .getWorldPosition()
      .distanceSquared(this.transform.getWorldPosition())
    let from = 0
    let thisIndex = 0
    let to
    while (thisIndex < this.distances.length) {
      to = this.distances[thisIndex] * this.distances[thisIndex]
      if (currentDistanceSquared >= from && currentDistanceSquared < to) {
        break
      } else {
        from = to
        thisIndex += 1
      }
    }

    //
    // if at a new threshold, swap the active rmv
    //
    if (thisIndex < this.rmvs.length && this.currentIndex !== thisIndex) {
      this.currentIndex = thisIndex
      for (let rmv of this.rmvs) {
        rmv.enabled = false
      }
      this.rmvs[this.currentIndex].enabled = true
    }
  }
}

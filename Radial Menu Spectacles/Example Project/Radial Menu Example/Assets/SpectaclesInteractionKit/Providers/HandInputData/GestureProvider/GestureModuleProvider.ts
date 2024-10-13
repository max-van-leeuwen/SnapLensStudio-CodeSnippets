import {Singleton} from "../../../Decorators/Singleton"
import NativeLogger from "../../../Utils/NativeLogger"

const TAG = "GestureModuleProvider"
/**
 * Provides gesture related apis
 */
@Singleton
export default class GestureModuleProvider {
  public static getInstance: () => GestureModuleProvider

  private gestureModule: GestureModule | undefined = undefined

  private log = new NativeLogger(TAG)

  /**
   * Tries to create an Asset.GestureModule using the assetSystem.
   * Stores and returns the created object if it can be successfully created.
   * Returns undefined if error happens during creation.
   *
   * @returns the created GestureModule or undefined if it cannot be created
   */
  getGestureModule(): GestureModule | undefined {
    if (this.gestureModule === undefined) {
      try {
        this.gestureModule =
          require("LensStudio:GestureModule") as GestureModule
      } catch (error) {
        this.log.e(`Error creating GestureModule: ${error}`)
      }
    }
    return this.gestureModule
  }
}

/**
 * Base class to compute boundaries
 */
export abstract class BoundariesProvider {
  abstract get boundaries(): Rect

  /**
   * @returns the size of the rectangle boundaries as (width, height).
   */
  get size(): vec2 {
    return this.boundaries.getSize()
  }
}

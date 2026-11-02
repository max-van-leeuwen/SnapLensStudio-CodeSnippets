// Max van Leeuwen
//  maxvanleeuwen.com

/*

Smoothly follow SceneObjects, or blur continuous values (number, vec2, vec3, quat)!

usage
  new SmoothFollow(owner:ScriptComponent)
                            owner = the ScriptComponent this runs its update events on
  .smoothing = 1
  .useLateUpdate = false

following a SceneObject
  .target                   SceneObject to take motion from
  .follow                   SceneObject to apply motion to
  .start()
  .stop()
  .doInstant()              jump once, no smoothing
  .rotation = true
  .scale = true
  .translation = true
  .translationX = true
  .translationY = true
  .translationZ = true

following a continuous value
  .addValue(v, instant)     smoothly move towards v (number/vec2/vec3/quat, type set on first call)
  .getValue()               returns the current smoothed value
  .EPS = .001               distance to target at which smoothing stops and snaps

optional 1€ filter, enable for more responsive fast motion
  .oneEuroFilter = false
  .oneEuroMinCutoff = 1     lower = smoother at low speeds
  .oneEuroBeta = 0          higher = less lag at high speeds

callbacks, bind using .add(f) and .remove(f)
  .onUpdate                 called on each smoothed frame


example: following a SceneObject's transform
  const follower = new SmoothFollow(this)
  follower.target = this.toFollow
  follower.follow = this.toApply
  follower.start()

example: smoothing 'pos' (vec2)
  const follower = new SmoothFollow(this)
  follower.smoothing = .3
  follower.onUpdate.add(smoothPos => print(smoothPos)) // called each frame
  follower.addValue(pos) // call every frame with a new raw value


*/


import { Callback } from "./Callback"

type SmoothValue = number | vec2 | vec3 | quat
type DataType = "number" | "vec2" | "vec3" | "quat"

// returns whether this is a number, vec2, vec3 or quat
function getDataType(v: SmoothValue): DataType {
    if (typeof v == "number") return "number"
    if (v instanceof vec2) return "vec2"
    if (v instanceof vec3) return "vec3"
    return "quat"
}

function distanceBetween(dataType: DataType, a: SmoothValue, b: SmoothValue): number {
    switch (dataType) {
        case "number": return Math.abs((a as number) - (b as number))
        case "quat": return quat.angleBetween(a as quat, b as quat)
        default: return (a as vec2).distance(b as vec2) // vec2 and vec3 share the same call shape
    }
}

function lerpValue(dataType: DataType, a: SmoothValue, b: SmoothValue, alpha: number): SmoothValue {
    switch (dataType) {
        case "number": return (a as number) + ((b as number) - (a as number)) * alpha
        case "vec2": return vec2.lerp(a as vec2, b as vec2, alpha)
        case "vec3": return vec3.lerp(a as vec3, b as vec3, alpha)
        case "quat": return quat.slerp(a as quat, b as quat, alpha)
    }
}

// simple 1€ filter (Casiez et al.): turns the raw signal's speed into a single blend alpha
class OneEuroFilter {
    private prevValue: SmoothValue | null = null
    private dxPrev = 0

    reset() {
        this.prevValue = null
        this.dxPrev = 0
    }

    getAlpha(dataType: DataType, value: SmoothValue, dt: number, minCutoff: number, beta: number): number {
        if (this.prevValue == null || dt <= 0) {
            this.prevValue = value
            return 1 // no history yet, snap
        }

        const speed = distanceBetween(dataType, value, this.prevValue) / dt
        this.dxPrev += OneEuroFilter.smoothingFactor(dt, 1) * (speed - this.dxPrev) // dCutoff fixed at 1
        const cutoff = minCutoff + beta * Math.abs(this.dxPrev)
        this.prevValue = value

        return OneEuroFilter.smoothingFactor(dt, cutoff)
    }

    private static smoothingFactor(dt: number, cutoff: number): number {
        const r = 2 * Math.PI * cutoff * dt
        return r / (r + 1)
    }
}



export class SmoothFollow {
    /**
     * filtering the input.
     * 0 = no filtering, default is 1. ignored if .oneEuroFilter is true
     */
    smoothing = 1

    /**
     * use LateUpdateEvent instead of UpdateEvent.
     */
    useLateUpdate = false

    /**
     * use a 1€ filter instead of plain exponential smoothing.
     */
    oneEuroFilter = false

    /**
     * 1€ filter cutoff at zero speed. lower = smoother, but more lag at low speeds.
     */
    oneEuroMinCutoff = 1

    /**
     * 1€ filter speed coefficient. higher = less lag at high speeds, but more jitter.
     */
    oneEuroBeta = 0

    /**
     * bind using .add() and .remove() (see Callback). triggers on each smoothed frame.
     * callback argument: current value (only in custom value following mode).
     */
    onUpdate = new Callback<[SmoothValue?]>()

    // the component this creates its update events on (no global "script" outside of components)
    constructor(private owner: ScriptComponent) { }


    // --- Transform following

    /**
     * SceneObject to follow.
     */
    target!: SceneObject

    /**
     * SceneObject to apply the following to.
     */
    follow!: SceneObject

    /**
     * follow transform's position.
     * default is true.
     */
    translation = true

    /**
     * follow transform's position X (if following position).
     * default is true.
     */
    translationX = true

    /**
     * follow transform's position Y (if following position).
     * default is true.
     */
    translationY = true

    /**
     * follow transform's position Z (if following position).
     * default is true.
     */
    translationZ = true

    /**
     * follow transform's rotation.
     * default is true.
     */
    rotation = true

    /**
     * follow transform's scale.
     * default is true.
     */
    scale = true

    private followingEvent: SceneEvent | null = null
    private positionFilter = new OneEuroFilter()
    private rotationFilter = new OneEuroFilter()
    private scaleFilter = new OneEuroFilter()

    start() {
        // stop previous, if any
        this.stop()
        this.positionFilter.reset()
        this.rotationFilter.reset()
        this.scaleFilter.reset()

        this.followingEvent = this.owner.createEvent(this.useLateUpdate ? "LateUpdateEvent" : "UpdateEvent")
        this.followingEvent.bind(this.update)
    }

    /**
     * jump transform to target immediately without smoothing.
     */
    doInstant() {
        const targetTrf = this.target.getTransform()
        const followTrf = this.follow.getTransform()

        if (this.translation) {
            const targetPos = targetTrf.getWorldPosition()
            const followPos = followTrf.getWorldPosition()
            if (this.translationX) followPos.x = targetPos.x
            if (this.translationY) followPos.y = targetPos.y
            if (this.translationZ) followPos.z = targetPos.z
            followTrf.setWorldPosition(followPos)
        }
        if (this.rotation) followTrf.setWorldRotation(targetTrf.getWorldRotation())
        if (this.scale) followTrf.setWorldScale(targetTrf.getWorldScale())
    }

    stop() {
        if (this.followingEvent) {
            this.owner.removeEvent(this.followingEvent)
            this.followingEvent = null
        }
    }

    // following event on update
    private update = () => {
        const dt = getDeltaTime()
        const targetTrf = this.target.getTransform()
        const followTrf = this.follow.getTransform()

        // position
        if (this.translation) {
            const currentPos = followTrf.getWorldPosition()
            const targetPos = targetTrf.getWorldPosition()
            const axisTargetPos = new vec3(
                this.translationX ? targetPos.x : currentPos.x,
                this.translationY ? targetPos.y : currentPos.y,
                this.translationZ ? targetPos.z : currentPos.z
            )

            const alpha = this.computeAlpha(this.positionFilter, "vec3", axisTargetPos, dt)
            followTrf.setWorldPosition(alpha == 1 ? axisTargetPos : vec3.lerp(currentPos, axisTargetPos, alpha))
        }

        // rotation
        if (this.rotation) {
            const currentRot = followTrf.getWorldRotation()
            const targetRot = targetTrf.getWorldRotation()

            const alpha = this.computeAlpha(this.rotationFilter, "quat", targetRot, dt)
            followTrf.setWorldRotation(quat.slerp(currentRot, targetRot, alpha))
        }

        // scale
        if (this.scale) {
            const currentScale = followTrf.getWorldScale()
            const targetScale = targetTrf.getWorldScale()

            const alpha = this.computeAlpha(this.scaleFilter, "vec3", targetScale, dt)
            followTrf.setWorldScale(vec3.lerp(currentScale, targetScale, alpha))
        }

        // custom callback
        this.onUpdate.invoke()
    }



    // -- Custom value following

    /**
     * the distance to the target value at which it is considered 'close enough' and the smoothing
     * automatically stops (and snaps to target).
     * default is 0.001 (this is a distance for vectors and numbers, and an angle (rad) between quats).
     */
    EPS = 0.001

    private customValue: SmoothValue | null = null
    private nextValue: SmoothValue | null = null
    private dataType: DataType | null = null
    private valueFilter = new OneEuroFilter()

    /**
     * smoothly move towards v.
     * @param v value to smooth towards (number/vec2/vec3/quat, make sure this is consistent)
     * @param instant (optional) discard smoothing on this frame
     */
    addValue(v: SmoothValue, instant = false) {
        // get data type
        if (!this.dataType) this.dataType = getDataType(v)

        // apply new value
        this.stop()
        this.nextValue = v

        // instant
        if (instant) {
            this.customValue = v
            this.valueFilter.reset()
            this.onUpdate.invoke(this.customValue)
        } else {
            this.followingEvent = this.owner.createEvent(this.useLateUpdate ? "LateUpdateEvent" : "UpdateEvent")
            this.followingEvent.bind(this.updateValue)
        }
    }

    /**
     * get the current value.
     */
    getValue(): SmoothValue | null {
        return this.customValue
    }

    private updateValue = () => {
        if (this.dataType == null || this.nextValue == null) return
        const dt = getDeltaTime()

        if (this.customValue == null) {
            this.customValue = this.nextValue
        } else {
            const alpha = this.computeAlpha(this.valueFilter, this.dataType, this.nextValue, dt)
            this.customValue = alpha == 1 ? this.nextValue : lerpValue(this.dataType, this.customValue, this.nextValue, alpha)
        }

        // stop when close
        if (distanceBetween(this.dataType, this.customValue, this.nextValue) < this.EPS) {
            this.customValue = this.nextValue
            this.stop()
        }

        // custom callback
        this.onUpdate.invoke(this.customValue)
    }

    private computeAlpha(filter: OneEuroFilter, dataType: DataType, targetValue: SmoothValue, dt: number): number {
        if (this.oneEuroFilter) return filter.getAlpha(dataType, targetValue, dt, this.oneEuroMinCutoff, this.oneEuroBeta)
        return this.smoothing == 0 ? 1 : 1 - Math.exp(-dt / this.smoothing)
    }
}

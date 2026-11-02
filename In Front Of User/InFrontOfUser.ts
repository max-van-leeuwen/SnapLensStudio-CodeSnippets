// Max van Leeuwen
//  maxvanleeuwen.com

/*

Places (or animates) a SceneObject in front of the user's camera, at eye height!

usage
  new InFrontOfUser(cameraObject:Camera, moveObject?:SceneObject)
                            cameraObject = Camera to place in front of
                            moveObject = SceneObject to move (optional)

animate-in, once
  .start(doInstant)         animate moveObject (or jump if doInstant)
  .getFinalTransformData()  -> {pos, rot}
  .onAnimationStep          bind using .add(f) and .remove(f), called with 0-1 linear progress
  .onEnd                    bind using .add(f) and .remove(f)

continuously follow
  .smoothing = .25
  .startContinuous()
  .stopContinuous()

params
  .distanceFromCamera = 100
  .height = -30
  .rotation = true
  .duration = .4            (s)
  .spherical = false
  .lookAt = false
  .easeFunction = Easing.Cubic.InOut
  .process = data => data   post-process the {pos, rot} before it's used


example: placing an object in front of the user once
  const placer = new InFrontOfUser(this.camera, this.toPlace)
  placer.start()

example: keeping an object continuously in front of the user
  const placer = new InFrontOfUser(this.camera, this.toPlace)
  placer.smoothing = .3
  placer.startContinuous()

*/


import { LSTween } from "LSTween.lspkg/Examples/Scripts/LSTween"
import { Easing, EasingFunction } from "LSTween.lspkg/TweenJS/Easing"
import { Callback } from "./Callback"
import { SmoothFollow } from "./SmoothFollow"

type TransformData = { pos: vec3, rot: quat }

export class InFrontOfUser {
    /**
     * distance from camera (world units, cm).
     * default is 100.
     */
    distanceFromCamera = 100

    /**
     * height offset from eye-height (world units, cm).
     * default is -30.
     */
    height = -30

    /**
     * animate/follow rotation, not just position.
     * default is true.
     */
    rotation = true

    /**
     * length of the .start() animation (s).
     * default is 0.4.
     */
    duration = .4

    /**
     * places at look-at position, instead of just in front of the user at eye-height.
     * default is false.
     */
    spherical = false

    /**
     * does a true look-at rotation, instead of only around the y-axis.
     * default is false.
     */
    lookAt = false

    /**
     * animation curve for .start(). use Easing from LSTween, or a custom function.
     */
    easeFunction: EasingFunction = Easing.Cubic.InOut

    /**
     * runs on every getFinalTransformData() call, before it's used.
     * for example, to round or clamp the resulting world transform.
     */
    process: (data: TransformData) => TransformData = data => data

    /**
     * bind using .add() and .remove() (see Callback). called on every .start() animation frame with the linear (non-eased) 0-1 progress.
     */
    onAnimationStep = new Callback<[number]>()

    /**
     * bind using .add() and .remove() (see Callback). called when the .start() animation ends (or immediately, if instant).
     */
    onEnd = new Callback<[]>()

    /**
     * continuous following smoothing, see SmoothFollow.
     * default is 0.25.
     */
    smoothing = .25

    // hidden ScriptComponent on the camera's SceneObject, used to create this' update events
    private owner: ScriptComponent

    constructor(public cameraObject: Camera, public moveObject: SceneObject | null = null) {
        this.owner = cameraObject.getSceneObject().createComponent("ScriptComponent")
    }


    // --- Animating once

    /**
     * gets the final transform info the object should end up at: {pos (vec3), rot (quat)}.
     */
    getFinalTransformData(): TransformData {
        const camTrf = this.cameraObject.getTransform()
        const camPos = camTrf.getWorldPosition()
        const camFwd = camTrf.forward
        const cursorPos = camPos.add(camFwd)
        const camPosXZ = new vec3(camPos.x, 0, camPos.z)
        const cursorPosXZ = new vec3(cursorPos.x, 0, cursorPos.z)
        const fwdXZ = camPosXZ.sub(cursorPosXZ).normalize()

        // positioned in front of user at correct height
        const camHeight = new vec3(0, camPos.y, 0)
        const sphericalHeight = this.spherical ? -camFwd.uniformScale(this.distanceFromCamera).y : 0
        const heightOffset = new vec3(0, this.height + sphericalHeight, 0)
        let newPos = camPosXZ.add(fwdXZ.uniformScale(this.distanceFromCamera))
        newPos = newPos.add(heightOffset).add(camHeight)

        // look-at rotation
        let newRot: quat
        if (this.lookAt) { // facing user, true look-at
            newRot = quat.lookAt(camPos.sub(newPos).normalize(), vec3.up())
        } else { // facing user, y-axis only
            const angle = Math.atan2(fwdXZ.x, fwdXZ.z)
            newRot = quat.angleAxis(angle + Math.PI, vec3.up())
        }

        return this.process({ pos: newPos, rot: newRot })
    }

    /**
     * starts the animation. if doInstant is true, the animation is skipped and placement is instant.
     */
    start(doInstant = false) {
        const sceneTrf = this.moveObject?.getTransform()
        const finalTransformData = this.getFinalTransformData()
        const curPos = sceneTrf?.getWorldPosition()
        const curRot = sceneTrf?.getWorldRotation()

        if (this.duration === 0 || doInstant) { // instant
            if (sceneTrf) {
                sceneTrf.setWorldPosition(finalTransformData.pos)
                if (this.rotation) sceneTrf.setWorldRotation(finalTransformData.rot)
            }
            this.onAnimationStep.invoke(1)
            this.onEnd.invoke()
        } else { // animate
            LSTween.rawTween(this.duration * 1000)
                .easing(this.easeFunction)
                .onUpdate((object, elapsed) => {
                    if (sceneTrf && curPos && curRot) {
                        sceneTrf.setWorldPosition(vec3.lerp(curPos, finalTransformData.pos, object.t))
                        if (this.rotation) sceneTrf.setWorldRotation(quat.slerp(curRot, finalTransformData.rot, object.t))
                    }
                    this.onAnimationStep.invoke(elapsed)
                })
                .onComplete(() => this.onEnd.invoke())
                .start()
        }
    }



    // --- Continuously following the user

    private continuousPos: SmoothFollow | null = null
    private continuousRot: SmoothFollow | null = null
    private continuousEvent: SceneEvent | null = null

    /**
     * starts continuously following the user. requires .moveObject to be set.
     */
    startContinuous() {
        this.stopContinuous()
        if (!this.moveObject) throw ("InFrontOfUser: .moveObject must be set before calling .startContinuous()")
        const moveObject = this.moveObject

        // smoothly follow position
        this.continuousPos = new SmoothFollow(this.owner)
        this.continuousPos.smoothing = this.smoothing
        this.continuousPos.onUpdate.add(p => moveObject.getTransform().setWorldPosition(p as vec3))

        // smoothly follow rotation
        if (this.rotation) {
            this.continuousRot = new SmoothFollow(this.owner)
            this.continuousRot.smoothing = this.smoothing
            this.continuousRot.onUpdate.add(r => moveObject.getTransform().setWorldRotation(r as quat))
        }

        // on every frame, give the SmoothFollowers a new value to work towards
        this.continuousEvent = this.owner.createEvent("UpdateEvent")
        this.continuousEvent.bind(() => {
            const noSmoothing = this.smoothing == 0 // instant if no smoothing
            const finalTransformData = this.getFinalTransformData()
            this.continuousPos!.addValue(finalTransformData.pos, noSmoothing)
            if (this.continuousRot) this.continuousRot.addValue(finalTransformData.rot, noSmoothing)
        })

        // apply the first frame right away
        const finalTransformData = this.getFinalTransformData()
        moveObject.getTransform().setWorldPosition(finalTransformData.pos)
        if (this.rotation) moveObject.getTransform().setWorldRotation(finalTransformData.rot)
    }

    /**
     * stops continuously following the user.
     */
    stopContinuous() {
        if (this.continuousEvent) {
            this.owner.removeEvent(this.continuousEvent)
            this.continuousEvent = null
        }
        this.continuousPos?.stop()
        this.continuousPos = null
        this.continuousRot?.stop()
        this.continuousRot = null
    }
}

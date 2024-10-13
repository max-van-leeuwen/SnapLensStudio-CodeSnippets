import {Interactable} from "../Interaction/Interactable/Interactable"

@component
export class InteractableAudioFeedback extends BaseScriptComponent {
  @input
  @hint("This sound will play when the Interactable is hovered")
  @allowUndefined
  hoverAudioTrack: AudioTrackAsset

  @input
  @hint("This sound will play when starting the trigger the Interactable")
  @allowUndefined
  triggerStartAudioTrack: AudioTrackAsset

  @input
  @hint("This sound will play when ending the trigger of the Interactable")
  @allowUndefined
  triggerEndAudioTrack: AudioTrackAsset

  private _hoverAudioComponent: AudioComponent
  private _triggerStartAudioComponent: AudioComponent
  private _triggerEndAudioComponent: AudioComponent
  private interactable: Interactable

  onAwake() {
    this.defineScriptEvents()
  }

  private defineScriptEvents() {
    this.createEvent("OnStartEvent").bind(() => {
      this.init()
    })
  }

  /**
   * Returns the AudioComponent used for hover feedback for further configuration (such as volume).
   */
  get hoverAudioComponent(): AudioComponent {
    return this._hoverAudioComponent
  }

  /**
   * Returns the AudioComponent used for trigger start feedback for further configuration (such as volume).
   */
  get triggerStartAudioComponent(): AudioComponent {
    return this._triggerStartAudioComponent
  }

  /**
   * Returns the AudioComponent used for trigger end feedback for further configuration (such as volume).
   */
  get triggerEndAudioComponent(): AudioComponent {
    return this._triggerEndAudioComponent
  }

  private setupInteractableCallbacks() {
    this.interactable.onHoverEnter.add(() => {
      try {
        if (this._hoverAudioComponent) {
          this._hoverAudioComponent.play(1)
        }
      } catch (e) {
        print("Error playing hover audio: " + e)
      }
    })

    this.interactable.onTriggerStart.add(() => {
      try {
        if (this._triggerStartAudioComponent) {
          this._triggerStartAudioComponent.play(1)
        }
      } catch (e) {
        print("Error playing trigger start audio: " + e)
      }
    })

    this.interactable.onTriggerEnd.add(() => {
      try {
        if (this._triggerEndAudioComponent) {
          this._triggerEndAudioComponent.play(1)
        }
      } catch (e) {
        print("Error playing trigger end audio: " + e)
      }
    })
  }

  private init() {
    if (this.hoverAudioTrack) {
      this._hoverAudioComponent = this.getSceneObject().createComponent(
        "Component.AudioComponent"
      ) as AudioComponent
      this._hoverAudioComponent.playbackMode = Audio.PlaybackMode.LowLatency
      this._hoverAudioComponent.audioTrack = this.hoverAudioTrack
    }

    if (this.triggerStartAudioTrack) {
      this._triggerStartAudioComponent = this.getSceneObject().createComponent(
        "Component.AudioComponent"
      ) as AudioComponent
      this._triggerStartAudioComponent.playbackMode =
        Audio.PlaybackMode.LowLatency
      this._triggerStartAudioComponent.audioTrack = this.triggerStartAudioTrack
    }

    if (this.triggerEndAudioTrack) {
      this._triggerEndAudioComponent = this.getSceneObject().createComponent(
        "Component.AudioComponent"
      ) as AudioComponent
      this._triggerEndAudioComponent.playbackMode =
        Audio.PlaybackMode.LowLatency
      this._triggerEndAudioComponent.audioTrack = this.triggerEndAudioTrack
    }

    this.interactable = this.getSceneObject().getComponent(
      Interactable.getTypeName()
    )

    if (!this.interactable) {
      throw new Error(
        "Could not find Interactable component on this SceneObject."
      )
    }

    this.setupInteractableCallbacks()
  }
}

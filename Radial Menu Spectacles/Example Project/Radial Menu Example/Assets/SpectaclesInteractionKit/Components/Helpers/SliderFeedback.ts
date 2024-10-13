import {Slider} from "../UI/Slider/Slider"

const SLIDER_LEVEL_MIN = 0.15
const SLIDER_LEVEL_MAX = 0.85

@component
export class SliderFeedback extends BaseScriptComponent {
  @input
  @hint(
    "The components under DebugElements will be hidden on start if showDebug is unchecked."
  )
  showDebug: boolean = false
  @input
  debugElements: SceneObject[] = []
  @ui.group_start("Slider Knob")
  @input
  @label("Mesh")
  sliderKnobMesh: RenderMeshVisual
  @input
  @label("Idle Material")
  sliderKnobIdleMaterial: Material
  @input
  @label("Selected Material")
  sliderKnobSelectedMaterial: Material
  @ui.group_end
  @ui.group_start("Slider Track")
  @input
  sliderTrackMesh: RenderMeshVisual
  @input
  sliderTrackMaterial: Material
  @ui.group_end
  @input
  @allowUndefined
  sliderProgressAudio: AudioTrackAsset

  private trackMaterial: Material
  private currentSlider: Slider
  private _audioComponent: AudioComponent

  private materials: Material[]

  onAwake() {
    this.materials = [
      this.sliderKnobIdleMaterial,
      this.sliderKnobSelectedMaterial,
    ]

    this.defineScriptEvents()
  }

  private defineScriptEvents() {
    this.createEvent("OnStartEvent").bind(() => {
      this.init()
    })
  }

  /**
   * Returns the AudioComponent used for feedback for further configuration (volume).
   */
  get audioComponent(): AudioComponent {
    return this._audioComponent
  }

  init() {
    if (!this.showDebug) {
      this.debugElements.forEach(function (element) {
        element.enabled = false
      })
    }

    this.trackMaterial = this.sliderTrackMaterial.clone()
    this.sliderTrackMesh.mainMaterial = this.trackMaterial

    this.currentSlider = this.getSceneObject().getComponent(
      Slider.getTypeName()
    )
    this._audioComponent = this.getSceneObject().createComponent(
      "Component.AudioComponent"
    )
    this.audioComponent.playbackMode = Audio.PlaybackMode.LowLatency

    // Set up the material so that it reflects the selected colors and slider level
    this.trackMaterial.mainPass.Level = this.getSliderLevelFromValue(
      this.currentSlider.currentValue
    )
    // Set up the slider audio
    if (!isNull(this.sliderProgressAudio)) {
      this.audioComponent.audioTrack = this.sliderProgressAudio
    }

    this.setupSliderCallbacks()
  }

  setupSliderCallbacks() {
    // Modify the material on slider changes by subscribing to value updates
    this.currentSlider.onValueUpdate.add((value) => {
      this.trackMaterial.mainPass.Level = this.getSliderLevelFromValue(value)

      if (!isNull(this.audioComponent.audioTrack)) {
        this.audioComponent.play(1)
      }
    })

    this.currentSlider.onSlideStart.add(() => {
      this.changeMesh(this.sliderKnobSelectedMaterial)
    })

    this.currentSlider.onSlideEnd.add(() => {
      this.changeMesh(this.sliderKnobIdleMaterial)
    })
  }

  getSliderLevelFromValue(value) {
    if (value <= this.currentSlider.minValue) {
      return 0
    } else if (value >= this.currentSlider.maxValue) {
      return 1
    } else {
      var progress =
        (value - this.currentSlider.minValue) /
        (this.currentSlider.maxValue - this.currentSlider.minValue)
      return SLIDER_LEVEL_MIN + (SLIDER_LEVEL_MAX - SLIDER_LEVEL_MIN) * progress
    }
  }

  private removeMaterials(): void {
    let materials = []

    const matCount = this.sliderKnobMesh.getMaterialsCount()

    for (let k = 0; k < matCount; k++) {
      const material = this.sliderKnobMesh.getMaterial(k)

      if (this.materials.includes(material)) {
        continue
      }

      materials.push(material)
    }

    this.sliderKnobMesh.clearMaterials()

    for (var k = 0; k < materials.length; k++) {
      this.sliderKnobMesh.addMaterial(materials[k])
    }
  }

  // Changes the material of provided RenderMeshVisual.
  private changeMesh(material: Material): void {
    this.removeMaterials()

    this.sliderKnobMesh.addMaterial(material)
  }
}

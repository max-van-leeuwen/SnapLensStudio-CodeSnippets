const TAG = "ConfigurationValidator"

@component
export class ConfigurationValidator extends BaseScriptComponent {
  onAwake() {
    if (
      !global.deviceInfoSystem.isSpectacles() &&
      global.deviceInfoSystem.isEditor()
    ) {
      throw new Error(
        "To run Spectacles Interaction Kit in the Lens Studio Preview, set the Preview Panel's Device Type Override to Spectacles, or the Simulation Mode to Spectacles (2024)!"
      )
    }
  }
}

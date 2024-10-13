import SIKLogLevelProvider from "../../Providers/InteractionConfigurationProvider/SIKLogLevelProvider"
import {LogLevelConfiguration} from "./LogLevelConfiguration"

const TAG = "SIKLogLevelConfiguration"

/**
 * Allows the user to select the log level filter for SIK types from a lens studio component.
 */
@component
export class SIKLogLevelConfiguration extends LogLevelConfiguration {
  private SIKLogLevelProvider = SIKLogLevelProvider.getInstance()

  onAwake() {
    this.SIKLogLevelProvider.logLevel = this.logLevelFilter
  }
}

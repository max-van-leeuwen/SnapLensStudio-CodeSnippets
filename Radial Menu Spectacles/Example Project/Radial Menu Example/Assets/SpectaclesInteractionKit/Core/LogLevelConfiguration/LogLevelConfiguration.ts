const TAG = "LogLevelConfiguration"

/**
 * Allows the user to select the log level filter from a lens studio component.
 */
@component
export abstract class LogLevelConfiguration extends BaseScriptComponent {
  @input("int")
  @widget(
    new ComboBoxWidget([
      new ComboBoxItem("Error", 3),
      new ComboBoxItem("Warning", 4),
      new ComboBoxItem("Info", 6),
      new ComboBoxItem("Debug", 7),
      new ComboBoxItem("Verbose", 8),
    ])
  )
  protected logLevelFilter: number = 8
}

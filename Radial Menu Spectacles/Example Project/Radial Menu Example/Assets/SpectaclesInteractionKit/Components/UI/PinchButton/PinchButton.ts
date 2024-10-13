import {InteractorEvent} from "../../../Core/Interactor/InteractorEvent"
import Event from "../../../Utils/Event"
import {createCallback} from "../../../Utils/InspectorCallbacks"
import NativeLogger from "../../../Utils/NativeLogger"
import {Interactable} from "../../Interaction/Interactable/Interactable"

const TAG = "PinchButton"

/*
 * PinchButton provides basic pinch button functionality for the prefab pinch button.
 * It is meant to be added to a Scene Object with an Interactable component, with visual behavior configured in the Lens Studio scene.
 */
@component
export class PinchButton extends BaseScriptComponent {
  @input
  @hint(
    "Enable this to add functions from another script to this component's callback events"
  )
  editEventCallbacks: boolean = false
  @ui.group_start("On Button Pinched Callbacks")
  @showIf("editEventCallbacks")
  @input
  @hint("The script containing functions to be called when button is pinched")
  @allowUndefined
  private customFunctionForOnButtonPinched: ScriptComponent
  @input
  @hint(
    "The names for the functions on the provided script, to be called on button pinch"
  )
  @allowUndefined
  private onButtonPinchedFunctionNames: string[] = []
  @ui.group_end
  private interactable: Interactable

  private onButtonPinchedEvent = new Event<InteractorEvent>()
  public readonly onButtonPinched = this.onButtonPinchedEvent.publicApi()

  // Native Logging
  private log = new NativeLogger(TAG)

  onAwake() {
    this.interactable = this.getSceneObject().getComponent(
      Interactable.getTypeName()
    )

    this.createEvent("OnStartEvent").bind(() => {
      if (!this.interactable) {
        throw new Error(
          "Pinch Button requires an Interactable Component on the same Scene object in order to work - please ensure one is added."
        )
      }
      this.interactable.onTriggerEnd.add((interactorEvent: InteractorEvent) => {
        try {
          if (this.enabled) {
            this.onButtonPinchedEvent.invoke(interactorEvent)
          }
        } catch (e) {
          this.log.e("Error invoking onButtonPinchedEvent!")
        }
      })
    })
    if (this.editEventCallbacks && this.customFunctionForOnButtonPinched) {
      this.onButtonPinched.add(
        createCallback<InteractorEvent>(
          this.customFunctionForOnButtonPinched,
          this.onButtonPinchedFunctionNames
        )
      )
    }
  }
}

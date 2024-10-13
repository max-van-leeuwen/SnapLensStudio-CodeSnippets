import {SIK} from "../../../../SIK"
import Event from "../../../../Utils/Event"
import StateMachine from "../../../../Utils/StateMachine"
import {InteractionConfigurationProvider} from "../../../InteractionConfigurationProvider/InteractionConfigurationProvider"
import {PalmTapEventType} from "../PalmTapEvent"

const TAG = "PalmTapDetectorStateMachine"

export enum PalmTapDetectorState {
  Idle = "Idle",
  Tap = "Tap",
}

/**
 * Tracks states and transitions of palm tapping
 */
export default class PalmTapDetectorStateMachine {
  private interactionConfigurationProvider: InteractionConfigurationProvider =
    SIK.InteractionConfiguration

  private stateMachine = new StateMachine("PalmTapDetectorStateMachine")

  private onPalmTapDownEvent = new Event()
  readonly onPalmTapDown = this.onPalmTapDownEvent.publicApi()

  private onPalmTapUpEvent = new Event()
  readonly onPalmTapUp = this.onPalmTapUpEvent.publicApi()

  constructor() {
    this.setupStateMachine()
  }

  /**
   * @returns whether the user is tapping
   */
  public isTapping(): boolean {
    return this.stateMachine.currentState?.name === PalmTapDetectorState.Tap
  }

  /**
   * Notifies that a palm tap event has been detected
   * @param palmTapEventType The type of event that was detected
   */
  public notifyPalmTapEvent(palmTapEventType: PalmTapEventType): void {
    this.stateMachine.sendSignal(palmTapEventType)
  }

  private setupStateMachine() {
    this.stateMachine.addState({
      name: PalmTapDetectorState.Idle,
      onEnter: () => {},
      transitions: [
        {
          nextStateName: PalmTapDetectorState.Tap,
          checkOnSignal: (signal: string) => {
            return signal === PalmTapEventType.Down
          },
        },
      ],
    })

    this.stateMachine.addState({
      name: PalmTapDetectorState.Tap,
      onEnter: () => {
        this.onPalmTapDownEvent.invoke()
      },
      onExit: () => {
        this.onPalmTapUpEvent.invoke()
      },
      transitions: [
        {
          nextStateName: PalmTapDetectorState.Idle,
          checkOnSignal: (signal: string) => {
            return signal === PalmTapEventType.Up
          },
        },
      ],
    })
    this.stateMachine.enterState(PalmTapDetectorState.Idle)
  }
}

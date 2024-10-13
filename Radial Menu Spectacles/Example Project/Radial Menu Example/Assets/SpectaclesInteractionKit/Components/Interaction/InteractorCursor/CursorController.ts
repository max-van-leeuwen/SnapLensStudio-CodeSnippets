import {InteractionManager} from "../../../Core/InteractionManager/InteractionManager"
import BaseInteractor from "../../../Core/Interactor/BaseInteractor"
import {
  Interactor,
  InteractorInputType,
} from "../../../Core/Interactor/Interactor"
import {SIK} from "../../../SIK"
import {InteractorCursor} from "./InteractorCursor"

@component
export class CursorController extends BaseScriptComponent {
  private cursorControllerProvider = SIK.CursorController

  onAwake() {
    const interactors = InteractionManager.getInstance().getInteractorsByType(
      InteractorInputType.All
    )

    interactors.forEach((interactor: Interactor) => {
      let cursor = this.getSceneObject().createComponent(
        InteractorCursor.getTypeName()
      )
      cursor.interactor = interactor as BaseInteractor
    })
  }

  /**
   * @deprecated in favor of getCursorByInteractor
   * Gets the InteractorCursor for a specified interactor
   * @param interactor The interactor to get the cursor for
   * @returns the InteractorCursor for the requested interactor, or null if it doesn't exist
   */
  getCursor(interactor: Interactor): InteractorCursor | null {
    return this.cursorControllerProvider.getCursor(interactor)
  }

  /**
   * Gets the InteractorCursor for a specified interactor
   * @param interactor The interactor to get the cursor for
   * @returns the InteractorCursor for the requested interactor, or null if it doesn't exist
   */
  getCursorByInteractor(interactor: Interactor): InteractorCursor | null {
    return this.cursorControllerProvider.getCursorByInteractor(interactor)
  }

  /**
   * Gets the InteractorCursor for a specified input type
   * @param inputType The InteractorInputType to get the cursor for
   * @returns the InteractorCursor for the requested InteractorInputType, or null if it doesn't exist
   */
  getCursorByInputType(
    inputType: InteractorInputType
  ): InteractorCursor | null {
    return this.cursorControllerProvider.getCursorByInputType(inputType)
  }

  /**
   * Gets all InteractorCursors within the scene
   * @returns a list of InteractorCursors
   */
  getAllCursors(): InteractorCursor[] {
    return this.cursorControllerProvider.getAllCursors()
  }
}

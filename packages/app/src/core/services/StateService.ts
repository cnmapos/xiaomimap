import { IService } from "./IService";
import { EditorState } from "../../stores/useEditorStore";
import { AniKeyframe, ServiceIds } from "../types";

export interface IStateService extends IService {
  addKeyframe: (keyframe: AniKeyframe) => void;
  removeKeyframe: (keyframe: AniKeyframe) => void;
}

export class StateService implements IStateService {
  id: string;

  private state: EditorState;

  constructor(state: EditorState) {
    this.id = ServiceIds.STATE;
    this.state = state;
  }
  addKeyframe(keyframe: AniKeyframe) {
    this.state.addKeyframe(keyframe);
  }
  removeKeyframe(keyframe: AniKeyframe) {
    this.state.removeKeyframe(keyframe);
  }
}

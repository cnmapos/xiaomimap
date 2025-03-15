import { IService } from "./IService";
import { AnimationState } from "../../stores/useAnimationStore";
import { ServiceIds } from "../types";
import { AniKeyframe } from "@/typings/animation";

export interface IStateService extends IService {
  addKeyframe: (keyframe: AniKeyframe) => void;
  removeKeyframe: (keyframe: AniKeyframe) => void;
}

export class StateService implements IStateService {
  id: string;

  private state: AnimationState;

  constructor(state: AnimationState) {
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

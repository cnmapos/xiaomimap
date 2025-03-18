import { IService } from "./IService";
import { AnimationState } from "../../stores/useAnimationStore";
import { ServiceIds } from "../types";
import { AniKeyframe, AniLayer } from "@/typings/animation";

export interface IStateService extends IService {
  addLayer: (layer: AniLayer) => void;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, layerPartial: Partial<AniLayer>) => void;

  addKeyframe: (layerId: string, keyframe: AniKeyframe) => void;
  removeKeyframe: (layerId: string, keyframeId: string) => void;
  updateKeyframe: (
    layerId: string,
    keyframeId: string,
    keyframePartial: Partial<AniKeyframe>
  ) => void;
}

export class StateService implements IStateService {
  id: string;
  state: AnimationState;
  private history: Array<{ type: string; data: any }> = [];
  private currentIndex: number = -1;

  constructor(state: AnimationState) {
    this.id = ServiceIds.STATE;
    this.state = state;
  }

  private recordChange(type: string, data: any) {
    // 清除当前指针之后的历史记录
    this.history.splice(this.currentIndex + 1);
    this.history.push({ type, data });
    this.currentIndex++;
  }

  undo() {
    if (this.currentIndex < 0) return;

    const change = this.history[this.currentIndex];
    switch (change.type) {
      case "addLayer":
        this.state.removeLayer(change.data.id);
        break;
      case "removeLayer":
        this.state.addLayer(change.data);
        break;
      case "updateLayer":
        this.state.updateLayer(change.data.id, change.data.prevState);
        break;
      case "addKeyframe":
        this.state.removeKeyframe(change.data.layerId, change.data.keyframe.id);
        break;
      case "removeKeyframe":
        this.state.addKeyframe(change.data.layerId, change.data.keyframe);
        break;
      case "updateKeyframe":
        this.state.updateKeyframe(
          change.data.layerId,
          change.data.keyframeId,
          change.data.prevState
        );
        break;
    }
    this.currentIndex--;
  }

  addLayer(layer: AniLayer) {
    this.recordChange("addLayer", layer);
    this.state.addLayer(layer);
  }

  removeLayer(id: string) {
    const layer = this.state.getLayer(id);
    if (layer) {
      this.recordChange("removeLayer", layer);
      this.state.removeLayer(id);
    }
  }

  updateLayer(id: string, layerPartial: Partial<AniLayer>) {
    const prevState = this.state.getLayer(id);
    if (prevState) {
      this.recordChange("updateLayer", { id, prevState });
      this.state.updateLayer(id, layerPartial);
    }
  }

  addKeyframe(layerId: string, keyframe: AniKeyframe) {
    this.recordChange("addKeyframe", { layerId, keyframe });
    this.state.addKeyframe(layerId, keyframe);
  }

  removeKeyframe(layerId: string, keyframeId: string) {
    const keyframe = this.state.getKeyframe(layerId, keyframeId);
    if (keyframe) {
      this.recordChange("removeKeyframe", { layerId, keyframe });
      this.state.removeKeyframe(layerId, keyframeId);
    }
  }

  updateKeyframe(
    layerId: string,
    keyframeId: string,
    keyframePartial: Partial<AniKeyframe>
  ) {
    const prevState = this.state.getKeyframe(layerId, keyframeId);
    if (prevState) {
      this.recordChange("updateKeyframe", { layerId, keyframeId, prevState });
      this.state.updateKeyframe(layerId, keyframeId, keyframePartial);
    }
  }
}

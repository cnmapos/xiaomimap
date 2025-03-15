// stores/useEditorStore.ts
import { AniKeyframe, AniLayer } from "@/typings/animation";
import { create } from "zustand";

export interface AnimationState {
  // 时间轴相关状态
  currentTime: number;
  duration: number;

  layers: AniLayer[];

  // 操作方法
  addLayer: (layer: AniLayer) => void;
  removeLayer: (id: string) => void;

  addKeyframe: (layerId: string, keyframe: AniKeyframe) => void;
  removeKeyframe: (layerId: string, keyframeId: string) => void;
}

export const useEditorStore = create<AnimationState>((set, get) => ({
  currentTime: 0,
  duration: 10,
  layers: [],

  addLayer: (layer: AniLayer) =>
    set((state) => ({ layers: [...state.layers, layer] })),

  removeLayer: (id: string) =>
    set((state) => ({
      layers: state.layers.filter((layer) => layer.id !== id),
    })),

  addKeyframe: (layerId: string, keyframe: AniKeyframe) => {
    set((state) => {
      const layer = state.layers.find((l) => l.id === layerId);
      if (layer) {
        layer.keyframes.push(keyframe);
      }
      return {
        layers: state.layers,
      };
    });
  },

  removeKeyframe: (layerId: string, keyframeId: string) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === layerId
          ? {
              ...layer,
              keyframes: layer.keyframes.filter((kf) => kf.id !== keyframeId),
            }
          : layer
      ),
    })),
}));

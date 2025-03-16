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
  getLayer: (id: string) => AniLayer | undefined;
  removeLayer: (id: string) => void;
  updateLayer: (id: string, layerPartial: Partial<AniLayer>) => void;

  addKeyframe: (layerId: string, keyframe: AniKeyframe) => void;
  getKeyframe: (layerId: string, keyframeId: string) => AniKeyframe | undefined;
  removeKeyframe: (layerId: string, keyframeId: string) => void;
  updateKeyframe: (
    layerId: string,
    keyframeId: string,
    keyframePartial: Partial<AniKeyframe>
  ) => void;
}

// 计算单个layer的startTime和endTime
const calculateLayerTime = (keyframes: AniKeyframe[]) => {
  if (keyframes.length === 0) return { startTime: 0, endTime: 0 };
  const startTime = Math.min(...keyframes.map((kf) => kf.startTime));
  const endTime = Math.max(...keyframes.map((kf) => kf.endTime));
  return { startTime, endTime };
};

// 计算所有layer的duration
const calculateDuration = (layers: AniLayer[]) => {
  if (layers.length === 0) return 0;
  const startTime = Math.min(...layers.map((layer) => layer.startTime));
  const endTime = Math.max(...layers.map((layer) => layer.endTime));
  return endTime - startTime;
};

export const useEditorStore = create<AnimationState>((set, get) => ({
  currentTime: 0,
  duration: 0,
  layers: [],

  addLayer: (layer: AniLayer) =>
    set((state) => {
      const { startTime, endTime } = calculateLayerTime(layer.keyframes);
      const newLayer = { ...layer, startTime, endTime };
      const newLayers = [...state.layers, newLayer];
      return {
        layers: newLayers,
        duration: calculateDuration(newLayers),
      };
    }),

  getLayer: (id: string) => {
    return get().layers.find((layer) => layer.id === id);
  },

  removeLayer: (id: string) =>
    set((state) => {
      const newLayers = state.layers.filter((layer) => layer.id !== id);
      return {
        layers: newLayers,
        duration: calculateDuration(newLayers),
      };
    }),

  updateLayer(id: string, layerPartial: Partial<AniLayer>) {
    set((state) => {
      const layer = state.layers.find((l) => l.id === id);
      if (layer) {
        const updatedLayer = { ...layer, ...layerPartial };
        const newLayers = state.layers.map((l) =>
          l.id === id ? updatedLayer : l
        );
        return {
          layers: newLayers,
          duration: calculateDuration(newLayers),
        };
      }
      return { layers: state.layers };
    });
  },

  addKeyframe: (layerId: string, keyframe: AniKeyframe) => {
    set((state) => {
      const layer = state.layers.find((l) => l.id === layerId);
      if (layer) {
        const newKeyframes = [...layer.keyframes, keyframe];
        const { startTime, endTime } = calculateLayerTime(newKeyframes);
        const updatedLayer = {
          ...layer,
          keyframes: newKeyframes,
          startTime,
          endTime,
        };
        const newLayers = state.layers.map((l) =>
          l.id === layerId ? updatedLayer : l
        );
        return {
          layers: newLayers,
          duration: calculateDuration(newLayers),
        };
      }
      return { layers: state.layers };
    });
  },

  getKeyframe(layerId, keyframeId) {
    const layer = get().layers.find((l) => l.id === layerId);
    if (layer) {
      return layer.keyframes.find((kf) => kf.id === keyframeId);
    }
  },

  removeKeyframe: (layerId: string, keyframeId: string) =>
    set((state) => {
      const layer = state.layers.find((l) => l.id === layerId);
      if (layer) {
        const newKeyframes = layer.keyframes.filter(
          (kf) => kf.id !== keyframeId
        );
        const { startTime, endTime } = calculateLayerTime(newKeyframes);
        const updatedLayer = {
          ...layer,
          keyframes: newKeyframes,
          startTime,
          endTime,
        };
        const newLayers = state.layers.map((l) =>
          l.id === layerId ? updatedLayer : l
        );
        return {
          layers: newLayers,
          duration: calculateDuration(newLayers),
        };
      }
      return { layers: state.layers };
    }),

  updateKeyframe(layerId, keyframeId, keyframePartial) {
    set((state) => {
      const layer = state.layers.find((l) => l.id === layerId);
      if (layer) {
        const newKeyframes = layer.keyframes.map((kf) =>
          kf.id === keyframeId ? { ...kf, ...keyframePartial } : kf
        );
        const { startTime, endTime } = calculateLayerTime(newKeyframes);
        const updatedLayer = {
          ...layer,
          keyframes: newKeyframes,
          startTime,
          endTime,
        };
        const newLayers = state.layers.map((l) =>
          l.id === layerId ? updatedLayer : l
        );
        return {
          layers: newLayers,
          duration: calculateDuration(newLayers),
        };
      }
      return { layers: state.layers };
    });
  },
}));

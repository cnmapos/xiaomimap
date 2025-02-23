// stores/useEditorStore.ts
import { AniKeyframe } from "@/core/types";
import { create } from "zustand";

export interface EditorState {
  // 时间轴相关状态
  currentTime: number;
  duration: number;

  // 操作方法
  addKeyframe: (keyframe: AniKeyframe) => void;
  removeKeyframe: (keyframe: AniKeyframe) => void;
}

export const useEditorStore = create<EditorState>((set) => ({}));

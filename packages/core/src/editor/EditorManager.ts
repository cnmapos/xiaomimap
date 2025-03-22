import { PointEditor } from './PointEditor';
import { LineEditor } from './LineEditor';
import { PolygonEditor } from './PolygonEditor';
import { Color } from 'cesium';
import { EditorBase } from './EditorBase';
import { HzEditor, IViewer } from '../types';

export class EditorManager {
  private editors: Map<string, EditorBase> = new Map();

  constructor(viewer: IViewer) {
    console.log(viewer);
    // 设置默认样式
    this.editors.set(
      'point',
      new PointEditor(viewer, {
        pixelSize: 10,
        color: Color.RED,
      })
    );
    this.editors.set(
      'line',
      new LineEditor(viewer, {
        width: 3,
        material: Color.BLUE,
      })
    );
    this.editors.set(
      'polygon',
      new PolygonEditor(viewer, {
        material: Color.GREEN.withAlpha(0.5),
      })
    );
  }

  startCreate(
    type: HzEditor.Types,
    options?: HzEditor.CreateOption[typeof type],
    onEndCreate?: (coordinates: number[] | number[][]) => void
  ): EditorBase {
    const editor = this.editors.get(type);
    if (editor) {
      if (onEndCreate) {
        editor.onEndCreate = onEndCreate;
      }
      editor.startCreate(options);
    }

    return editor;
  }
}

# editor

## V1.0

新增点、线、面方式

```
  function addPoint() {
    const manager = new EditorManager(context.current.viewer);
    manager.startCreate('point', {}, (coordinates) => {
      console.log('point', coordinates);
    });
  }

  function addLine() {
    const manager = new EditorManager(context.current.viewer);
    manager.startCreate('line', {}, (coordinates) => {
      console.log('draw line', coordinates);
    });
  }

  function addPolygon() {
    const manager = new EditorManager(context.current.viewer);
    manager.startCreate('polygon', {}, (coordinates) => {
      console.log('draw polygon', coordinates);
    });
  }
```

## V2.0

聚集所有地图编辑相关功能，地图交互通过behavior实现,编辑逻辑通过modes实现。

behavior:鼠标单击、双击等操作事件触发器；
mode：一个完整的编辑流程，比如绘制线段、绘制多边形等，通过一个mode串联编辑流程。

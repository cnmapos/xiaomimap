# 开发准则

packages职责划分：

- 所有地图功能统一通过core对外提供，app应用中不能直接引用cesium。
- 动画功能集中到animations中。
- app使用IDE框架开发界面，动画、地图功能应用animations和core。
- app使用的数据类资源统一从resources中引用。

import {
  Cartesian2,
  Cartographic,
  defined,
  Math as CMath,
  Viewer,
  Cartesian3,
  Color,
  Entity,
  CallbackProperty,
  Primitive,
  PolygonGeometry,
  GeometryInstance,
  MaterialAppearance,
  Material,
  PolygonOutlineGeometry,
  VertexFormat,
  PolygonHierarchy,
  ColorGeometryInstanceAttribute,
  PolylineMaterialAppearance,
  PerInstanceColorAppearance,
  PolylineGeometry,
  CustomShader,
  UniformType,
} from 'cesium';
import { IPlayer } from '../../types';

type PolygonOptions = {
  color?: string;
  outlineColor?: string;
  outlineWidth?: number;
  showOutline?: boolean;
  direction?: Direction;
  extrudedHeight?: number;
  loop?: boolean;
};

type Rgba = {
  r: number;
  g: number;
  b: number;
  a?: number;
};

enum Direction {
  leftRight = 0,
  rightLeft = 1,
  upDown = 2,
  downUp = 3,
}

export class PolygonPlayer implements IPlayer {
  private primitive: Primitive;
  private edgePrimitive: Primitive;
  private color: Rgba;
  private outlineColor: Rgba;
  private outlineWidth: number;
  private showOutline: boolean;
  private pausing: boolean;
  private direction: Direction;
  private loop: boolean;

  constructor(
    private viewer: Viewer,
    private coordinates: any[],
    options?: PolygonOptions
  ) {
    const {
      color = '#FFFF00',
      outlineColor = '#FFFFFF',
      outlineWidth = 1.0,
      showOutline = false,
      direction = Direction.downUp,
      extrudedHeight = 0,
      loop = false,
    } = options || ({} as PolygonOptions);

    const points = Cartesian3.fromDegreesArrayHeights(
      this.coordinates.map((c) => [...c, extrudedHeight]).flat()
    );

    const edgeGeometry = new PolylineGeometry({
      positions: points,
      width: (this.outlineWidth = outlineWidth),
    });
    const colorObj = Color.fromCssColorString(color);
    this.loop = loop;
    this.color = { r: colorObj.red, g: colorObj.green, b: colorObj.blue };
    const outColorObj = Color.fromCssColorString(outlineColor);
    this.outlineColor = {
      r: outColorObj.red,
      g: outColorObj.green,
      b: outColorObj.blue,
    };
    this.showOutline = showOutline;
    this.direction = direction;
    this.primitive = this.viewer.scene.primitives.add(
      new Primitive({
        geometryInstances: new GeometryInstance({
          geometry: new PolygonGeometry({
            polygonHierarchy: {
              positions: Cartesian3.fromDegreesArray(this.coordinates.flat()),
              holes: [],
            },
            extrudedHeight: extrudedHeight,
          }),
        }),
        appearance: new MaterialAppearance({
          material: new Material({
            fabric: {
              type: 'FadeMaterial',
              uniforms: {
                time: 0.0,
                r: this.color.r,
                g: this.color.g,
                b: this.color.b,
              },
              source: `
                    uniform float time;
                    uniform float r;
                    uniform float g;
                    uniform float b;
     
                    czm_material czm_getMaterial(czm_materialInput materialInput)
                    {
                        czm_material material = czm_getDefaultMaterial(materialInput);
                        float fade = smoothstep(0.0, 1.0, time);
                        ${
                          this.direction === Direction.leftRight
                            ? `
                                if (materialInput.st.x > fade) {
                                    discard;
                                }
                            `
                            : this.direction === Direction.rightLeft
                              ? `
                                if (materialInput.st.x < 1.0 - fade) {
                                    discard;
                                }
                            `
                              : this.direction === Direction.downUp
                                ? `
                                if (materialInput.st.y > fade) {
                                    discard;
                                }`
                                : ` 
                                 if (materialInput.st.y < 1.0 - fade) {
                                    discard;
                                }
                              `
                        }
                        // if (materialInput.st.y > fade) {
                        //     discard;
                        // }

                        fade = max(fade, 0.1);
                        material.diffuse = vec3(r, g, b); // 红色
                        material.alpha = fade;
                        return material;
                    }
                `,
            },
          }),
        }),
      })
    );
    this.edgePrimitive = this.viewer.scene.primitives.add(
      new Primitive({
        geometryInstances: new GeometryInstance({
          geometry: edgeGeometry,
        }),
        appearance: new PolylineMaterialAppearance({
          material: new Material({
            fabric: {
              type: 'FadeMaterial',
              uniforms: {
                time: 0.0,
                r: this.outlineColor.r,
                g: this.outlineColor.g,
                b: this.outlineColor.b,
              },
              source: `
                      uniform float time;
                      uniform float r;
                      uniform float g;
                      uniform float b;
       
                      czm_material czm_getMaterial(czm_materialInput materialInput)
                      {
                          czm_material material = czm_getDefaultMaterial(materialInput);
                          float fade = smoothstep(0.0, 1.0, time);
      
                          if (materialInput.st.y > fade) {
                              discard;
                          }

                          fade = max(fade, 0.1);
                          material.diffuse = vec3(r, g, b); // 红色
                          material.alpha = ${this.showOutline ? 'fade' : '0.0'};
                          return material;
                      }
                  `,
            },
          }),
        }),
      })
    );

    // 更新材质的时间参数
    let time = 0.0;
    viewer.scene.preUpdate.addEventListener(() => {
      time += 0.01; // 控制淡入淡出的速度
      if (time > 1.0) {
        if (this.loop) {
          time = 0.0; // 重置时间
        }
      }
      this.primitive.appearance.material.uniforms.time = time;
      this.edgePrimitive.appearance.material.uniforms.time = time;
    });
  }

  play() {
    // this.primitive.appearance.material.uniforms.r = this.color.r;
    // this.primitive.appearance.material.uniforms.g = this.color.g;
    // this.primitive.appearance.material.uniforms.b = this.color.b;
  }
  pause() {
    // this.pausing = true;
  }
  replay() {}
}

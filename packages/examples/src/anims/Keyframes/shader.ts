function _getScanSegmentShader() {
  const inpram = 18; // 控制扩散的强度
  const scanSegmentShader =
    ` 
      uniform sampler2D colorTexture;
      uniform sampler2D depthTexture;
      in vec2 v_textureCoordinates;
      uniform vec4 u_scanCenterEC;
      uniform vec3 u_scanPlaneNormalEC;
      uniform float u_radius;
      uniform vec4 u_scanColor;
      out vec4 fragColor;
  
      // 计算深度信息
      float getDepth(in vec4 depth){
          float z_window = czm_unpackDepth(depth);
          z_window = czm_reverseLogDepth(z_window);
          return z_window;
      }
  
      void main(){
        fragColor = texture(colorTexture, v_textureCoordinates);
        float depth = getDepth(texture(depthTexture, v_textureCoordinates));
        vec4 viewPos = toEye(v_textureCoordinates, depth);
        vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);
        float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);
        if(dis < u_radius){
          float f = 1.0 - abs(u_radius - dis) / u_radius;
          f = pow(f, float(` +
    inpram +
    `));
          fragColor = mix(fragColor,u_scanColor,f);
        }
        fragColor.a = fragColor.a / 2.0;
      }`;
  return scanSegmentShader;
}

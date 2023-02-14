// this is the fragment (or pixel) shader

precision mediump float; 
    // sets the precision for floating point computation

// The object that fetches data from texture.
// Must be set outside the shader.
uniform sampler2D uSampler;
uniform bool uHasSecondTexture; 
uniform sampler2D uOtherTexture;
uniform bool uHasThirdTexture; 
uniform sampler2D uNextTexture;

// Color of pixel
uniform vec4 uPixelColor;  
uniform float rWeight2;
uniform float rWeight3;

// The "varying" keyword is for signifying that the texture coordinate will be
// interpolated and thus varies. 
varying vec2 vTexCoord;
varying vec2 vTexCoord2;
varying vec2 vTexCoord3;

void main(void)  {
    // texel color look up based on interpolated UV value in vTexCoord
    vec4 c = texture2D(uSampler, vec2(vTexCoord.s, vTexCoord.t));
    // 
    
    // different options:
    // e.g.  tint the transparent area also
    // vec4 result = c * (1.0-uPixelColor.a) + uPixelColor * uPixelColor.a;
    
    // or: tint the textured area, and leave transparent area as defined by the texture
    vec3 r = vec3(c) * (1.0-uPixelColor.a) + vec3(uPixelColor) * uPixelColor.a;
    float a = c.a;  // alpha to use

    if (uHasSecondTexture && 
        (vTexCoord2.s >= 0.0) &&
        (vTexCoord2.s <= 1.0) &&
        (vTexCoord2.t >= 0.0) &&
        (vTexCoord2.t <= 1.0) 
    ) {
        vec4 c2 = texture2D(uOtherTexture, vec2(vTexCoord2.s, vTexCoord2.t));
        
        // only applies to regions where c2 is sufficiently opaque
        // remember alpha of 1.0 is "opaque"
        if (c2.a > 0.9) {
            // Blending function ...
            vec3 blendColor = ((1.0 - rWeight2) * vec3(c2));
            r = r * rWeight2 + blendColor;
            a = length(blendColor) + ((1.0 - rWeight2) * a);
        }
    }

    if (uHasThirdTexture && 
        (vTexCoord3.s >= 0.0) &&
        (vTexCoord3.s <= 1.0) &&
        (vTexCoord3.t >= 0.0) &&
        (vTexCoord3.t <= 1.0) 
    ) {
        vec4 c3 = texture2D(uNextTexture, vec2(vTexCoord3.s, vTexCoord3.t));
        
        // only applies to regions where c2 is sufficiently opaque
        // remember alpha of 1.0 is "opaque"
        if (c3.a > 0.9) {
            // Blending function ...
            vec3 blendColor = ((1.0 - rWeight3) * vec3(c3));
            r = r * rWeight3 + blendColor;
            a = length(blendColor) + ((1.0 - rWeight3) * a);
        }
    }
    vec4 result = vec4(r, a);
    
    // or: ignore pixel tinting ...
    // vec4 result = c;

    // or: simply multiply pixel color with texture color
    // vec4 result = c * uPixelColor;

    gl_FragColor = result;
}
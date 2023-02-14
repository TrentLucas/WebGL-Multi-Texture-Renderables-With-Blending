"use strict";

//import * as TextureRenderable from "../renderables/texture_renderable.js";
import TextureRenderable from "./texture_renderable.js";
import * as glSys from "../core/gl.js";
import * as texture from "../resources/texture.js";
import * as shaderResources from "../core/shader_resources.js";

const eTexEffectFlag = Object.freeze({
    eNone: 0,
    eTransparent: 1,
    eOverride: 2,
    eBlend: 3
});


class MultiTextureRenderable extends TextureRenderable {
    // myTexture: covers the entire Renderable
    // secTex, thirdTex: effect textures
    constructor(myTexture, secTex, thirdTex = null) {
        super();
        this.color = [1, 1, 1, 0];
        super.setColor(this.color); // Alpha of 0: switch off tinting of texture
        super._setShader(shaderResources.getMTextureShader());
        this.mTexture = myTexture;  // texture for this object, cannot be a "null"
        this.mSecondTexture = secTex;
        this.mSecondTextureBlend = null;
        this.mThirdTexture = thirdTex;
        this.mThirdTexturePlacement = [0.0, 0.0, 1.0, 1.0, 0.0];  // u, v, w, h, theta
        this.mThirdTextureBlend = null;

        this.mEffectMode = null;

        this.mSecondTextureTemp = this.mSecondTexture;
        this.mSecondTextureBlendTemp = this.mSecondTextureBlend;
        this.mThirdTextureTemp = this.mThirdTexture;
        this.mThirdTextureBlendTemp = this.mThirdTextureBlend;

    }

    // index: 0 is not used
    //        1, 2: the effect textures
    // mode: eTexEffectFlag.eNone, eTransparent, eOverride, or eBlend
    setTexEffectMode(index, mode) {
        if (index == 1) {
            if (mode == eTexEffectFlag.eNone) {
                this.mSecondTexture = null;
            }
            if (mode == eTexEffectFlag.eTransparent) {
                this.mSecondTexture = this.mSecondTextureTemp;
                this.mSecondTextureBlend = 1.0;
            }
            if (mode == eTexEffectFlag.eOverride) {
                this.mSecondTexture = this.mSecondTextureTemp;
                this.mSecondTextureBlend = 0.0;
            }
            if (mode == eTexEffectFlag.eBlend) {
                this.mSecondTexture = this.mSecondTextureTemp;
                this.mSecondTextureBlend = this.mSecondTextureBlendTemp;
            }
        }

        if (index == 2) {
            if (mode == eTexEffectFlag.eNone) {
                this.mThirdTexture = null;
            }
            if (mode == eTexEffectFlag.eTransparent) {
                this.mThirdTexture = this.mThirdTextureTemp;
                this.mThirdTextureBlend = 1.0;
            }
            if (mode == eTexEffectFlag.eOverride) {
                this.mThirdTexture = this.mThirdTextureTemp;
                this.mThirdTextureBlend = 0.0;
            }
            if (mode == eTexEffectFlag.eBlend) {
                this.mThirdTexture = this.mThirdTextureTemp;
                this.mThirdTextureBlend = this.mThirdTextureBlendTemp;
            }
        }
    }

    // index: 0 not used
    //        1, 2: the effect textures
    // parm: a float array of 5 elements:
    //       0,1: u and v positions of tex in UV space
    //       2,3: w and h of tex in UV space
    //       4: rotation of tex in radian
    setTexAtSize(index, parm) {
        if (index == 1) {
            this.mSecondTexturePlacement = parm;
        }
        if (index == 2) {
            this.mThirdTexturePlacement = parm;
        }
    }

    // index: 0 not used
    //        1, 2: the effect textures
    // f: blendWeight
    setBlendFactor(index, f) {
        if (index == 1) {
            this.mSecondTextureBlend = f;
            this.mSecondTextureBlendTemp = f;
        }
        if (index == 2) {
            this.mThirdTextureBlend = f;
            this.mThirdTextureBlendTemp = f;
        }
    }

    draw(camera) {
        let en = false;  // for second texture;
        // activate the texture
        texture.activate(this.mTexture, glSys.get().TEXTURE0);
        if (this.mSecondTexture != null) {
            this.mShader.setWeight2(this.mSecondTextureBlend);
            texture.activate(this.mSecondTexture, glSys.get().TEXTURE1);
            this.mShader.placeAtWithSize(this.mSecondTexturePlacement, 
                this.getXform().getWidth()/this.getXform().getHeight());
            en = true;
            
        }       
        this.mShader.enableSecondTexture(en);

        let en2 = false;  // for third texture;
        // activate the texture
        if (this.mThirdTexture != null) {
            this.mShader.setWeight3(this.mThirdTextureBlend);
            texture.activate(this.mThirdTexture, glSys.get().TEXTURE2);
            this.mShader.placeAtWithSize2(this.mThirdTexturePlacement, 
                this.getXform().getWidth()/this.getXform().getHeight());
            en2 = true;
        }       
        this.mShader.enableThirdTexture(en2);

        super.draw(camera);
    }

    getTexture() { return this.mTexture; }
    setTexture(newTexture) {
        this.mTexture = newTexture;
    }
}

export {eTexEffectFlag}
export default MultiTextureRenderable;
"use strict";  // Operate in Strict mode such that variables must be declared before used!

import engine from "../engine/index.js";

let kX = 0;  // index into the mTexParm
let kY = 1;  // index into the mTexParm
let kW = 2;  // index into the mTexParm
let kH = 3;  // index into the mTexParm
let kT = 4;  // index into the mTexParm

class MultiTextureTest {
    constructor(atx, aty, w, h, mainTex, tex1 = null, tex2 = null) {
        this.kDelta = 0.005;
        this.mRenderComponent = new engine.MultiTextureRenderable(mainTex, tex1, tex2);
        this.mRenderComponent.getXform().setPosition(atx, aty);
        this.mRenderComponent.getXform().setSize(w, h);

        this.mTexParm = [
            [atx, aty, w,   h,   0], // index 0 is (atx, aty) and wxh of the TextureRenderable
            [0.3, 0.3, 0.4, 0.4, 0], // index 1 of the texture effect
            [0.7, 0.7, 0.4, 0.4, 0], // index 2 of the texture effect
        ];

        this.mBlendFactor = [0, 0.4, 0.6];  // blend factors for 1 and 2 (0 is not used)
        this.mMode = ["None", "Transparent", "Blend"];

        this.mRenderComponent.setTexAtSize(1, this.mTexParm[1]);
        this.mRenderComponent.setTexEffectMode(1, engine.eTexEffectFlag.eBlend);
        this.mRenderComponent.setBlendFactor(1, this.mBlendFactor[1]);

        this.mRenderComponent.setTexAtSize(2, this.mTexParm[2]);
        this.mRenderComponent.setTexEffectMode(2, engine.eTexEffectFlag.eBlend);
        this.mRenderComponent.setBlendFactor(2, this.mBlendFactor[2]);

        // default to setting the renderable
        this.mIndex = 0;
        this.outputBlendStatus = 0;
    }

    output() {
        if (this.mMode[this.mIndex] != "Blend") {
            return "Index=" + this.mIndex + " P(" 
            + this.mTexParm[this.mIndex][kX].toPrecision(2).toString() + "," 
            + this.mTexParm[this.mIndex][kY].toPrecision(2).toString() + ") WxH(" 
            + this.mTexParm[this.mIndex][kW].toPrecision(2).toString() + "," 
            + this.mTexParm[this.mIndex][kH].toPrecision(2).toString() + ") R=" 
            + this.mTexParm[this.mIndex][kT].toPrecision(2).toString() + " Mode:" 
            + this.mMode[this.mIndex];
        }

        if (this.mMode[this.mIndex] == "Blend") {
            return "Index=" + this.mIndex + " P(" 
            + this.mTexParm[this.mIndex][kX].toPrecision(2).toString() + "," 
            + this.mTexParm[this.mIndex][kY].toPrecision(2).toString() + ") WxH(" 
            + this.mTexParm[this.mIndex][kW].toPrecision(2).toString() + "," 
            + this.mTexParm[this.mIndex][kH].toPrecision(2).toString() + ") R=" 
            + this.mTexParm[this.mIndex][kT].toPrecision(2).toString() + " Mode:" 
            + this.mMode[this.mIndex] + " " + "Factor: "
            + this.mBlendFactor[this.mIndex].toPrecision(2);
        }
    }

    update() {
        let once = false;
        if (engine.input.isKeyPressed(engine.input.keys.Up)) {
            if (engine.input.isKeyPressed(engine.input.keys.Shift)) {
                this.mTexParm[this.mIndex][kH] += this.kDelta;  // changing height
        }
            else this.mTexParm[this.mIndex][kY] += this.kDelta;           // changing y position
            once = true;
        }
        if (engine.input.isKeyPressed(engine.input.keys.Down)) {
            if (engine.input.isKeyPressed(engine.input.keys.Shift))
            this.mTexParm[this.mIndex][kH] -= this.kDelta;  // changing height
            else this.mTexParm[this.mIndex][kY] -= this.kDelta;           // changing y position
            once = true;
        }
        if (engine.input.isKeyPressed(engine.input.keys.Right)) {
            if (engine.input.isKeyPressed(engine.input.keys.Shift))
                this.mTexParm[this.mIndex][kW] += this.kDelta;
            else if (engine.input.isKeyPressed(engine.input.keys.Ctrl))
                this.mTexParm[this.mIndex][kT] -= this.kDelta;
            else this.mTexParm[this.mIndex][kX] += this.kDelta;
            once = true;
        }
        if (engine.input.isKeyPressed(engine.input.keys.Left)) {
            if (engine.input.isKeyPressed(engine.input.keys.Shift))
                this.mTexParm[this.mIndex][kW] -= this.kDelta;
            else if (engine.input.isKeyPressed(engine.input.keys.Ctrl))
                this.mTexParm[this.mIndex][kT] += this.kDelta;
            else this.mTexParm[this.mIndex][kX] -= this.kDelta;
            once = true;
        }
        if (once) {
            if (this.mIndex != 0) 
                this.mRenderComponent.setTexAtSize(this.mIndex, this.mTexParm[this.mIndex]);
            else {
                this.mRenderComponent.getXform().setPosition(this.mTexParm[0][kX], this.mTexParm[0][kY]);
                this.mRenderComponent.getXform().setSize(this.mTexParm[0][kW], this.mTexParm[0][kH]);
                this.mRenderComponent.getXform().setRotationInRad(this.mTexParm[0][kT]);
            }
        }

        
        if (engine.input.isKeyClicked(engine.input.keys.Three)) {
            this.mRenderComponent.setTexEffectMode(this.mIndex, engine.eTexEffectFlag.eNone);
            this.mMode[this.mIndex] = "None";
        }
        if (engine.input.isKeyClicked(engine.input.keys.Four)) {
            this.mRenderComponent.setTexEffectMode(this.mIndex, engine.eTexEffectFlag.eTransparent);
            this.mMode[this.mIndex] = "Transparent";
        }
        if (engine.input.isKeyClicked(engine.input.keys.Five)) {
            this.mRenderComponent.setTexEffectMode(this.mIndex, engine.eTexEffectFlag.eOverride);
            this.mMode[this.mIndex] = "Override";
        }
        if (engine.input.isKeyClicked(engine.input.keys.Six)) {
            this.mRenderComponent.setTexEffectMode(this.mIndex, engine.eTexEffectFlag.eBlend);
            this.mMode[this.mIndex] = "Blend";
        }
        
        once = false;
        if (engine.input.isKeyPressed(engine.input.keys.N) && this.mMode[this.mIndex] == "Blend") {
            if (this.mBlendFactor[this.mIndex] > 0.0) {
                this.mBlendFactor[this.mIndex] -= this.kDelta;
            }
            if (this.mBlendFactor[this.mIndex] <= 0.0) {
                this.mBlendFactor[this.mIndex] = 0.0;
            }
            once = true;
        }
        if (engine.input.isKeyPressed(engine.input.keys.M) && this.mMode[this.mIndex] == "Blend") {
            if (this.mBlendFactor[this.mIndex] < 1.0) {
                this.mBlendFactor[this.mIndex] += this.kDelta;
            }
            once = true;
        }
        if (once && (this.mIndex != 0))
            this.mRenderComponent.setBlendFactor(this.mIndex, this.mBlendFactor[this.mIndex]);
    
        if (engine.input.isKeyClicked(engine.input.keys.Zero))
            this.mIndex = 0;
        if (engine.input.isKeyClicked(engine.input.keys.One)) 
            this.mIndex = 1;
        if (engine.input.isKeyClicked(engine.input.keys.Two))
            this.mIndex = 2;

        // print out status with blend settings
        if (this.mMode[this.mIndex] == "Blend") {
            return "Index=" + this.mIndex + " P(" 
            + this.mTexParm[this.mIndex][kX].toPrecision(2).toString() + "," 
            + this.mTexParm[this.mIndex][kY].toPrecision(2).toString() + ") WxH(" 
            + this.mTexParm[this.mIndex][kW].toPrecision(2).toString() + "," 
            + this.mTexParm[this.mIndex][kH].toPrecision(2).toString() + ") R=" 
            + this.mTexParm[this.mIndex][kT].toPrecision(2).toString() + " Mode:" 
            + this.mMode[this.mIndex] + " " + "Factor: "
            + this.mBlendFactor[this.mIndex].toPrecision(2);
        }

        // print out status without blend settings
        else {
            return "Index=" + this.mIndex + " P(" 
            + this.mTexParm[this.mIndex][kX].toPrecision(2).toString() + "," 
            + this.mTexParm[this.mIndex][kY].toPrecision(2).toString() + ") WxH(" 
            + this.mTexParm[this.mIndex][kW].toPrecision(2).toString() + "," 
            + this.mTexParm[this.mIndex][kH].toPrecision(2).toString() + ") R=" 
            + this.mTexParm[this.mIndex][kT].toPrecision(2).toString() + " Mode:" 
            + this.mMode[this.mIndex];
        }
    }
    
    draw(aCamera) {
        this.mRenderComponent.draw(aCamera);
    }
}

export default MultiTextureTest;
/*
 * File: texture_shader.js
 *
 * wrapps over GLSL texture shader, supporting the working with the entire file texture
 * 
 */
"use strict";

import * as glSys from "../core/gl.js";
import * as vertexBuffer from "../core/vertex_buffer.js";
import  SimpleShader from "./simple_shader.js";

class MultiTextureShader extends SimpleShader {
    constructor(vertexShaderPath, fragmentShaderPath) {
        // Call super class constructor
        super(vertexShaderPath, fragmentShaderPath);  // call SimpleShader constructor

        this.mTexMat = mat3.create();

        // reference to aTextureCoordinate within the shader
        this.mTextureCoordinateRef = null;

        this.mHasSecondTexture = false;

        this.mHasThirdTexture = false;

        this.mWeight2 = null;
        this.mWeight3 = null;

        // get the reference of aTextureCoordinate within the shader
        let gl = glSys.get();
        this.mSamplerRef =  gl.getUniformLocation(this.mCompiledShader, "uSampler");
        this.mTextureCoordinateRef = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate");

        // supporting second set
        this.mTextureCoordinateRef2 = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate2");
        this.mOtherTextureRef = gl.getUniformLocation(this.mCompiledShader, "uOtherTexture");
        this.mHasSecondTextureRef = gl.getUniformLocation(this.mCompiledShader, "uHasSecondTexture");

        // supporting second set
        this.mTextureCoordinateRef3 = gl.getAttribLocation(this.mCompiledShader, "aTextureCoordinate3");
        this.mNextTextureRef = gl.getUniformLocation(this.mCompiledShader, "uNextTexture");
        this.mHasThirdTextureRef = gl.getUniformLocation(this.mCompiledShader, "uHasThirdTexture");

        this.mWeightRef2 = gl.getUniformLocation(this.mCompiledShader, "rWeight2");
        this.mWeightRef3 = gl.getUniformLocation(this.mCompiledShader, "rWeight3");

        // second set of tex coordinate
        let initTexCoord = [
            1.0, 1.0,       // right, top
            0.0, 1.0,       // left, top
            1.0, 0.0,       // right, bottom, 
            0.0, 0.0        // left, bottom
        ];

        this.mSecondTextureCoord = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mSecondTextureCoord);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initTexCoord), gl.DYNAMIC_DRAW);

        this.mThirdTextureCoord = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mThirdTextureCoord);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(initTexCoord), gl.DYNAMIC_DRAW);
    }

    // Overriding the activation of the shader for rendering
    activate(pixelColor, trsMatrix, cameraMatrix) {
        // first call the super class' activate
        super.activate(pixelColor, trsMatrix, cameraMatrix);

        // now our own functionality: enable texture coordinate array
        let gl = glSys.get();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._getTexCoordBuffer());
        gl.vertexAttribPointer(this.mTextureCoordinateRef, 2, gl.FLOAT, false, 0, 0);        
        gl.enableVertexAttribArray(this.mTextureCoordinateRef);        
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mSecondTextureCoord);
        gl.vertexAttribPointer(this.mTextureCoordinateRef2, 2, gl.FLOAT, false, 0, 0);        
        gl.enableVertexAttribArray(this.mTextureCoordinateRef2);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.mThirdTextureCoord);
        gl.vertexAttribPointer(this.mTextureCoordinateRef3, 2, gl.FLOAT, false, 0, 0);        
        gl.enableVertexAttribArray(this.mTextureCoordinateRef3);
        
        // bind uSampler to texture 0
        gl.uniform1i(this.mSamplerRef, 0);  // texture.activateTexture() binds to Texture0
        gl.uniform1i(this.mOtherTextureRef, 1);
        gl.uniform1i(this.mNextTextureRef, 2);
        gl.uniform1i(this.mHasSecondTextureRef, this.mHasSecondTexture);
        gl.uniform1i(this.mHasThirdTextureRef, this.mHasThirdTexture);

        gl.uniform1f(this.mWeightRef2, this.mWeight2);
        gl.uniform1f(this.mWeightRef3, this.mWeight3);
    }

    setWeight2(w) {
        this.mWeight2 = w;
    }
    setWeight3(w) {
        this.mWeight3 = w;
    }

    enableSecondTexture(en) {
        this.mHasSecondTexture = en;
    }

    enableThirdTexture(en) {
        this.mHasThirdTexture = en;
    }

    placeAtWithSize(placement, aspectRatio) {
        // How to use aspectRatio?
        let u = placement[0];
        let v = placement[1];
        let w = placement[2];
        let h = placement[3];

        let w2 = w * 0.5;
        let h2 = h * 0.5;
        let left = u - w2;
        let bottom = v - h2;

        let useW = 1.0 / w;
        let useH = 1.0 / h;
        let useLeft = -left * useW;
        let useBot = -bottom * useH;

        let useRight = useLeft + useW;
        let useTop = useBot + useH;

        let gl = glSys.get();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mSecondTextureCoord);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array([
            useRight, useTop,
            useLeft,  useTop,
            useRight, useBot,
            useLeft,  useBot]));
    }

    placeAtWithSize2(placement, aspectRatio) {
        // How to use aspectRatio?
        let u = placement[0];
        let v = placement[1];
        let w = placement[2];
        let h = placement[3];

        let w2 = w * 0.5;
        let h2 = h * 0.5;
        let left = u - w2;
        let bottom = v - h2;

        let useW = 1.0 / w;
        let useH = 1.0 / h;
        let useLeft = -left * useW;
        let useBot = -bottom * useH;

        let useRight = useLeft + useW;
        let useTop = useBot + useH;

        let gl = glSys.get();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.mThirdTextureCoord);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array([
            useRight, useTop,
            useLeft,  useTop,
            useRight, useBot,
            useLeft,  useBot]));
    }

    _getTexCoordBuffer() {
        return vertexBuffer.getTexCoord();
    }
}

export default MultiTextureShader;
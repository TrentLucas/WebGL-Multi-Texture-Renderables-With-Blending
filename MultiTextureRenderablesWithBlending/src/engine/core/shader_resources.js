/*
 * File: shader_resources.js
 *  
 * defines drawing system shaders
 * 
 */
"use strict";

import SimpleShader from "../shaders/simple_shader.js";
import TextureShader from "../shaders/texture_shader.js";
import SpriteShader from "../shaders/sprite_shader.js";
import MultiTextureShader from "../shaders/multi_texture_shader.js";
import * as text from "../resources/text.js";
import * as map from "./resource_map.js";
 
// Simple Shader
let kSimpleVS = "src/glsl_shaders/simple_vs.glsl";  // Path to the VertexShader 
let kSimpleFS = "src/glsl_shaders/simple_fs.glsl";  // Path to the simple FragmentShader
let mConstColorShader = null;

// Texture Shader
let kTextureVS = "src/glsl_shaders/texture_vs.glsl";  // Path to the VertexShader 
let kTextureFS = "src/glsl_shaders/texture_fs.glsl";  // Path to the texture FragmentShader
let mTextureShader = null;
let mMTextureShader = null;
let mSpriteShader = null;

// Texture Shader
let kMTextureVS = "src/glsl_shaders/multi_texture_vs.glsl";  // Path to the VertexShader 
let kMTextureFS = "src/glsl_shaders/multi_texture_fs.glsl";  // Path to the texture FragmentShader

function createShaders() {
    mConstColorShader = new SimpleShader(kSimpleVS, kSimpleFS);
    mTextureShader = new TextureShader(kTextureVS, kTextureFS);
    mSpriteShader = new SpriteShader(kTextureVS, kTextureFS);
    mMTextureShader = new MultiTextureShader(kMTextureVS, kMTextureFS);
}

function cleanUp() {
    mConstColorShader.cleanUp();
    mTextureShader.cleanUp();
    mSpriteShader.cleanUp();
    mMTextureShader.cleanUp();
    mMSpriteShader.cleanUp();

    text.unload(kSimpleVS);
    text.unload(kSimpleFS);
    text.unload(kTextureVS);
    text.unload(kTextureFS);
    text.unload(kMTextureVS);
    text.unload(kMTextureFS);
}

function init() {
    let loadPromise = new Promise(
        async function(resolve) {
            await Promise.all([
                text.load(kSimpleFS),
                text.load(kSimpleVS),
                text.load(kTextureFS),
                text.load(kTextureVS),
                text.load(kMTextureFS),
                text.load(kMTextureVS)
            ]);
            resolve();
        }).then(
            function resolve() { createShaders(); }
        );
    map.pushPromise(loadPromise);
}

function getConstColorShader() { return mConstColorShader; }
function getTextureShader() { return mTextureShader; }
function getSpriteShader() { return mSpriteShader; }
function getMTextureShader() { return mMTextureShader; }

export {init, cleanUp, 
        getConstColorShader, getTextureShader, getSpriteShader, getMTextureShader}
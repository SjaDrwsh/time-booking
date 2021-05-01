'use strict';

// Autmatically imports neccessary core-js polyfills after analyzing the bundle.
// This expands to multiple imports.
require('core-js/stable');
require('regenerator-runtime/runtime');

// Required for the class-transformer package.
// See https://github.com/typestack/class-transformer#browser
require('reflect-metadata');

// Pointer events polyfill. Can be removed as soon as Apple has shipped support for Safari
// (https://webkit.org/status/#?search=pointer%20events)
require('pepjs');

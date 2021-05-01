/** Create a dedicated module that will be used for setting up the jsdom test environment. */
const JSDOMEnvironment = require('jest-environment-jsdom-sixteen');

/**
 *  The module must export a class with setup, teardown and runScript methods.
 *  See more documentation here: https://jestjs.io/docs/en/configuration.html#testenvironment-string
 **/
module.exports = class JSDOMEnvironmentGlobal extends JSDOMEnvironment {
  constructor(config, context) {
    super(config, context);
  }

  async setup() {
    await super.setup();
    this.global.jsdom = this.dom;
  }

  async teardown() {
    this.global.jsdom = null;
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
};

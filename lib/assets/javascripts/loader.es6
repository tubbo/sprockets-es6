/**
 * A simple module loader class that contains all ES6 modules compiled
 * into JavaScript. With the ES6 module loader syntax, Babel expects an
 * object called `module` to exist in the global namespace, and that
 * object is where all of the `export default function` code is housed
 * until it's called upon using `module.load()` in your runtime
 * code, for example the DOM ready event.
 *
 * @name Loader
 * @author Tom Scott
 */
class Loader {
  /**
   * Instantiate the module loader with an empty collection of modules.
   *
   * @constructor
   * @return Loader
   */
  constructor() {
    this.modules = [];
  }

  /**
   * Return all modules that have been exported.
   *
   * @return Array
   */
  get exports() {
    return this.modules;
  }

  /**
   * Export a new module to the loader.
   *
   * @param Function module
   */
  set exports(module) {
    this.modules.push(module);
  }

  /**
   * Execute all modules within the context of a passed-in DOM event.
   *
   * @param Event event
   */
  load(event) {
    this.modules.forEach((module) => module(event));
  }
}

/**
 * An instance of the Loader class that is used in runtime to house
 * JavaScript modules.
 *
 * @return Loader
 */
window.module = new Loader();

/**
 * Shortcut to the `exports` attribute of Loader, which will return all
 * of the modules that have been exported into the loader.
 *
 * @return Array of Functions.
 */
window.exports = module.exports;

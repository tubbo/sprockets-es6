/**
 * A simple module loader class that contains all ES6 modules compiled
 * into JavaScript. With the ES6 module loader syntax, Babel expects an
 * object called `module` to exist in the global namespace, and that
 * object is where all of the `export default function` code is housed
 * until it's called upon using `module.load()` in your runtime
 * code, for example the DOM ready event.
 *
 * The loader also responds to events for 'load' and 'init', which you
 * can override functionality for in your own JS code.
 *
 * @name Loader
 * @author Tom Scott
 */
class Loader {
  /**
   * Instantiate the module loader with an empty collection of modules
   * and the default event bindings.
   *
   * @constructor
   * @return Loader
   */
  constructor() {
    this.modules = [];
    this.events = {
      init: this._init,
      load: this._load
    };
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
   * Loads a single module with the given name.
   *
   * @param string name
   * @return function the module requested or +null+ if none found.
   */
  load(name) {
    return this.fire('load', name);
  }

  /**
   * Load all modules and pass in the arguments given to this function.
   *
   * @param arguments any arguments that the modules should take in
   */
  init() {
    return this.fire('init', arguments);
  }

  /**
   * Fire a loader event, used by the `init()` and `load()` methods to
   * override functionality.
   *
   * @param string event - name of the event
   * @param array args - arguments given to the event
   */
  fire(event, args) {
    return this.events[event](args);
  }

  /**
   * Default event binding for the init() event. Loads all modules with
   * the given arguments by firing the 'load' event on all modules and
   * passing in the arguments.
   *
   * @private
   * @return function an executable function that arguments to the event
   * can be passed into.
   */
  _init() {
    return function() {
      this.modules.forEach((module) => this.load(module)(arguments));
    };
  }

  /**
   * Default event binding for the load() event. Pulls a single module
   * out of the collection by name and returns it.
   *
   * @private
   * @param string name - path name of the requested module
   * @return function the module requested or `undefined` if it can't be
   * found.
   */
  _load(name) {
    return this.modules[name];
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

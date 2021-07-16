/*!
 * @prestashopcorp/segment-vue v2.1.6
 * (c) 2021 undefined
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('load-script'), require('vue-demi')) :
  typeof define === 'function' && define.amd ? define(['exports', 'load-script', 'vue-demi'], factory) :
  (global = global || self, factory(global['@prestashopcorpSegmentVue'] = {}, global.loadScript, global.vueDemi));
}(this, (function (exports, loadScript, vueDemi) { 'use strict';

  loadScript = loadScript && loadScript.hasOwnProperty('default') ? loadScript['default'] : loadScript;

  function init(config, callback) {
    if (!config.id || !config.id.length) {
      console.warn("Please enter a Segment.io tracking ID");
      return;
    }

    // Create a queue, but don't obliterate an existing one!
    window.analytics = window.analytics || [];
    var analytics = window.analytics[config.instanceName] = window.analytics[config.instanceName] || [];

    // If the real analytics.js is already on the page return.
    if (analytics.initialize) return;

    // If the snippet was invoked already show an error.
    // if (analytics.invoked) {
    //   if (window.console && console.error) {
    //     console.error('Segment snippet included twice.')
    //   }
    //   return
    // }

    // Invoked flag, to make sure the snippet
    // is never invoked twice.
    analytics.invoked = true;

    // A list of the methods in Analytics.js to stub.
    analytics.methods = ["trackSubmit", "trackClick", "trackLink", "trackForm", "pageview", "identify", "reset", "group", "track", "ready", "alias", "debug", "page", "once", "off", "on"];

    // Define a factory to create stubs. These are placeholders
    // for methods in Analytics.js so that you never have to wait
    // for it to load to actually record data. The `method` is
    // stored as the first argument, so we can replay the data.
    analytics.factory = function (method) {
      return function () {
        var args = Array.prototype.slice.call(arguments);
        if (config.debug === true) {
          if (window.console && console.log) {
            console.log("[Segment Analytics Debug]: " + method + " method called with " + args.length + " args");
          }
        } else {
          args.unshift(method);
          analytics.push(args);
          return analytics;
        }
      };
    };

    // Add a version to keep track of what's in the wild.
    analytics.SNIPPET_VERSION = "4.13.1";

    // For each of our methods, generate a queueing stub.
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = analytics.methods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var key = _step.value;

        analytics[key] = analytics.factory(key);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (config.debug === false) {
      var source = "https://cdn.segment.com/analytics.js/v1/" + config.id + "/analytics.min.js";
      loadScript(source, function (error, script) {
        if (error) {
          console.warn("Ops! Is not possible to load Segment Analytics script");
          return;
        }

        var poll = setInterval(function () {
          if (!window.analytics) {
            return;
          }

          clearInterval(poll);

          // the callback is fired when window.analytics is available and before any other hit is sent
          if (callback && typeof callback === "function") {
            callback();
          }
        }, 10);
      });
    } else {
      // Still run the callback in debug mode.
      if (callback && typeof callback === "function") {
        callback();
      }
    }

    return window.analytics;
  }

  var useSegment = function useSegment() {
    var _getCurrentInstance = vueDemi.getCurrentInstance(),
        $segment = _getCurrentInstance.appContext.config.globalProperties[config.instanceName];

    if (!$segment) {
      throw new Error("Segment not provided");
    }
    return $segment();
  };

  /**
   * Vue installer
   * @param  {Vue instance} Vue
   * @param  {Object} [options={}]
   */
  var install = function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var config = Object.assign({
      debug: false,
      pageCategory: "",
      instanceName: "$segment"
    }, options);

    var analytics = init(config, function () {});

    // Page tracking
    if (config.router !== undefined) {
      config.router.afterEach(function (to, from) {
        if (!to.meta.exclude) {
          // Make a page call for each navigation event
          window.analytics[config.instanceName].page(config.pageCategory, to.name || "", {
            path: to.fullPath,
            referrer: from.fullPath
          });
        }
      });
    }

    if (vueDemi.isVue2) {
      if (!Vue.hasOwnProperty(config.instanceName) && !Vue.prototype.hasOwnProperty(config.instanceName)) {
        Object.defineProperty(Vue, config.instanceName, {
          get: function get() {
            return window.analytics[config.instanceName];
          }
        });
        Object.defineProperty(Vue.prototype, config.instanceName, {
          get: function get() {
            return window.analytics[config.instanceName];
          }
        });
      }
    } else {
      vueDemi.provide(config.instanceName, window.analytics);
      Vue.config.globalProperties[config.instanceName] = function () {
        return window.analytics;
      };
    }
    // Setup instance access
    // if (window.analytics && !Vue.hasOwnProperty("$segment") && !Vue.prototype.hasOwnProperty("$segment")) {
    //   Object.defineProperty(Vue, "$segment", {
    //     get() {
    //       return window.analytics;
    //     },
    //   });
    //   Object.defineProperty(Vue.prototype, "$segment", {
    //     get() {
    //       return window.analytics;
    //     },
    //   });
    // }
  };

  var index = { install: install };

  exports.default = index;
  exports.useSegment = useSegment;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

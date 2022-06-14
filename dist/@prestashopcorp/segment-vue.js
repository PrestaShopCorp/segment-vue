/*!
 * @prestashopcorp/segment-vue v3.0.0
 * (c) 2022 undefined
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('vue-demi'), require('isomorphic-fetch'), require('lodash/flatten'), require('lodash/sortedUniqBy'), require('lodash/sortBy')) :
  typeof define === 'function' && define.amd ? define(['exports', 'vue-demi', 'isomorphic-fetch', 'lodash/flatten', 'lodash/sortedUniqBy', 'lodash/sortBy'], factory) :
  (global = global || self, factory(global['@prestashopcorpSegmentVue'] = {}, global.vueDemi, global.fetch, global.flatten, global.sortedUniqBy, global.sortBy));
}(this, (function (exports, vueDemi, fetch, flatten, sortedUniqBy, sortBy) { 'use strict';

  fetch = fetch && fetch.hasOwnProperty('default') ? fetch['default'] : fetch;
  flatten = flatten && flatten.hasOwnProperty('default') ? flatten['default'] : flatten;
  sortedUniqBy = sortedUniqBy && sortedUniqBy.hasOwnProperty('default') ? sortedUniqBy['default'] : sortedUniqBy;
  sortBy = sortBy && sortBy.hasOwnProperty('default') ? sortBy['default'] : sortBy;

  var _this = undefined;

  function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

  var useSegment = function useSegment() {
    var _getCurrentInstance = vueDemi.getCurrentInstance(),
        $segment = _getCurrentInstance.appContext.config.globalProperties.$segment;

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
      settings: {},
      disabled: false
    }, options);

    if (!config.disabled && (!config.id || config.id.length === 0)) {
      console.warn('Please enter a Segment Write Key');
      return;
    }

    var analytics = window.analytics = window.analytics || [];

    if (analytics.initialize) {
      return;
    }

    if (analytics.invoked) {
      if (window.console && console.error) {
        console.error('Segment snippet included twice.');
      }
      return;
    }

    analytics.invoked = true;

    analytics.methods = ["trackSubmit", "trackClick", "trackLink", "trackForm", "pageview", "identify", "reset", "group", "track", "ready", "alias", "debug", "page", "once", "off", "on", "addSourceMiddleware", "addIntegrationMiddleware", "setAnonymousId", "addDestinationMiddleware"];

    analytics.factory = function (method) {
      return function () {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(method);
        analytics.push(args);
        return analytics;
      };
    };

    for (var i = 0; i < analytics.methods.length; i++) {
      var key = analytics.methods[i];
      analytics[key] = analytics.factory(key);
    }

    analytics.SNIPPET_VERSION = '4.1.0';

    analytics.load = function (key, options) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://cdn.segment.com/analytics.js/v1/' + key + '/analytics.min.js';

      var first = document.getElementsByTagName('script')[0];
      first.parentNode.insertBefore(script, first);
      analytics._loadOptions = options;
    };

    if (!options.debug) ;
    // analytics.load(config.id, config.settings)


    // Page tracking
    if (config.router !== undefined) {
      config.router.afterEach(function (to, from) {
        if (!to.meta.exclude) {
          // Make a page call for each navigation event
          window.analytics.page(config.pageCategory, to.name || "", {
            path: to.fullPath,
            referrer: from.fullPath
          });
        }
      });
    }

    if (vueDemi.isVue2) {
      if (!Vue.hasOwnProperty("$segment") && !Vue.prototype.hasOwnProperty("$segment")) {
        Object.defineProperty(Vue, "$segment", {
          get: function get() {
            return window.analytics;
          }
        });
        Object.defineProperty(Vue.prototype, "$segment", {
          get: function get() {
            return window.analytics;
          }
        });
      }
    } else {
      vueDemi.provide("$segment", window.analytics);
      Vue.config.globalProperties.$segment = function () {
        return window.analytics;
      };
    }
  };

  var fetchDestinationsForWriteKey = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(cdnHost, writeKey) {
      var res, destinations, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, destination;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return fetch('https://' + cdnHost + '/v1/projects/' + writeKey + '/integrations');

            case 2:
              res = _context.sent;

              if (res.ok) {
                _context.next = 5;
                break;
              }

              throw new Error('Failed to fetch integrations for write key ' + writeKey + ': HTTP ' + res.status + ' ' + res.statusText);

            case 5:
              _context.next = 7;
              return res.json();

            case 7:
              destinations = _context.sent;


              // Rename creationName to id to abstract the weird data model
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 11;
              for (_iterator = destinations[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                destination = _step.value;

                destination.id = destination.creationName;
                delete destination.creationName;
              }

              _context.next = 19;
              break;

            case 15:
              _context.prev = 15;
              _context.t0 = _context['catch'](11);
              _didIteratorError = true;
              _iteratorError = _context.t0;

            case 19:
              _context.prev = 19;
              _context.prev = 20;

              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }

            case 22:
              _context.prev = 22;

              if (!_didIteratorError) {
                _context.next = 25;
                break;
              }

              throw _iteratorError;

            case 25:
              return _context.finish(22);

            case 26:
              return _context.finish(19);

            case 27:
              return _context.abrupt('return', destinations);

            case 28:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this, [[11, 15, 19, 27], [20,, 22, 26]]);
    }));

    return function fetchDestinationsForWriteKey(_x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();

  var fetchDestinations = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(cdnHost, writeKeys) {
      var destinationsRequests, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, writeKey, destinations;

      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              destinationsRequests = [];
              _iteratorNormalCompletion2 = true;
              _didIteratorError2 = false;
              _iteratorError2 = undefined;
              _context2.prev = 4;

              for (_iterator2 = writeKeys[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                writeKey = _step2.value;

                destinationsRequests.push(fetchDestinationsForWriteKey(cdnHost, writeKey));
              }

              _context2.next = 12;
              break;

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2['catch'](4);
              _didIteratorError2 = true;
              _iteratorError2 = _context2.t0;

            case 12:
              _context2.prev = 12;
              _context2.prev = 13;

              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }

            case 15:
              _context2.prev = 15;

              if (!_didIteratorError2) {
                _context2.next = 18;
                break;
              }

              throw _iteratorError2;

            case 18:
              return _context2.finish(15);

            case 19:
              return _context2.finish(12);

            case 20:
              _context2.t1 = flatten;
              _context2.next = 23;
              return Promise.all(destinationsRequests);

            case 23:
              _context2.t2 = _context2.sent;
              destinations = (0, _context2.t1)(_context2.t2);


              destinations = destinations.filter(function (d) {
                return d.id !== 'Repeater';
              });
              destinations = sortBy(destinations, ['id']);
              destinations = sortedUniqBy(destinations, 'id');

            case 28:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this, [[4, 8, 12, 20], [13,, 15, 19]]);
    }));

    return function fetchDestinations(_x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  }();

  var conditionallyLoadAnalytics = function conditionallyLoadAnalytics(writeKey, destinations, isConsentRequired) {
    var shouldReload = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

    var wd = window;
    var integrations = { All: false, 'Segment.io': true };

    if (!isConsentRequired) {
      if (!wd.analytics.initialized) {
        wd.analytics.load(writeKey);
      }
      return;
    }

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = destinations[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var destination = _step3.value;

        integrations[destination.id] = true;
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3.return) {
          _iterator3.return();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    if (wd.analytics && wd.analytics.initialized) {
      if (shouldReload) {
        window.location.reload();
      }
      return;
    }
  };
  var index = { install: install };

  exports.conditionallyLoadAnalytics = conditionallyLoadAnalytics;
  exports.default = index;
  exports.fetchDestinations = fetchDestinations;
  exports.useSegment = useSegment;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

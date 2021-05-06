import init from "./init";
import { isVue2 } from 'vue-demi';
/**
 * Vue installer
 * @param  {Vue instance} Vue
 * @param  {Object} [options={}]
 */
function install(Vue, options = {}) {
  const config = Object.assign(
    {
      debug: false,
      pageCategory: "",
    },
    options
  );

  let analytics = init(config, () => {});

  // Page tracking
  if (config.router !== undefined) {
    config.router.afterEach((to, from) => {
      if (!to.meta.exclude) {
        // Make a page call for each navigation event
        window.analytics.page(config.pageCategory, to.name || "", {
          path: to.fullPath,
          referrer: from.fullPath,
        });
      }
    });
  }

  if(isVue2 && window.analytics) {
    if(!Vue.hasOwnProperty($segment) && !Vue.prototype.hasOwnProperty("$segment")) {
      Object.defineProperty(Vue, "$segment", {
        get() {
          return window.analytics;
        },
      });
      Object.defineProperty(Vue.prototype, "$segment", {
        get() {
          return window.analytics;
        },
      });
    }
  } else {
    Vue.provide('$segment', window.analytics);
    Object.defineProperties(Vue.config.globalProperties, "$segment", {
      get() {
        return window.analytics
      }
    })
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
}

export default { install };

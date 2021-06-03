import init from "./init";
import { isVue2, inject, provide, getCurrentInstance } from 'vue-demi';


export const useSegment = () => {
  const {
    appContext: {
      config: {
        globalProperties: { $segment },
      },
    },
  } = getCurrentInstance();
  if(!$segment){
    throw new Error("Segment not provided");
  }
  return $segment();
}



/**
 * Vue installer
 * @param  {Vue instance} Vue
 * @param  {Object} [options={}]
 */
const install = (Vue, options = {}) => {
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
    provide("$segment", window.analytics);
    Vue.config.globalProperties.$segment = () => window.analytics;
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

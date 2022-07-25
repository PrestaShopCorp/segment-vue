import { isVue2, provide, getCurrentInstance } from 'vue-demi';
import fetch from 'isomorphic-fetch'
import flatten from 'lodash/flatten'
import sortedUniqBy from 'lodash/sortedUniqBy'
import sortBy from 'lodash/sortBy'


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
      settings: {},
      disabled: false
    },
    options
  );

  if (!config.disabled && (!config.id || config.id.length === 0)) {
    console.warn('Please enter a Segment Write Key')
    return
  }

  const analytics = window.analytics = window.analytics || []

  if (analytics.initialize) {
    return
  }

  if (analytics.invoked) {
    if (window.console && console.error) {
      console.error('Segment snippet included twice.')
    }
    return
  }


  analytics.invoked = true;

  analytics.methods = [
    "trackSubmit",
    "trackClick",
    "trackLink",
    "trackForm",
    "pageview",
    "identify",
    "reset",
    "group",
    "track",
    "ready",
    "alias",
    "debug",
    "page",
    "once",
    "off",
    "on",
    "addSourceMiddleware",
    "addIntegrationMiddleware",
    "setAnonymousId",
    "addDestinationMiddleware",
  ];

  analytics.factory = function (method) {
    return function () {
      const args = Array.prototype.slice.call(arguments)
      args.unshift(method)
      analytics.push(args)
      return analytics
    }
  }

  for (let i = 0; i < analytics.methods.length; i++) {
    const key = analytics.methods[i];
    analytics[key] = analytics.factory(key);
  }

  analytics.SNIPPET_VERSION = '4.1.0';

  analytics.load = function (key, options) {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = 'https://cdn.segment.com/analytics.js/v1/'
      + key + '/analytics.min.js'

    const first = document.getElementsByTagName('script')[0]
    first.parentNode.insertBefore(script, first)
    analytics._loadOptions = options
  }

  if (!options.debug) {
    // analytics.load(config.id, config.settings)
  }

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

  if(isVue2) {
    if(!Vue.hasOwnProperty("$segment") && !Vue.prototype.hasOwnProperty("$segment")) {
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
}

const fetchDestinationsForWriteKey =  async (cdnHost, writeKey) => {

  const res = await fetch(`https://${cdnHost}/v1/projects/${writeKey}/integrations`)

  if (!res.ok) {
    throw new Error(
      `Failed to fetch integrations for write key ${writeKey}: HTTP ${res.status} ${res.statusText}`
    )
  }
  const destinations = await res.json()

  // Rename creationName to id to abstract the weird data model
  for (const destination of destinations) {
    destination.id = destination.creationName
    delete destination.creationName
  }

  return destinations
}

const fetchDestinations = async (
  cdnHost,
  writeKeys
) => {
  const destinationsRequests= [];
  for (const writeKey of writeKeys) {
    destinationsRequests.push(fetchDestinationsForWriteKey(cdnHost, writeKey))
  }

  let destinations = flatten(await Promise.all(destinationsRequests))

  destinations = destinations.filter( d => d.id !== 'Repeater')
  destinations = sortBy(destinations, ['id'])
  destinations = sortedUniqBy(destinations, 'id')
}

const conditionallyLoadAnalytics = (writeKey, destinations, isConsentRequired, shouldReload = true) => {
  const wd = window;
  const integrations = { All: false, 'Segment.io': true }

  if(!isConsentRequired) {
    if(!wd.analytics.initialized) {
      wd.analytics.load(writeKey)
      wd.analytics.page()
    }
    return
  }

  for (const destination of destinations) {
    integrations[destination.id] = true
  }

  if(wd.analytics && wd.analytics.initialized) {
    if(shouldReload){
      window.location.reload()
    }
    return
  }
}
export { conditionallyLoadAnalytics, fetchDestinations }
export default { install };

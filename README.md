# vue-segment

Vue plugin for Segment

> Vue.js plugin for Segment

[Segment Analytics.js Documentation](https://segment.com/docs/sources/website/analytics.js/)

## Requirements

Vue ^2.x or Vue ^3.x

```bash
npm install @prestashopcorp/segment-vue
```
### Vue 2
```js

import Vue from 'vue'
import SegmentVue from '@prestashopcorp/segment-vue'

Vue.use(SegmentVue, {
  id: 'XXXXX',
});
```

### Vue 3

```js

import { createApp } from "vue";
import SegmentVue from '@prestashopcorp/segment-vue'

const app = createApp(App)

app.use(SegmentVue, {
  id: 'XXXXX',
});
```

## Identify

add this on your layout file
```js
created(){
  this.$segment.identify({shopId}, {
    name: "FullName_account",
    email: "email_account",
    plan: "premium_account"
  })
}
```


## Track

add this on each method click
```js
handleClick(){
  this.$segment.track(NAME_YOUR_TRACK, 
  //optional properties
  { 
    name: "it's your track name",
    category: "ps_metrics",
  })
}
```

## Options 
 
### route track option

put the name attribute in each route and add your router to the vue-segment initialization

```js
export default {
  path: "dashboard",
  name: "dashboard", //Set name on each route
  component: DashboardApp,
};

Vue.use(SegmentVue, {
  id: 'XXXXX',
  router
});
```

### exclude route option

```js
export default {
  name: "activity",
  path: "activity",
  meta: {exclude: true},  // <= add this key in your route object, true to exclude, false to track
  component: () =>
    import(
      /* webpackChunkName: "dashboardActivity" */ "@/core/dashboard/pages/ActivityApp"
    ),
  redirect: "activity/revenue",
  children: [RevenueRouter, OrderRouter, ConversionRouter, VisitRouter],
};
```

### page category option

put the name attribute in each route and add your router to the vue-segment initialization

```js
Vue.use(SegmentVue, {
  id: 'XXXXX',
  router,
  pageCategory: "ps_metrics_"
});
```


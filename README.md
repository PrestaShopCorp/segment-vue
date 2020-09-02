# vue-segment

Vue plugin for Segment

> Vue.js plugin for Segment

[Segment Analytics.js Documentation](https://segment.com/docs/sources/website/analytics.js/)

## Requirements

Vue ^2.0.0

```bash
npm install @prestashopcorp/segment-vue
```

```js
import Vue from 'vue'
import VueSegment from 'vue-segment'

Vue.use(VueSegment, {
  id: 'XXXXX',
});
```

## Identify

add this on your App.vue file
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
  this.$segment.track(NAME_YOUR_TRACK)
}
```

## Options 
 
### Option Route track

put the name attribute in each route and add your router to the vue-segment initialization

```js
export default {
  path: "dashboard",
  name: "dashboard", //Set name on each route
  component: DashboardApp,
};

Vue.use(VueSegment, {
  id: 'XXXXX',
  router
})
```
### Option Page Categorie

put the name attribute in each route and add your router to the vue-segment initialization

```js
Vue.use(VueSegment, {
  id: 'XXXXX',
  router,
  pageCategory: "ps_metrics_"
})
```


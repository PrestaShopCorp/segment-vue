# vue-segment

Vue plugin for Segment

## Requirements

Vue ^2.0.0

```bash
npm install --save-dev vue-segment
```

```js
import Vue from 'vue'
import VueSegment from 'vue-segment'

Vue.use(VueSegment, {
  id: 'XXXXX',
});
```

## Option Route track

put the name attribute in each route and add your router to the vue-segment initialization

```js
export default {
  path: "dashboard",
  name: "dashboard",
  component: DashboardApp,
};

Vue.use(VueSegment, {
  id: 'XXXXX',
  router
})
```

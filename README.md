# vue-segment

Vue plugin for Segment

## Requirements

Vue ^2.0.0

```bash
npm install vue-segment
```

```js
import Vue from 'vue'
import VueSegment from 'vue-segment'

Vue.use(VueSegment, {
  id: 'XXXXX',
});
```

## Identity

add this on your App.vue file
```js
created(){
  this.$segment.identity({shopId}, {
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

var banner = require('./banner')
var rollup = require('rollup')
var babel = require('rollup-plugin-babel')
var pack = require('../package.json')


async function build (dev = false) {
  const bundle = await rollup.rollup({
    input: 'src/index.js',
    external: ['vue-demi', 'isomorphic-fetch', 'lodash/flatten', 'lodash/sortedUniqBy', 'lodash/sortBy'],
    plugins: [
      babel({
        babelrc: true
      })
    ]
  })

  await bundle.write({
    format: 'umd',
    name: classify(pack.name),
    file: `dist/${pack.name}.js`,
    banner: banner
  })
}

build()

function toUpper (_, c) {
  return c ? c.toUpperCase() : ''
}

const classifyRE = /(?:^|[-_/])(\w)/g
function classify (str) {
  return str.replace(classifyRE, toUpper)
}
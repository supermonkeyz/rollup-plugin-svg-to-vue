# Rollup Plugin Svg To Vue

A plugin roll svg files as a Vue 3 component.

## Installation

```bash
npm install --save-dev rollup-plugin-svg-to-vue
```

## Usage

config `rollup.config.js`

```js
import svgToVue from 'rollup-plugin-svg-to-vue';
import vue from 'rollup-plugin-vue';

export default {
  plugins: [svgToVue(/* options */), vue()],
};
```

## Options

```js
{
  include: 'foo/**'; // default /\.svg$/
  exclude: ['bar/**', 'foobar/**']; // default []
  svgo: {
    /* svgo options*/
  } // default {}
  sourceMap: false; // default false
}
```

const path = require('path');
const rollup = require('rollup');
import image from '@rollup/plugin-image';
import test from 'ava';
import svgToVue from '../src';

async function run(input, config, options = {}) {
  const roll = await rollup.rollup({
    input,
    plugins: [svgToVue(config), options.pluginImage && image()],
    external: ['vue'],
  });
  const code = await roll.generate({ format: 'esm' });
  return code;
}

const base = path.resolve(__dirname, './fixtures/base.js');

test('base import', async (t) => {
  const compiled = await run(base);
  t.regex(
    compiled.output[0].code,
    /import { openBlock, createBlock, createVNode } from 'vue';/
  );
});

test('exclude', async (t) => {
  const compiled = await run(
    base,
    { exclude: ['__test__/**'] },
    { pluginImage: true }
  );
  t.regex(compiled.output[0].code, /const img = "data:image\/svg\+xml/);
});

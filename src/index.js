try {
  require.resolve('@vue/compiler-sfc');
} catch (e) {
  throw new Error(`
    rollup-plugin-svg-to-vue requires @vue/compiler-sfc to be present in the dependency
    run npm i -D @vue/compiler-sfc
  `);
}

import path from 'path';
import hash from 'hash-sum';
import SVGO from 'svgo';
import { createFilter } from '@rollup/pluginutils';
import { compileTemplate } from '@vue/compiler-sfc';

async function optimizeSVG(data, path, config) {
  const svgo = new SVGO(config);
  try {
    const optimized = await svgo.optimize(data, { path });
    return new Promise((resolve) => {
      resolve(optimized);
    });
  } catch (error) {
    console.error(`svgo: ${error}`);
  }
}

function genScopeId(code, filename) {
  const sourceRoot = process.cwd();
  const shortFilePath = path
    .relative(sourceRoot, filename)
    .replace(/^(\.\.[\/\\])+/, '')
    .replace(/\\/g, '/');
  const scopeId = hash(shortFilePath + '\n' + code);
  return scopeId;
}

const defaultOptions = {
  include: /\.svg$/,
  exclude: [],
  svgo: {},
  sourceMap: false,
  target: 'browser',
};

export default function pluginSvgToVue(options = {}) {
  options = { ...defaultOptions, ...options };
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'svg-to-vue',
    async transform(source, id) {
      if (!filter(id)) return null;
      const optimizedSource = await optimizeSVG(source, id, options.svgo);
      const compiled = compileTemplate({
        source: optimizedSource.data,
        filename: id,
        id: genScopeId(optimizedSource.data, id),
        ssr: options.target === 'node',
      });
      let code = compiled.code;
      const sourceMap = compiled.map;
      if (code.includes('export function render')) {
        code = code.concat(`\n export default render`);
      }
      return {
        code,
        map: options.sourceMap ? sourceMap : null,
      };
    },
  };
}

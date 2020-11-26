import pkg from './package.json';

const config = {
  input: 'src/index.js',
  output: [
    {
      format: 'cjs',
      file: pkg.main,
      exports: 'default',
    },
    {
      format: 'esm',
      file: pkg.module,
      exports: 'default',
    },
  ],
  external: [
    'path',
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.peerDependencies),
  ],
};

export default config;

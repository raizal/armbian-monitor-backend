// Your bundler file
const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  platform: 'node',
  minify: true,
  outfile: 'built/index.js',
  plugins: [nodeExternalsPlugin({
    packagePath: [
      'node_modules/node-ssh/package.json',
      'node_modules/pouchdb/package.json'
    ]
  })],
});
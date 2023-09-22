/* eslint-disable @typescript-eslint/no-var-requires */
const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');

const nodeArgs = [];

if (process.env.DEBUG) {
  nodeArgs.push('--inspect-brk=0.0.0.0:9229');
}

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: ['webpack/hot/poll?100', options.entry],
    devtool: 'inline-source-map',
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?100'],
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new RunScriptWebpackPlugin({
        name: options.output.filename,
        nodeArgs,
      }),
    ],
  };
};

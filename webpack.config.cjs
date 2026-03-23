const path = require('path');
const fs = require('node:fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
  entry: './src/App.ts',
  module: {
    rules: [
      {
        test: /src\/.*\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/app.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'templates/default.html',
      title: 'Airplanegame',
      inject: 'body',
      scriptLoading: 'module',
      APP_VERSION: process.env.APP_VERSION,
      bodyContent: fs.readFileSync(path.resolve(__dirname, './templates/pages/game.html'), {encoding: 'utf8'}),
      minify: true,
    }),
    new HtmlWebpackPlugin({
      filename: 'error.html',
      template: 'templates/default.html',
      title: 'Airplanegame',
      inject: 'body',
      scriptLoading: 'module',
      APP_VERSION: process.env.APP_VERSION,
      bodyContent: fs.readFileSync(path.resolve(__dirname, './templates/pages/error.html'), {encoding: 'utf8'}),
      minify: true,
    })
  ]
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'eval-source-map';
  }

  if (argv.mode === 'production') {
    
  }

  return config;
};
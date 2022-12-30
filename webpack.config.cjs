const path = require('path');

var config = {
  entry: './src/App.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'app.js',
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    //config.devtool = 'eval';
  }

  if (argv.mode === 'production') {
    
  }

  return config;
};
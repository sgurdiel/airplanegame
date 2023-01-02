const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

var config = {
  entry: "./src/App.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      }
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "js/app.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "templates/index.html",
      minify: true,
      inject: "body",
      APP_RELEASE: process.env.APP_RELEASE
    })
  ]
};

module.exports = (env, argv) => {
  if (argv.mode === "development") {
    //config.devtool = "eval";
  }

  if (argv.mode === "production") {
    
  }

  return config;
};
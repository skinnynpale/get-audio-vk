const webpack = require("webpack");
const path = require("path");
const nodeExternals = require("webpack-node-externals");

const config = {
  mode: "production",
  entry: path.resolve(__dirname, "src", "index.ts"),
  target: "node",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true
          }
        }
      }
    ]
  },
  externals: nodeExternals()
};

module.exports = config;

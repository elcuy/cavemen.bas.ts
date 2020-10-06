const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

const defaultOutputPath = path.resolve(__dirname, "dist/client");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: {
    "index-js": "./client/app/Cavemen.tsx",
    "index-css": "./client/styles/index.sass"
  },
  output: {
    path: defaultOutputPath
  },
  plugins: [
    new MiniCssExtractPlugin()
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    plugins: [new TsconfigPathsPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [{ loader: "ts-loader" }]
      },
      {
        test: /\.(ttf|eot|svg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "resolve-url-loader", "sass-loader"]
      }
    ]
  }
};

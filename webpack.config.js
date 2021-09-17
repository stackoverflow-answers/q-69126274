const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const InlineChunkHTMLPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

module.exports = (_, { mode }) => ({
  context: path.resolve(__dirname),
  entry: "./src/index",

  output: {
    filename: mode === "production" ? "bundle.js" : "bundle.js",
    chunkFilename: "[name].[contenthash:8].chunk.min.js",
    path: path.join(path.resolve(__dirname, "build")),
    publicPath: "/",
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", "jsx"],
    alias: {
      src: path.resolve(__dirname, "src"),
    },
  },

  devtool: mode === "production" ? "" : "cheap-module-eval-source-map",
  target: "web",
  mode,

  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          babelrc: true,
        },
      },
      {
        test: /\.(png|jpe?g|gif|bmp|svg)$/,
        use: "url-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: "public/index.html",
      filename: "index.html",
      inject: false,
    }),
    mode === "production"
      ? new InlineChunkHTMLPlugin(HTMLWebpackPlugin, [/runtime-.+[.]js/])
      : undefined,
    new WebpackManifestPlugin({
      fileName: "asset-manifest.json",
      generate: (seed, files, entrypoints) => {
        const entrypointFiles = entrypoints.main.filter(
          (fileName) => !fileName.endsWith(".map")
        );
        const manifestFiles = files.reduce(
          (manifest, file) => ({
            ...manifest,
            [file.name]: file.path,
          }),
          seed
        );

        return {
          files: manifestFiles,
          entrypoints: entrypointFiles,
        };
      },
    }),
  ].filter(Boolean),

  devServer: {
    historyApiFallback: true,
    compress: true,
    hot: true,
    host: "0.0.0.0",
    index: "index.html",
    port: 3001,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
    disableHostCheck: true,
  },

  optimization:
    mode === "production"
      ? {
          minimize: true,
          minimizer: [new TerserPlugin()],
          splitChunks: {
            chunks: "all",
            name: false,
            cacheGroups: {
              vendors: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendor",
                chunks: "all",
              },
            },
          },
        }
      : undefined,
});

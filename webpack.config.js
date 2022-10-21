const path = require("path");
// 拆分css檔plugin
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 不經過 loader 直接搬移檔案
const CopyPlugin = require("copy-webpack-plugin");
// const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  // 透過 npm scripts 傳入的環境變數指定 mode
  mode: process.env.NODE_ENV,
  // 指定進入點資料夾
  context: path.resolve(__dirname, "."),
  // 多個進入點 寫成物件寫法
  entry: {
    index: "index",
    about: "about",
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "./js/[name].js",
    // 自動清除 dist (webpack 5 才能用)
    clean: true,
  },
  resolve: {
    modules: [
      // 以下 在 import 的時候都可以省略路徑這些片段
      path.resolve("src"),
      path.resolve("src/js"),
      path.resolve("src/scss"),
      path.resolve("src/images"),
      path.resolve("node_modules"),
    ],
    // 可省略.js 副檔名
    extensions: [".js"],
  },
  devServer: {
    compress: true, // 使用 gzip 壓縮
    port: 8080,
    hot: false,
    host: "0.0.0.0", // 預設是 localhost，設定則可讓外網存取
    open: true, // 打開瀏覽器
    liveReload: true, // 瀏覽器自動重新整理
  },
  plugins: [
    new MiniCssExtractPlugin({
      // 輸出路徑與名稱設定
      filename: "css/[name].css",
    }),
    new CopyPlugin(
    {
      patterns: [
        { from: "./src/assets", to: "." },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            // 搬移檔案
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.js$/,
        // 排除 node_modules 底下資料
        exclude: /node_modules/,
        use: "babel-loader",
      },
      // 圖片處理
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        use: [
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: "65-90",
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
            },
          },
        ],
        generator: {
          filename: "images/[name][ext][query]",
        },
      },
    ],
  },
};

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: ["@babel/polyfill", "./src/index"], // Dẫn tới file index.js ta đã tạo
  devtool: 'inline-source-map',
  //target: 'node',
  output: {
    path: path.join(__dirname, "/dist"), // Thư mục chứa file được build ra
    filename: "bundle.js" // Tên file được build ra
  },
  module: {
    rules: [    
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ["ts-loader"]
      },  
      {
        test: /\.(js|jsx)$/, // Sẽ sử dụng babel-loader cho những file .js
        exclude: /node_modules/, // Loại trừ thư mục node_modules
        use: ["babel-loader"]
      },      
      {
        test: /\.css$/, // Sử dụng style-loader, css-loader cho file .css
        use: ["style-loader", "css-loader"]
      },
      { 
        test: /\.(ttf|woff2?|png|jpe?g|svg|webp|gif|mp3)$/, 
        exclude: /node_modules/, // Loại trừ thư mục node_modules
        use: ["file-loader?name=[name].[ext]"] // ?name=[name].[ext] is only necessary to preserve the original file name
      },
      {
        test: /\.json$/,
        use: ["json-loader"]
      },
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },      
      // {
      //   test: /\.d\.ts$/,
      //   use: ["ts-loader"]
      //   //use: ["ignore-loader"]
      // },
    ]
  },
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
    fallback: { "stream": require.resolve("stream-browserify") },
  },
  // Chứa các plugins sẽ cài đặt trong tương lai
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          manifest: './public/manifest.json'
      },
      chunksSortMode: 'auto'
    }),
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       to: "dist/public/[name].[ext]",
    //       from: "public/*.*", 
    //     },
    //   ],      
    // }),
    // Work around for Buffer is undefined:
        // https://github.com/webpack/changelog-v5/issues/10
    new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
        process: 'process/browser',
    }),
   
    // new MiniCssExtractPlugin({
    //   filename: "./src/yourfile.css",
    // }),
  ],
  // Dev server config
  devServer: {
    hot: true
  },
};
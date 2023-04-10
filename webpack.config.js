const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    path: __dirname + "/public",
    filename: '[name].bundle.js',
    chunkFilename: "[name].[id].js",
  },
  module: {
      rules: [
      {
        test: /\.csv$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              outputPath: 'data',
              publicPath: 'data',
            },
          },
        ],
      },
      {
        test: /\.svelte$/,
        use: 'svelte-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'assets',
        },
      },
      {
        test: /\.bib$/i,
        use: 'raw-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/data',
          to: 'data',
        },
        {
          from: './src/images',
          to: 'images',
        },
      ],
    }),
  ],
  mode: 'development',
};

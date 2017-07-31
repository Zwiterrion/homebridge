var webpack = require('webpack');

module.exports = {
  output: {
    path: './public/js/',
    publicPath: '/js/',
    filename: 'bundle.js'
  },
  entry: {
    app: ['./src/index.js']
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.css$/,
        loader: 'style-loader'
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
        query: {
          modules: true,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  devServer: {
    port: 8080,
    host: '192.168.86.53',
    historyApiFallback: true
  }
};

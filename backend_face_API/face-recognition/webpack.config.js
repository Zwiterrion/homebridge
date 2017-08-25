var helpers = require('./config/helpers');

module.exports = {
    entry: {
      "app": "./app/main.ts"
    },
    output: {
        path: helpers.root('public/js'),
        filename: "bundle.js",
        publicPath: '/js/'
    },
    resolve: {
      extensions: ['.ts', '.js']
    },

    module: {
      rules: [
        {
          test: /\.ts$/,
          loaders: [
            {
              loader: 'awesome-typescript-loader',
              options: { configFileName: helpers.root('app', 'tsconfig.json') }
            },
            {
              loader: 'angular2-template-loader'
            }
          ]
        },
        {
            test: /\.html$/,
            loader: 'html-loader',
            options: {
                minimize: true,
                removeComments: true,
                collapseWhitespace: true,

                // angular 2 templates break if these are omitted
                removeAttributeQuotes: false,
                keepClosingSlash: true,
                caseSensitive: true,
                conservativeCollapse: true,
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
        historyApiFallback: true
    }
};

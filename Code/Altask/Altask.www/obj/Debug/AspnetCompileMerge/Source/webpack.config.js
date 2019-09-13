/// <binding BeforeBuild='Run - Development' />
var webpack = require('webpack');
var path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

var DEV_SERVER = process.argv[1].indexOf('webpack-dev-server') !== -1;
var DEV = DEV_SERVER || process.env.DEV;

var plugins = [];

if (!DEV) {
    //plugins.push(new webpack.optimize.UglifyJsPlugin({ sourceMap: true, }));
}

plugins.push(new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }));
plugins.push(new webpack.ProvidePlugin({
    jQuery: "jquery",
    $: "jquery",
    jquery: "jquery",
    'window.jQuery': 'jquery'
}));
plugins.push(new ExtractTextPlugin('eda.dragdropway.css'));

module.exports = {
    entry: {
        "app": "./App/Bootstrap/bootstrap.js",

        "vendor": [
          'jquery',
          'angular',
          'oclazyload',
          '@uirouter/core',
          '@uirouter/angularjs',
        ],
    },

    devtool: DEV ? 'source-map' : 'source-map',

    output: {
        path: path.join(__dirname, "Bundles"),
        publicPath: 'Bundles/',
        filename: "[name].js",
    },

    resolve: {
        extensions: ['.js']
    },

    plugins: plugins,

    module: {
        rules: [
              {
                  test: /\.js$/,
                  use: ["source-map-loader"],
                  enforce: "pre",
                  exclude: [/@uirouter/]
              },
              {
                  test: /\.js$/,
                  exclude: /(node_modules)/,
                  use: { loader: 'babel-loader' },
                  //use: { loader: 'babel-loader', options: { presets: ['babel-preset-es2015'] } },
              },
                {
                    test: /\.css$/,
                    loader: 'style-loader'
                }, {
                    test: /\.scss$/,
                    use: [{
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "sass-loader" // compiles Sass to CSS
                    }]
                }, {
                    // ASSET LOADER
                    // Reference: https://github.com/webpack/file-loader
                    // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
                    // Rename the file using the asset hash
                    // Pass along the updated reference to your code
                    // You can add here any file extension you want to get copied to your output
                    test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
                    loader: 'file'
                }, {
                    test: /\.json$/,
                    loader: 'json-loader'
                }, {
                    // HTML LOADER
                    // Reference: https://github.com/webpack/raw-loader
                    // Allow loading html through js
                    test: /\.html$/,
                    loader: 'raw-loader'
                },
        ]
    }
};

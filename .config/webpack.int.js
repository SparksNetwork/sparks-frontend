"use strict";
var path = require("path");
var webpack = require("webpack");
var assetsPath = path.resolve('./assets');
var DEV = 'development';
if (!process.env.BUILD_ENV)
    process.env.BUILD_ENV = DEV;
var stringify = JSON.stringify;
var Sparks = {
    buildEnv: stringify(process.env.BUILD_ENV),
    firebase: {
        databaseURL: stringify(process.env.FIREBASE_INTEGRATION_DATABASE_URL),
        apiKey: stringify(process.env.FIREBASE_INTEGRATION_API_KEY),
        authDomain: stringify(process.env.FIREBASE_INTEGRATION_AUTH_DOMAIN),
        storageBucket: stringify(process.env.FIREBASE_INTEGRATION_STORAGE_BUCKET),
        messagingSenderId: stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
    },
};
var basePlugins = [
    new webpack.DefinePlugin({ Sparks: Sparks }),
];
var prodPlugins = [
    new webpack.optimize.UglifyJsPlugin({ compress: true }),
    new webpack.NoErrorsPlugin(),
];
var plugins = process.env.BUILD_ENV === DEV
    ? basePlugins
    : basePlugins.concat(prodPlugins);
var TSLoader = {
    test: /\.ts$/,
    loader: 'awesome-typescript-loader',
    exclude: /node_modules/,
};
var ImageLoader = {
    test: /\.(jpe?g|png|gif|svg)$/i,
    loader: 'null-loader',
};
var config = {
    plugins: plugins,
    output: {
        path: path.resolve('./dist'),
        filename: 'bundle.js',
        publicPath: 'http://localhost:8080/',
    },
    devtool: 'source-map',
    // required by debug module used with webpack-dev-server
    externals: [require('webpack-node-externals')()],
    devServer: {
        inline: true,
        host: '0.0.0.0',
        contentBase: path.resolve('./dist'),
        historyApiFallback: true,
    },
    module: {
        loaders: [
            TSLoader,
            ImageLoader,
        ],
    },
    resolve: {
        // module and jsnext:main are for tree-shaking compatibility
        // mainFields: ['module', 'jsnext:main', 'main'],
        extensions: ['.ts', '.js', '.json'],
        alias: {
            assets: assetsPath,
        },
    },
};
module.exports = config;

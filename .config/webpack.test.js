const path = require("path");
const webpack = require("webpack");
const assetsPath = path.resolve('./assets');
const stringify = JSON.stringify;

const Sparks = {
  buildEnv: stringify("development"),
  firebase: {
    databaseURL: stringify(process.env.FIREBASE_DATABASE_URL),
    apiKey: stringify(process.env.FIREBASE_API_KEY),
    authDomain: stringify(process.env.FIREBASE_AUTH_DOMAIN),
    storageBucket: stringify(process.env.FIREBASE_STORAGE_BUCKET),
    messagingSenderId: stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
  },
};

const TSLoader = {
  test: /\.ts$/,
  loader: 'awesome-typescript-loader',
  exclude: /node_modules/,
};

const ImageLoader = {
  test: /\.(jpe?g|png|gif|svg|scss|css)$/i,
  loader: 'null-loader',
};

const plugins = [
  new webpack.DefinePlugin({ Sparks: Sparks }),
];

module.exports = {
  plugins: plugins,
  output: {
    path: path.resolve('./dist'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/',
  },
  devtool: 'source-map',
  // required by debug module used with webpack-dev-server
  externals: [require('webpack-node-externals')()],
  module: {
    rules: [
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

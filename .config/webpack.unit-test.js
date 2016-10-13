const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

const assetsPath = path.resolve('./assets')

const toString = x => JSON.stringify(x);
const Sparks = {
  buildEnv: toString(process.env.BUILD_ENV),
  firebase: {
    databaseURL: toString(process.env.FIREBASE_DATABASE_URL),
    apiKey: toString(process.env.FIREBASE_API_KEY),
    authDomain: toString(process.env.FIREBASE_AUTH_DOMAIN),
    storageBucket: toString(process.env.FIREBASE_STORAGE_BUCKET),
    messagingSenderId: toString(process.env.FIREBASE_MESSAGING_SENDER_ID),
  }
}

const plugins = [
  new webpack.EnvironmentPlugin([
    'BUILD_ENV',
    'FIREBASE_DATABASE_URL',
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID'
  ]),
  new webpack.DefinePlugin({ Sparks }),
  new ExtractTextPlugin({filename: 'styles.css', allChunks: true })
]

const TSLoader = {
  test: /\.ts$/,
  loader: 'awesome-typescript-loader',
  exclude: /node_modules/
}

const SASSLoader = {
  test: /\.scss$/,
  loader: 'null'
}

const CSSLoader = {
  test: /\.css$/,
  loader: 'null'
}

const ImageLoader = {
  test: /\.(jpe?g|png|gif|svg)$/i,
  loader: 'null'
}

module.exports = {
  target: 'node',

  plugins,

  devtool: 'source-map',

  module: {
    loaders: [
      TSLoader,
      SASSLoader,
      CSSLoader,
      ImageLoader,
    ],
  },

  externals: [nodeExternals()],

  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      assets: assetsPath
    },
  },
}

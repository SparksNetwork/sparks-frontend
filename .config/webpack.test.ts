import * as path from 'path';
import * as webpack from 'webpack';
const assetsPath = path.resolve('./assets');

const DEV = 'development';

if (!process.env.BUILD_ENV)
  process.env.BUILD_ENV = DEV;

const stringify = JSON.stringify;

const Sparks = {
  buildEnv: stringify(process.env.BUILD_ENV),
  firebase: {
    databaseURL: stringify(process.env.FIREBASE_DATABASE_URL),
    apiKey: stringify(process.env.FIREBASE_API_KEY),
    authDomain: stringify(process.env.FIREBASE_AUTH_DOMAIN),
    storageBucket: stringify(process.env.FIREBASE_STORAGE_BUCKET),
    messagingSenderId: stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
  },
};

const basePlugins = [
  new webpack.DefinePlugin({ Sparks }),
];

const prodPlugins = [
  new webpack.optimize.UglifyJsPlugin({ compress: true }),
  new webpack.NoErrorsPlugin(),
];

const plugins = process.env.BUILD_ENV === DEV
  ? basePlugins
  : basePlugins.concat(prodPlugins);

const TSLoader = {
  test: /\.ts$/,
  loader: 'ts-loader',
  exclude: /node_modules/,
};

const ImageLoader = {
  test: /\.(jpe?g|png|gif|svg)$/i,
  loader: 'null-loader',
};

const config: webpack.Configuration = {
  plugins,

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
  } as any,
};

export = config;

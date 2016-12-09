const path = require("path");
const webpack = require("webpack");
const srcPath = path.resolve('./src');
const assetsPath = path.resolve('./node_modules/sparks-design-system/src/assets');
const stringify = JSON.stringify;
const HtmlWebpackPlugin = require('html-webpack-plugin');

const Sparks = {
  buildEnv: stringify('production'),
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

const SASSLoader = {
  test: /\.scss$/,
  loader: [
    'style-loader',
    'css-loader',
    'sass-loader'
  ]
};

const ImageLoader = {
  test: /\.(jpe?g|png|gif|svg)$/i,
  loaders: [
    {
      loader: 'file-loader',
      query: {
        hash: 'sha512',
        digest: 'hex',
        name: '[hash].[ext]'
      }
    },
    {
      loader: 'image-webpack-loader',
      query: {
        bypassOnDebug: true,
        optimizationLevel: 7,
        interlaced: false
      }
    }
  ],
};

const plugins = [
  new webpack.DefinePlugin({
    Sparks: Sparks,
    'process.env': {
      'NODE_ENV': stringify('production'),
    },
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),
  new webpack.NoErrorsPlugin(),
  new HtmlWebpackPlugin({
    template: 'src/index.ejs',
    inject: 'body'
  }),
  new webpack.optimize.CommonsChunkPlugin("vendor"),
];

module.exports = {
  plugins: plugins,
  entry: {
    app: path.join(srcPath, 'app.ts'),
    vendor: ['ramda', 'most', 'firebase']
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name]-[chunkhash].js',
  },
  module: {
    rules: [
      TSLoader,
      SASSLoader,
      ImageLoader,
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [
      'node_modules',
    ],
    alias: {
      assets: assetsPath,
    },
  },
};

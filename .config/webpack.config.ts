import * as path from 'path';
import * as webpack from 'webpack';
const srcPath = path.resolve('./src');
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
  loader: 'awesome-typescript-loader',
  exclude: /node_modules/,
};

const ImageLoader = {
  test: /\.(jpe?g|png|gif|svg)$/i,
  loaders: [
    'file?hash=sha512&digest=hex&name=[hash].[ext]',
    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
  ],
};

const config: webpack.Configuration = {
  plugins,

  devtool: process.env.BUILD_ENV === DEV ? 'source-map' : '',

  entry: [
    path.join(srcPath, 'app.ts'),
  ],

  output: {
    path: path.resolve('./dist'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/',
  },

  // required by debug module used with webpack-dev-server
  externals: ['fs', 'net'],

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
    mainFields: ['module', 'jsnext:main', 'main'],
    extensions: ['.ts', '.js', '.json'],
    alias: {
      assets: assetsPath,
    },
  } as any,
};

export = config;

const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const srcPath = path.resolve('./src')
const imagePath = path.resolve('./dist/images')
const vendorPath = path.resolve('./vendor')

const DEV = 'development'

if (!process.env.BUILD_ENV) {
  process.env.BUILD_ENV = DEV
}

const basePlugins = [
  new webpack.EnvironmentPlugin([
    'BUILD_ENV',
    'FIREBASE_URL',
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_STORAGE_BUCKET'
  ]),
  new ExtractTextPlugin({filename: 'styles.css', allChunks: true })
]

const prodPlugins = [
  new webpack.optimize.UglifyJsPlugin({ minimize: true })
]

const devPlugins = [
]


const plugins = process.env.BUILD_ENV === DEV 
  ? basePlugins.concat(devPlugins)
  : basePlugins.concat(prodPlugins)


const TSLoader = {
  test: /\.ts$/,
  loader: 'awesome-typescript-loader',
  exclude: /node_modules/
}

const SASSLoader = {
  test: /\.scss$/,
  loader: ExtractTextPlugin.extract({
    fallbackLoader: 'style-loader',
    loader: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]' +
    '!postcss-loader' +
    '!sass-loader?outputStyle=expanded' 
  })
}

const CSSLoader = {
  test: /\.css$/,
  loader: ExtractTextPlugin.extract({
    fallbackLoader: 'style-loader',
    loader: 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]' +
    '!postcss-loader'
  }),
}

const ImageLoader = {
  test: /\.(jpe?g|png|gif|svg)$/i,
  loaders: [
    'file?hash=sha512&digest=hex&name=[hash].[ext]',
    'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false',
  ],
}

const environmentOptions = process.env.BUILD_ENV === 'production'
  ? { }
  : {
    debug: true,
    devtool: 'source-map',
  }

module.exports = {
  plugins,

  debug: process.env.BUILD_ENV === DEV,
  devtool: process.env.BUILD_ENV === DEV ? 'source-map': '',

  entry: [
    path.join(srcPath, 'app.ts'),
  ],

  output: {
    path: './dist', 
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/',
  },

  devServer: {
    contentBase: path.resolve('./dist'),
    historyApiFallback: true,
  },

  output: {
    path: path.resolve('./dist'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/',
  },

  devServer: {
    contentBase: path.resolve('./dist'),
    historyApiFallback: true,
  },

  module: {
    loaders: [
      TSLoader,
      SASSLoader,
      CSSLoader,
      ImageLoader,
    ],
  },

  mainFields: ['jsnext:main', 'main'],

  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      // You can not get in-editor typings with aliases
      // component: srcPath + '/component', 
      // page: srcPath + '/page',
      // driver: srcPath + '/driver',
      // module: srcPath + '/module',
      // util: srcPath + '/util',
      // remote: srcPath + '/remote',
      // translation: srcPath + '/translation',
      // images: imagePath,
      // surface: vendorPath + '/surface',
    },
  },
}

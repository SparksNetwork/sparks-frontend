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

const basePlugins = [
    new webpack.EnvironmentPlugin([
        'BUILD_ENV',
        'FIREBASE_DATABASE_URL',
        'FIREBASE_API_KEY',
        'FIREBASE_AUTH_DOMAIN',
        'FIREBASE_STORAGE_BUCKET',
        'FIREBASE_MESSAGING_SENDER_ID',
        'TS_NODE_FAST'
    ]),
    new webpack.DefinePlugin({Sparks}),
    new ExtractTextPlugin({filename: 'styles.css', allChunks: true})
]

const prodPlugins = [
    new webpack.optimize.UglifyJsPlugin({minimize: true})
]

const devPlugins = []


const plugins = process.env.BUILD_ENV === DEV
    ? basePlugins.concat(devPlugins)
    : basePlugins.concat(prodPlugins)


const TSLoader = {
    test: /\.ts$/,
    loader: 'awesome-typescript-loader',
    exclude: /node_modules/
}

const environmentOptions = process.env.BUILD_ENV === 'production'
    ? {}
    : {
    devtool: 'source-map',
}

module.exports = {
    plugins,

    devtool: process.env.BUILD_ENV === DEV ? 'source-map' : '',

    entry: [
        path.join(srcPath, 'app-spec.ts'),
    ],

    output: {
        path: './mocha-browser-testing',
        filename: 'test-bundle.js',
        publicPath: 'http://localhost:8080/',
    },

    devServer: {
        contentBase: path.resolve('./dist'),
        historyApiFallback: true,
    },

    module: {
        loaders: [
            TSLoader,
        ],
    },

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

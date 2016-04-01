require("babel-polyfill");

var webpack = require("webpack"),
    path = require('path'),
    BUILD_DIR = path.resolve(__dirname, 'build'),
    VIEWS_DIR = path.resolve(__dirname, 'src/views');

module.exports = {
    entry: VIEWS_DIR + '/index.jsx',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        })
    ],
    module: {
        loaders: [{
            test: /.jsx?$/,
            loader: 'babel-loader',
            plugins: ['object-assign'],
            query: {
                presets: ['es2015', 'react']
            }
        }],
        
    }
};
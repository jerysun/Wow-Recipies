const path = require('path');// the absolute path of a built-in package node_modules
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: [ './src/js/index.js' ],
    output: {
        path: path.resolve(__dirname, 'dist'), // __dirname is the current directory name
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};

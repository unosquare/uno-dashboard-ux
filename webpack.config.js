const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './sample/index.tsx',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'index.bundle.js',
        publicPath: '/',
    },
    mode: process.env.NODE_ENV || 'development',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devServer: { historyApiFallback: true },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: 'tsconfig.webpack.json',
                        },
                    },
                ],
            },
            {
                test: /\.(css|scss)$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(jpg|jpeg|png|gif|mp3|svg|ico)$/,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: './public/404.html', to: '[name][ext]' },
                { from: './public/manifest.json', to: '[name][ext]' },
                { from: './public/favicon.ico', to: '[name][ext]' },
            ],
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public', 'index.html'),
        }),
    ],
};

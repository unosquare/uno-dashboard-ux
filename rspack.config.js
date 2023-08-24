const path = require('path');

module.exports = {
    entry: {
        main: './sample/index.tsx',
    },
    output: {
        filename: 'index.bundle.js',
        path: path.resolve(__dirname, 'build'),
    },
    devServer: { historyApiFallback: true },
    builtins: {
        html: [{ template: './public/index.html', publicPath: '/' }],
        copy: {
            patterns: ['./public/404.html', './public/manifest.json', './public/favicon.ico'],
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['postcss-loader'],
            },
        ],
    },
};

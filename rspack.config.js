const rspack = require('@rspack/core');
const path = require('path');
const ReactRefreshPlugin = require('@rspack/plugin-react-refresh');
const prod = process.env.NODE_ENV === 'production';

module.exports = {
    entry: {
        main: './sample/index.tsx',
    },
    output: {
        filename: 'index.bundle.js',
        path: path.resolve(__dirname, 'build'),
    },
    devServer: { historyApiFallback: true },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['postcss-loader'],
            },
            {
                test: /\.(j|t)s$/,
                exclude: [/[\\/]node_modules[\\/]/],
                loader: 'builtin:swc-loader',
                options: {
                    sourceMap: false,
                    jsc: {
                        parser: {
                            syntax: 'typescript',
                        },
                        externalHelpers: true,
                        transform: {
                            react: {
                                runtime: 'automatic',
                                development: !prod,
                                refresh: !prod,
                            },
                        },
                    },
                    env: {
                        targets: 'Chrome >= 110',
                    },
                },
            },
            {
                test: /\.(j|t)sx$/,
                loader: 'builtin:swc-loader',
                exclude: [/[\\/]node_modules[\\/]/],
                options: {
                    sourceMap: false,
                    jsc: {
                        parser: {
                            syntax: 'typescript',
                            tsx: true,
                        },
                        transform: {
                            react: {
                                runtime: 'automatic',
                                development: !prod,
                                refresh: !prod,
                            },
                        },
                        externalHelpers: true,
                    },
                    env: {
                        targets: 'Chrome >= 110',
                    },
                },
            },
        ],
    },
    plugins: [
        new rspack.HtmlRspackPlugin({ template: './public/index.html' }),
        new rspack.CopyRspackPlugin({
            patterns: ['./public/404.html', './public/manifest.json', './public/favicon.ico'],
        }),
        !prod && new ReactRefreshPlugin(),
        new rspack.ProgressPlugin({}),
    ],
};

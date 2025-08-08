import { defineConfig } from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginReact } from '@rsbuild/plugin-react';

const ReactCompilerConfig = {
    target: '18',
};

export default defineConfig({
    source: {
        entry: {
            index: './sample/index.tsx',
        },
    },
    html: {
        title: 'Unosquare Dashboard UX/UI',
    },
    plugins: [
        pluginReact(),
        pluginBabel({
            include: /\.(?:jsx|tsx)$/,
            babelLoaderOptions(opts) {
                opts.plugins?.unshift(['babel-plugin-react-compiler', ReactCompilerConfig]);
            },
        }),
    ],
});

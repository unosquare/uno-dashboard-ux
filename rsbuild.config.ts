import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
    source: {
        entry: {
            index: './sample/index.tsx',
        },
    },
    html: {
        title: 'Unosquare Dashboard UX/UI',
    },
    plugins: [pluginReact()],
});

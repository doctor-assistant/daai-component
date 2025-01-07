import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

/** @type {import('webpack').Configuration} */
const config = {
    target: 'webworker',
    entry: './src/DaaiBadge.js',
    output: {
        path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'dist'),
        filename: 'DaaiBadge.js',
        libraryTarget: 'commonjs2',
        devtoolModuleFilenameTemplate: '../[resource-path]',
    },
    devtool: 'source-map',
    externals: {
        vscode: 'commonjs vscode',
    },
    resolve: {
        mainFields: ['browser', 'module', 'main'],
        extensions: ['.ts', '.js'],
        alias: {
            'eventsource': 'extended-eventsource',
            'dexie': 'dexie',
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
    ],
    devServer: {
        static: {
            directory: path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist'),
        },
        compress: true,
        port: 9000,
        liveReload: true,
        hot: false,
    },
};

export default config;
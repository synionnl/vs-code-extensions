import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import path from 'path';
import * as url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const config = {
    entry: './src/bpmn-editor/index.ts',
    module: {
        rules: [{
            test: /\.ts?$/,
            use: ['ts-loader', 'minify-html-literals-loader'],
            exclude: /node_modules/,
        }, {
            test: /\.css$/i,
            use: ["to-string-loader", "css-loader"],
        }, { 
            test: /\.(png|woff|woff2|eot|ttf|svg)$/,
            type: "asset/resource"
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.scss', 'css']
    },
    output: {
        filename: 'bpmn-editor.js',
        chunkFilename: 'bpmn-editor.js',
        path: path.resolve(__dirname, './dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ],
    optimization: {
        minimizer: [
            new TerserPlugin
        ]
    },
    devServer: {
        static: path.join(__dirname, './dist'),
        compress: true,
        port: 4000
    },
};

export default config;
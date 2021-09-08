import { HotModuleReplacementPlugin } from "webpack"
import { resolve as _resolve } from "path"
import HtmlWebpackPlugin from "html-webpack-plugin"
import ESLintPlugin from "eslint-webpack-plugin"

module.exports = {
    mode: "development",
    entry: "./src/index.jsx",
    output: {
        path: _resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
        chunkFilename: "[name].chunk.js",
    },
    resolve: {
        modules: [path.join(__dirname, "src"), "node_modules"],
        alias: {
            react: path.join(__dirname, "node_modules", "react"),
        },
    },
    devServer: {
        open: true,
        compress: true,
        hot: true,
        port: 9000,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.less$/i,
                use: ["style-loader", "css-loader", "postcss-loader", "less-loader"],
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
            {
                test: /\.(svg|png|jpe?g|gif)$/i,
                loader: "file-loader",
                options: {
                    name: "[path][name].[ext]",
                },
            },
        ],
    },
    plugins: [
        new HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: "dist/index.html",
        }),
        new ESLintPlugin({
            extensions: ["js", "jsx"],
        }),
    ],
}

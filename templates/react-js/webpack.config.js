const webpack = require("webpack")
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const DashboardPlugin = require("webpack-dashboard/plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const safePostCssParser = require("postcss-safe-parser")
const TerserPlugin = require("terser-webpack-plugin")
const dotenv = require("dotenv")
const WebpackNotifierPlugin = require("webpack-notifier")

const env = dotenv.config().parsed

let envKeys

if (env) {
    envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next])
        return prev
    }, {})
}

const config = {
    devtool: "cheap-module-source-map",
    entry: "./src/index.js",
    resolve: {
        modules: [path.resolve(__dirname, "src"), "node_modules"],
        extensions: [".js", ".jsx"],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
        chunkFilename: "[name].chunk.js",
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
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "style-loader", "css-loader", "postcss-loader"],
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
    performance: {
        hints: false,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new DashboardPlugin(),
        new webpack.DefinePlugin(envKeys ? envKeys : {}),
        new WebpackNotifierPlugin({ alwaysNotify: false }),
        new HtmlWebpackPlugin({
            template: "dist/index.html",
        }),
    ],
}
module.exports = (argv) => {
    const isProd = argv.mode === "production"

    if (isProd) {
        config.devtool = "source-map"
        config.optimization = {
            minimize: isProd,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: {
                            ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2,
                        },
                    },
                }),
            ],
            splitChunks: {
                chunks: "all",
                name: false,
            },
        }
        config.plugins.push(
            new CleanWebpackPlugin(),
            new webpack.optimize.DedupePlugin(),
            new HtmlWebpackPlugin({
                template: "dist/index.html",
                minify: isProd && {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                },
            })
        )
    }

    return config
}

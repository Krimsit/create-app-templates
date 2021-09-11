const webpack = require("webpack")
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const DashboardPlugin = require("webpack-dashboard/plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const safePostCssParser = require("postcss-safe-parser")
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const dotenv = require("dotenv")

module.exports = (argv) => {
    const env = dotenv.config().parsed

    const isProd = argv.mode === "production"
    const isDev = argv.mode === "development"

    const envKeys = Object.keys(env).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(env[next])
        return prev
    }, {})

    return {
        devtool: isProd ? "source-map" : isDev && "cheap-module-source-map",
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
        optimization: {
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
                    mangle: true,
                    parallel: true,
                    sourceMap: true,
                    cache: true,
                }),
                new OptimizeCSSAssetsPlugin({
                    cssProcessorOptions: {
                        parser: safePostCssParser,
                        map: {
                            inline: false,
                            annotation: true,
                        },
                    },
                    cssProcessorPluginOptions: {
                        preset: ["default", { minifyFontValues: { removeQuotes: false } }],
                    },
                }),
            ],
            splitChunks: {
                chunks: "all",
                name: false,
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
            isProd && new CleanWebpackPlugin(),
            isProd && new webpack.optimize.DedupePlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new DashboardPlugin(),
            new webpack.DefinePlugin(envKeys),
            new WebpackNotifierPlugin({ alwaysNotify: false }),
            new HardSourceWebpackPlugin(),
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
            }),
        ],
    }
}

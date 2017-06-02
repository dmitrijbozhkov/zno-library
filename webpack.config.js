var path = require("path");
var extract_text = require("extract-text-webpack-plugin");
var webpack = require("webpack");

module.exports = [
    { // Settings fot client
        context: path.resolve(__dirname, "client"),
        entry: {
            app: "./main/init.module"
        },
        output: {
            path: path.resolve(__dirname, "static"),
            filename: "[name].js"
        },
        resolve: {
            extensions: [".ts", ".js"]
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: ["awesome-typescript-loader"],
                    exclude: [ /\.(spec)\.ts$/ ]
                }
            ]
        },
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: "commons",
                filename: "[name].js"
            })
        ],
        devtool: "source-map"
    },
    { // Settings for assets and styles
        context: path.resolve(__dirname, "client"),
        entry: {
            styles: "./styles",
            assets: "./assets"
        },
        output: {
            path: path.resolve(__dirname, "static"),
            filename: "[name].js"
        },
        resolve: {
            extensions: [".ts", ".scss", ".js", ".css", ".eot", ".svg", ".ttf", ".woff", ".woff2", ".otf"]
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: ["awesome-typescript-loader"]
                },
                {
                    test: /\.scss$/,
                    use: extract_text.extract({
                        fallback: "style-loader",
                        use: ["css-loader", "sass-loader"]
                    }),
                    exclude: [ /\.(spec)\.ts$/ ]
                },
                {
                    test: /\.css$/,
                    use: extract_text.extract({
                        fallback: "style-loader",
                        use: ["css-loader"]
                    }),
                    exclude: [ /\.(spec)\.ts$/ ]
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                    use: "file-loader?name=[name].[ext]",
                    exclude: [ /\.(spec)\.ts$/ ]
                }
            ]
        },
        plugins: [
            new extract_text({
                filename: "[name].css"
            })
        ],
        devtool: "source-map"
    }
];
var path = require("path");
var extract_text = require("extract-text-webpack-plugin");
var webpack = require("webpack");

module.exports = [
    { // Settings for tests
        context: path.resolve(__dirname, "tests"),
        entry: {
            "lib.test": "mocha-loader!./client/src/lib/bundle.test",
            "app.test": "mocha-loader!./client/src/app/bundle.test"
        },
        output: {
            path: path.resolve(__dirname, "tests", "client", "app"),
            filename: "[name].js"
        },
        resolve: {
            extensions: [".ts", ".js", ".scss"]
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: ["ts-loader"]
                },
                {
                    test: /\.scss$/,
                    use: ["ignore-loader"]
                }
            ]
        },
        devtool: "source-map"
    },
    { // Settings fot client
        context: path.resolve(__dirname, "client"),
        entry: {
            home: "./main/init"
        },
        output: {
            path: path.resolve(__dirname, "static"),
            filename: "[name].js"
        },
        resolve: {
            extensions: [".ts", ".scss", ".js"]
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: ["ts-loader"]
                },
                {
                    test: /\.scss$/,
                    use: extract_text.extract({
                        fallback: "style-loader",
                        use: ["css-loader", "sass-loader"]
                    })
                }
            ]
        },
        plugins: [
            new extract_text({
                filename: "[name].css"
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: "commons",
                filename: "[name].js"
            })
        ],
        devtool: "source-map"
    },
    { // Settings fot worker
        context: path.resolve(__dirname, "client"),
        entry: {
            worker: "./worker/init"
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
                    use: ["ts-loader"]
                }
            ]
        },
        devtool: "source-map"
    }
];
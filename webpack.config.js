var path = require("path");
var extract_text = require("extract-text-webpack-plugin");

module.exports = [
    { // Settings for tests
        context: path.resolve(__dirname, "tests"),
        entry: {
            bundle: "mocha-loader!./client/src/bundle.test",
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
            loader: "./loader/init",
        },
        output: {
            path: path.resolve(__dirname, "static"),
            filename: "[name]/[name].js"
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
                filename: "[name]/[name].css"
            })
        ],
        devtool: "source-map"
    }
];
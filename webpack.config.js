module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "build.js"
    },
    watch: true,
    watchOptions: {
        ignored: "/node_modules/"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
}

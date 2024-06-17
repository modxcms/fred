const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, options) => {
    const isProd = options.mode === 'production';

    return {
        mode: options.mode,
        devtool: isProd ? false : 'source-map',

        entry: [
            './_build/assets/sass/fred.scss',
            './_build/assets/js/index.js'
        ],

        output: {
            path: path.resolve(__dirname, './assets/components/fred/web'),
            library: 'Fred',
            libraryTarget: 'umd',
            libraryExport: 'default',
            filename: 'fred.min.js',
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: "css-loader",
                            options: {
                                url: false,
                                sourceMap: true
                            }
                        },
                        {
                            loader: "postcss-loader"
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                implementation: require("sass")
                            }
                        }
                    ]
                }
            ]
        },

        resolve: {
            alias: {
                '@fred/Config': path.resolve(__dirname, '_build/assets/js/Config'),
                '@fred/UI': path.resolve(__dirname, '_build/assets/js/UI')
            },
            extensions: [ '.ts', '.js' ],
            fallback: {
                "path": require.resolve("path-browserify"),
                "url":  require.resolve("url/"),
            }
        },

        plugins: [
            new MiniCssExtractPlugin({
                filename: "fred.css"
            })
        ]
    };
};

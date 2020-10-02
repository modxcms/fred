const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
            filename: 'fred.min.js'
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ["@babel/preset-env", { "targets": "> 0.25%, not dead" }]
                            ],
                            plugins: ['@babel/plugin-proposal-class-properties']
                        }
                    }
                },
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: "css-loader?url=false",
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

        plugins: [
            isProd ? new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: ['fred.*']
            }) : () => {},
            new MiniCssExtractPlugin({
                filename: "fred.css"
            })
        ]
    };
};

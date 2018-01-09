var webpack = require('webpack');
var path = require('path');
var assign = require('object-assign');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = function getConfig(options) {

    var options = options || {};

    var isProd = (options.BUILD_ENV || process.env.BUILD_ENV) === 'PROD';

    // get library details from JSON config
    var libraryDesc = require('./package.json').library;
    var libraryName = libraryDesc.name;

    // determine output file name
    var outputName = buildLibraryOutputName(libraryDesc, isProd);

    // get base config
    var config;

    // for the web
    config = assign(getBaseConfig(isProd), {
        output: {
            path: path.join(__dirname, 'dist'),
            filename: outputName,
            library: libraryName,
            libraryTarget: 'umd',
            umdNamedDefine: true
        }
    });

    config.plugins.push(new CleanWebpackPlugin(['dist']));

    return config;
};

/**
 * Build base config
 * @param  {Boolean} isProd [description]
 * @return {[type]}         [description]
 */
function getBaseConfig(isProd) {

    // get library details from JSON config
    var libraryDesc = require('./package.json').library;
    var libraryEntryPoint = path.join('src', libraryDesc.entry);

    // generate webpack base config
    return {
        entry: path.join(__dirname, libraryEntryPoint),
        output: {
            // ommitted - will be filled according to target env
        },
        module: {
            loaders: [
                {test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: "babel-loader"},
            ]
        },
        resolve: {
            root: path.resolve('./src'),
            extensions: ['', '.js']
        },
        devtool: isProd ? null : '#eval-source-map',
        debug: !isProd,
        plugins: isProd ? [
            new webpack.DefinePlugin({'process.env': {'NODE_ENV': '"production"'}}),
            new UglifyJsPlugin({minimize: true})
            // Prod plugins here
        ] : [
            new webpack.DefinePlugin({'process.env': {'NODE_ENV': '"development"'}})
            // Dev plugins here
        ]
    };
}

function buildLibraryOutputName(libraryDesc, isProd) {
    return libraryDesc["dist-web"] || [libraryDesc.name, 'web', (isProd ? 'min.js' : 'js')].join('.');
}
module.exports = {
    plugins: [
        require('postcss-inline-svg')({
            paths: ['./_build/assets/images']
        }),
        require('postcss-svgo'),
        require('autoprefixer'),
        require('cssnano'),
    ]
}

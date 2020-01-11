module.exports = {
    devServer: {
        historyApiFallback: false,
        https: true
    },
    chainWebpack: config => {
        config.module.rule('eslint').use('eslint-loader')
          .tap(opts => ({ ...opts, emitWarning: true }));
    }
}
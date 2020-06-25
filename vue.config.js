module.exports = {
  devServer: {
    historyApiFallback: false
  },
  chainWebpack: config => {
    config.module
      .rule("eslint")
      .use("eslint-loader")
      .tap(opts => ({ ...opts, emitWarning: true }));
  }
};

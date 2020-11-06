const EnvironmentPlugin = require('webpack').EnvironmentPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  ...require('./webpack.config'),
  plugins: [
    new EnvironmentPlugin({ RUNNING_COSMOS: true }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
  ],
}

const HtmlWebpackPlugin = require('html-webpack-plugin')

const EnvironmentPlugin = require('webpack').EnvironmentPlugin
const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.join(__dirname, '../../.env') })

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'dist/bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  plugins: [
    new EnvironmentPlugin([
      'DISCORD_API_URL',
      'DISCORD_CLIENT_ID',
      'DISCORD_REDIRECT_URI',
      'GRAPHQL_API_URL',
      'IMAGE_API_URL',
    ]),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
  ],
}

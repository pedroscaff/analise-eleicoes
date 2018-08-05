const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
	entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js'
  },
  devServer: {
    contentBase: path.join(__dirname, './'),
    publicPath: '/dist/'
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './src/assets', to: './assets' }
    ])
  ],
  mode: 'development'
}

const path = require('path')

module.exports = {
  entry: './src/_js/script.js',
  output: {
    path: path.resolve(__dirname, 'src/dist'),
    filename: 'bundle.js'
  }
}

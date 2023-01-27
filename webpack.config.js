const path = require('path');

module.exports = {
  entry: './src/plugin.ts',
  module: {
    rules: [
      {
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'reveal-quiz-bundle-esm.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    library: {
      type: 'module'
    }
  },
  experiments: {
    outputModule: true,
  },
};

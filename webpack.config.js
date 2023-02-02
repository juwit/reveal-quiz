const path = require('path');

module.exports = {
  entry: './src/plugin.ts',
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.js', '.css'],
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

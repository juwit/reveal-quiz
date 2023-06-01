const path = require('path')

module.exports = [
  {
    entry: {
      model: ['./src/model/model.module.ts']
    },
    module: {
      rules: [
        {
          test: /\.ts$/i,
          use: 'ts-loader',
          exclude: /node_modules/,
        }
      ],
    },
    mode: 'production',
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: 'reveal-quiz-[name]-esm.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        type: 'module'
      }
    },
    experiments: {
      outputModule: true,
    },
  },
  {
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
      library: {
        type: 'module'
      }
    },
    experiments: {
      outputModule: true,
    },
  },
  {
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
      filename: 'reveal-quiz-bundle.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        name: 'RevealQuiz',
        type: 'var'
      }
    },
  }]

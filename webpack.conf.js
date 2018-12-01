import webpack from "webpack";
import path from "path";

export default {
  module: {
    rules: [
      {
        test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        use: "file?name=/[hash].[ext]"
      },
      {test: /\.svg$/,
       use: 'svg-inline-loader'
      },
      {test: /\.json$/, use: "json-loader"},
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",  
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      "fetch": "imports?this=>global!exports?global.fetch!whatwg-fetch"
    })
  ],

  context: path.join(__dirname, "src"),
  resolve: {
    alias: {
      'vendor': path.join(__dirname,"src/js/vendor/"),
      'utils':  path.join(__dirname,"src/js/utils/")
    }
  },
  entry: {
    album: ['./js/albums/app'],
    utils: ['./js/utils/utils']
  },
  output: {
    path: path.join(__dirname, "docs/js"),
    publicPath: "/js",
    filename: "[name].js",
    libraryTarget: 'umd'
  },
  externals:  [/^vendor\/.+\.js$/]
};

import webpack from "webpack";
import path from "path";

export default {
  module: {
    rules: [
      {
        test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        use: "file?name=/[hash].[ext]"
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
  entry: {
    azul: ['./js/labs/azul/app']
  },
  output: {
    path: path.join(__dirname, "docs/js"),
    publicPath: "/js",
    filename: "[name].js",
    libraryTarget: 'umd'
  },
  externals:  [/^vendor\/.+\.js$/]
};

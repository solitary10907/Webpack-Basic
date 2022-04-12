const path = require('path')

//plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
  //模式
  mode: 'production',
  target: 'web',
  //使用文件缓存，優化建構、打包速度
  cache: {
    type: 'filesystem', 
  },
  //引入檔案上限調整、引入檔案較大時不顯示錯誤
  performance: {
    maxAssetSize: 1000000,
    maxEntrypointSize: 1000000,
    hints: false
  },
  optimization: {
    runtimeChunk: 'single'
  },
  //入口
  entry: {
    main: path.resolve(__dirname, './src/index.js'),
    test: path.resolve(__dirname, './src/javascript/test.js'),
  },
  //出口
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'javascript/[name].[contenthash:8].js',
  },
  //伺服器
  devServer: {
    static: path.resolve(__dirname, './dist'),
    port: 4000,
    //整份打包成gzip，開啟瀏覽器速度較快，相對吃資源
    compress: true,
    //自動開啟瀏覽器
    open: true,
    //live serve
    hot: false
  },
  //插件
  plugins: [
    //html生成
    new HtmlWebpackPlugin({
      title: 'webpack Boilerplate',
      template: path.resolve(__dirname, './src/template.html'), // template file
      filename: 'index.html', // output file
      minfy:{
        collapseWhitespace: true, //去空格
        removeComments: true, //去註解
      },
      favicon: path.resolve(__dirname, './src/bitbug_favicon.ico'),
      //指定引入哪個入口(js)
      chunks: ['main', 'test'],
    }),
    //每次打包清理舊的
    new CleanWebpackPlugin(),

    //壓縮生成css
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
    }),

    //壓縮成gzip檔
    new CompressionPlugin ({
      test: /\.js$|\.html$|\.css$/u,
      threshold: 4096, // 超過 4kb 壓縮
    }),

    //JS代碼混淆
    new WebpackObfuscator ({
      stringArray: true,
      rotateStringArray: true
    }, ['main.js'])
  ],
  module: {   
    rules: [
      //html (可處理html內的image)
      {
        test:/\.html$/,
        loader:'html-loader',
      },
      //JavaScript ES6
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      //Images
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset',
        parser: {
          //小於 40kb 將圖轉為base64 
          dataUrlCondition: {
              maxSize: 40 * 1024
          }
        },
        //圖片產出位置
        generator: {
          filename: 'assets/images/[name][ext]'
        }
      },
      //Fonts and SVGs
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset',
        //文字或svg產出位置
        generator: {
          filename: 'assets/fonts/[name][ext]'
        }
      },
      //SCSS
      {
        test: /\.s[ac]ss$/i,
        //讀取順序從下往上
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ],
      },
      //JS混淆
      {
        test: /\.js$/,
        //排除套件，避免容量更大
        exclude: /node_modules/,
        enforce: 'post',
        use: { 
            loader: WebpackObfuscator.loader, 
            options: {
                rotateStringArray: true
            }
        }
      }
    ],
  }
}
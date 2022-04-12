# Webpack-Basic

## 1、項目每次打包後，檔案名稱自動加hash值，解決緩存問題。
    檔案webpack.config.js內第25行及58行
    filename: 'javascript/[name].[contenthash:8].js'
    filename: 'css/[name].[contenthash:8].css'
    使用的是contenthash，內容有變動時，hash值才會跟著變動
    
## 2、js文件代碼混淆
    檔案webpack.config.js內第8行、67-70行及120-132行
    rotateStringArray：數組移動固定和隨機（在代碼混淆處生成）位置。這使得將刪除字符串的順序與其原始位置匹配變得更加困難。
    
## 3、引入sass或者less等
    檔案webpack.config.js內第6行、56-59行及109-119行
    利用sass-loader讀取scss，再透過postcss-loader後處理器，對css進行優化(跨瀏覽器)，依靠css-loader讀取css的樣式，最後透過MiniCssExtractPlugin打包成一包。

## 4、生成gzip文件 提高訪問速度
    檔案webpack.config.js內第7行及61-65行
    個別判斷html、css、js檔案如果超過4kb則會額外生成一個gzip檔，瀏覽器有支援gzip且客戶端headers中若有 Accept-Encodingl：gzip, deflate ，就會給予gzip檔，提升瀏覽器訪問速度。

## 5、引入圖片機制：低於40kb的圖片文件轉base64
    檔案webpack.config.js內第85-99行
    利用webpack 5的Asset Modules，模塊去判斷是否轉成base64注入js

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    /*
        我们会在examples目录下建立多个子目录
        我们会把不同的章节的demo放到不同的子目录中
        每个子目录的下面会创建一个app.ts
        app.ts作为webpack构建的入口文件
        entries收集了多目录的入口文件，并且每个入口还引入了一个用于热更新的文件
        entries是一个对象，key为目录名
    */
   entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
       const fullDir = path.join(__dirname, dir);
       const entry = path.join(fullDir, 'app.ts');
       if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
           entries[dir] = ['webpack-hot-middleware/client', entry];
       }
       return entries;
   }, {}),
   output: {
       path: path.join(__dirname, '__build__'),
       filename: '[name].js',
       publicPath: '/__build__/'
   },
   module: {
       rules: [
           {
               test: /\.ts$/,
               enforce: 'pre',
               use: [
                   {
                       loader: 'tslint-loader'
                   }
               ]
           },
           {
            test: /\.tsx?$/,
            use: [
                {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true
                    }
                }
            ]
        }
       ]
   },
   resolve: {
       extensions: ['.ts', '.tsx', '.js']
   },
   plugins: [
       new webpack.HotModuleReplacementPlugin(),
       new webpack.NoEmitOnErrorsPlugin()
   ]
};
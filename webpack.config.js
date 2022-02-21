const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const devServer = (isDev) =>
    !isDev
        ? {}
        : {
              devServer: {
                  open: true,
                  port: 8080,
                  //   contentBase: path.join(__dirname, 'public'), //статическая папка
              },
          };

const esLintPlugin = (isDev) => (isDev ? [] : [new ESLintPlugin({ extensions: ['ts', 'js'] })]);

module.exports = ({ development }) => ({
    mode: development ? 'development' : 'production',
    // devtool: development ? 'inline-source-map' : false,
    entry: {
        main: './src/index.ts',
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'assets/[hash][ext]',
    },
    module: {
        rules: [
            {
                test: /\.[tj]s$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.s[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
        ],
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
    plugins: [
        ...esLintPlugin(development),
        new MiniCssExtractPlugin({ filename: 'index.css' }),
        new HtmlWebpackPlugin({ template: './src/index.html' }),
        new CopyPlugin({
            patterns: [
                { from: './src/assets/', to: 'assets', noErrorOnMissing: true },
                { from: './src/assets/audio', to: 'assets/audio', noErrorOnMissing: true },
                { from: './src/assets/ball', to: 'assets/ball', noErrorOnMissing: true },
                { from: './src/assets/bg', to: 'assets/bg', noErrorOnMissing: true },
                { from: './src/assets/svg', to: 'assets/svg', noErrorOnMissing: true },
                { from: './src/assets/toys', to: 'assets/toys', noErrorOnMissing: true },
                { from: './src/assets/tree', to: 'assets/tree', noErrorOnMissing: true },
                { from: './src/data', to: 'data', noErrorOnMissing: true },
            ],
        }),
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }), //каждый раз очищает папку dist
    ],
    resolve: {
        extensions: ['.ts', '.js'],
    },
    ...devServer(development),
});

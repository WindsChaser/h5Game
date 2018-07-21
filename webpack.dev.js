const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');
module.exports = {
	entry: {
		lib: ['pixi', 'p2','phaser'],
		main: ["./script/main.js"]
	},
	output: {
		path: path.resolve(__dirname, "bin"),
		filename: "[name].js"
	},
	module: {
		rules: [
			{test: pixi, loader: "expose-loader?PIXI"},
			{test: p2, loader: "expose-loader?p2"},
			{test: phaser, loader: "expose-loader?Phaser"}
		],
		noParse: /phaser-split/
	},
	devtool: 'source-map',
	mode: 'development',
	plugins: [
		new CleanWebpackPlugin(['bin']),
		new HtmlWebpackPlugin({title: 'h5Game'}),
		new webpack.optimize.SplitChunksPlugin({
			chunks: "all",
			minSize: 20000,
			minChunks: 1,
			maxAsyncRequests: 5,
			maxInitialRequests: 3,
			name: true
		}),
		new CopyWebpackPlugin([{
			from: path.resolve(__dirname, "res"),
			to: path.resolve(__dirname, "bin/res")
		}])
	],
	resolve: {
		alias: {
			'phaser': phaser,
			'pixi': pixi,
			'p2': p2
		}
	}
};
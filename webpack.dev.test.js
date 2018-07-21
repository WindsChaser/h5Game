const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');
module.exports = {
	entry: {
		main: ["./script/main.js"]
	},
	output: {
		path: path.resolve(__dirname, "bin"),
		filename: "[name].js"
	},
	module: {
		rules: [
			{test: /pixi\.js/, use: ['expose-loader?PIXI']},
			{test: /phaser-split\.js$/, use: ['expose-loader?Phaser']},
			{test: /p2\.js/, use: ['expose-loader?p2']},
			{
				test: /\.(png|svg|jpg|gif)$/, use: ['file-loader']
			},
		]
	},
	devtool: 'source-map',
	mode: 'development',
	plugins: [
		new CleanWebpackPlugin(['bin']),
		new HtmlWebpackPlugin({title: 'h5Game'}),
	],
	resolve: {
		alias: {
			'phaser': phaser,
			'pixi': pixi,
			'p2': p2
		}
	}
};
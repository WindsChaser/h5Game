const path = require('path');
module.exports = {
	entry: "./script/main.js",
	output: {
		path: path.resolve(__dirname, "bin"),
		filename: "bundle.js"
	},
	module: {},
	devtool: 'source-map',
	mode: 'development'
};
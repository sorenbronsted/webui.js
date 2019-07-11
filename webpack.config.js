const webpack = require('webpack');
const path = require('path');

const config = {
	mode: "development",
	entry: './public/src/main.js',
	output: {
		path: path.resolve(__dirname, './public/js'),
		filename: 'main.bundle.js'
		//path: path.resolve('/home/dev/gdpr/public/www/js'),
		//filename: 'webui.js'
	}
};

module.exports = config;
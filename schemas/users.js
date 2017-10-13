// 用户表结构

let mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	username: String,

	password: String,

	isAdmin: {
		type: Boolean,
		default: false
	}
});
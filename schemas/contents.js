// 文章表结构

let mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	title: String,
	// 关联字段
	cate: {
		type: mongoose.Schema.Types.ObjectId,
		// 引用
		ref: 'Cate'
	},

	description: String,
	content: String,

	// 用户 == 作者
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	// 添加时间
	addTime: {
		type: Date,
		default: new Date()
	},

	views: {
		type: Number,
		default: 0
	},

	comments: {
		type: Array,
		default: []
	}

});
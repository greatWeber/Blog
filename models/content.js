let mongoose = require('mongoose');

let contentSchema = require('../schemas/contents');

//创建一个模型。通过模型来读写表单
module.exports = mongoose.model('Content', contentSchema);
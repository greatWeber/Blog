let mongoose = require('mongoose');

let catesSchema = require('../schemas/cates');

//创建一个模型。通过模型来读写表单
module.exports = mongoose.model('Cate', catesSchema);
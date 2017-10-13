let mongoose = require('mongoose');

let usersSchema = require('../schemas/users');

//创建一个模型。通过模型来读写表单
module.exports = mongoose.model('User', usersSchema);

let express = require('express');

let router = express.Router();

// 分类模型
let Cate = require('../models/cates.js');

let Content = require('../models/content.js');

let data = {};

router.use((req,res,next)=>{
	data = {
		userInfo: req.userInfo,
		cates: [],
	};
	// 读取分类信息
	Cate.find().then((cates)=>{
		data.cates = cates;	
		next();
	});

});

router.get('/', (req,res,next)=>{
	// console.log(req.userInfo);
	// res.send('main-user');

	data.category = req.query.cate || '', //前台传过来的分类
	data.contents = [],
	data.page = Number( req.query.page || 1),
	data.limit = 2,
	data.pageNum = 0

	let where = {};

	if(data.category){
			data.cates.forEach((cate)=>{
				if(cate.catename == data.category){
					where.cate = cate._id.toString();
				}
			})
		}

	Content.count().then((count)=>{
		data.pageNum = Math.ceil(count / data.limit);

		data.page = Math.min(data.page, data.pageNum);

		data.page = Math.max(data.page, 1);

		let skipNum = (data.page-1)*data.limit;

		return Content.where(where).find().sort({_id:-1}).limit(data.limit).skip(skipNum).populate(['cate','user']);

	}).then((contents)=>{
		data.contents = contents;
		// console.log(data);
		res.render('main/index', data);
	});

});

// 详情页
router.get('/view',(req,res,next)=>{
	let id= req.query.id || '';

	Content.findOne({_id: id}).populate(['cate','user']).then((content)=>{
		data.content = content;

		content.views++;
		content.save();

		res.render('main/view',data);
	})
});

module.exports = router;

let express = require('express');

let router = express.Router();

// 用户模型
let User = require('../models/users.js');

// 分类模型
let Cate = require('../models/cates.js');

let Content = require('../models/content.js');

router.use((req,res,next)=>{
	// console.log(req.userInfo);
	if(!req.userInfo.isAdmin){
		res.send('只有管理员才能访问');
		return;
	}
	next();
});

router.get('/', (req,res,next)=>{
	// res.send('admin-user');

	res.render('admin/index', {
		userInfo: req.userInfo
	});
});

// 用户管理列表
router.get('/user', (req,res,next)=>{
	// 从数据库读取用户数据
	// limit限制获取的数据
	// skip:忽略数据的条数

	let page = Number( req.query.page || 1);
	let limit = 2;
	
	User.count().then((count)=>{
		// console.log(count);
		let pageNum = Math.ceil(count / limit);

		page = Math.min(page, pageNum);

		page = Math.max(page, 1);

		let skipNum = (page-1)*limit;
		// console.log(skipNum);

		User.find().limit(limit).skip(skipNum).then((users)=>{
			// console.log(users);
			res.render('admin/user_index', {
				userInfo: req.userInfo,
				users: users,
				page: page,
				pageNum: pageNum,
				url: 'user'
			});
		});
		
	});


	
});

// 分类管理
router.get('/cate', (req,res,next)=>{

	let page = Number( req.query.page || 1);
	let limit = 2;
	
	Cate.count().then((count)=>{
		// console.log(count);
		let pageNum = Math.ceil(count / limit);

		page = Math.min(page, pageNum);

		page = Math.max(page, 1);

		let skipNum = (page-1)*limit;
		// console.log(skipNum);

		// 1：升序; -1：降序
		Cate.find().sort({_id:-1}).limit(limit).skip(skipNum).then((cates)=>{
			// console.log(users);
			res.render('admin/cate_index', {
				userInfo: req.userInfo,
				cates: cates,
				page: page,
				pageNum: pageNum,
				url: 'cate'
			});
		});
		
	});

});

// 添加分类
router.get('/cate/add', (req,res,next)=>{
	res.render('admin/cate_add', {
		userInfo: req.userInfo
	});
});

// 保存分类
router.post('/cate/add', (req,res,next)=>{
	if(!req.body){
		res.sendStatus(400);
	}
	let cateName = req.body.cateName || '';
	let errorMes = '';
	let src = '/admin/cate/add';

	if(cateName == ''){
		errorMes = '分类名称不能为空!';
		res.render('admin/error',{
			mes: errorMes,
			src: src
		});
		return;
	}

	Cate.findOne({
		catename: cateName
	}).then((cateInfo)=>{
		if(cateInfo){
			errorMes = '分类已经存在';
			res.render('admin/error',{
				mes: errorMes,
				src: src
			});
			return Promise.reject();
		}else{
			let cate = new Cate({
				catename: cateName
			});
			return cate.save();
		}
	}).then((newInfo)=>{
		res.render('admin/success',{
			mes: "分类添加成功",
			src: "/admin/cate"
		});
	});

});

// 修改分类
router.get('/cate/edit', (req,res,next)=>{
	let id = req.query.id || '';

	Cate.findOne({
		_id: id
	}).then((cateInfo)=>{
		if(!cateInfo){
			res.render('admin/error',{
				mes: '分类信息不存在'
			});
			return;
		}else{
			res.render('admin/cate_edit',{
				cate: cateInfo
			});
		}
	});
});

// 分类的修改保存
router.post('/cate/edit',(req,res,next)=>{
	if(!req.body){
		res.sendStatus(400);
	}
	let cateName = req.body.cateName || '';
	let id = req.query.id || '';

	if(cateName == ''){
		res.render('admin/error',{
			mes: '分类名称不能为空!',
			src: '/admin/cate/add'
		});
		return;
	}

	Cate.findOne({
		_id: id
	}).then((cateInfo)=>{
		if(!cateInfo){
			res.render('admin/error',{
				mes: '分类不存在!',
				src: '/admin/cate/edit'
			});
			return Promise.reject();
		}else{
			// 当用户没有修改就提交的时候
			if(cateName == cateInfo.catename){
				res.render('admin/success',{
					mes: '修改成功!',
					src: '/admin/cate'
				});
				return Promise.reject();
			}else{
				// 修改后的名称已经存在数据库
				return Cate.findOne({
					_id: {$ne: id},
					catename: cateName
				});
			}
		}
	}).then((sameCate)=>{
		if(sameCate){
			res.render('admin/error',{
				mes: '数据库中已经存在同名的分类!',
				src: '/admin/cate/edit'
			});
			return Promise.reject();
		}else{
			return Cate.update({
				_id: id
			}, {
				catename: cateName
			});
		}
	}).then(()=>{
		res.render('admin/success',{
			mes: '修改成功!',
			src: '/admin/cate'
		});
	});
});

// 分类的删除
router.get('/cate/delete', (req,res,next)=>{
	let id = req.query.id || '';

	Cate.findOne({
		_id: id
	}).then((cateInfo)=>{
		if(!cateInfo){
			res.render('admin/error',{
				mes: '分类不存在!',
				src: '/admin/cate'
			});
			return Promise.reject();
		}else{
			Cate.remove({
				_id: id
			}).then(()=>{
				res.render('admin/success',{
					mes: '分类删除成功!',
					src: '/admin/cate'
				});
			});
		}
	});
});

// 文章管理首页
router.get('/content',(req,res,next)=>{

	let page = Number( req.query.page || 1);
	let limit = 2;
	
	Content.count().then((count)=>{
		// console.log(count);
		let pageNum = Math.ceil(count / limit);

		page = Math.min(page, pageNum);

		page = Math.max(page, 1);

		let skipNum = (page-1)*limit;
		// console.log(skipNum);

		// 1：升序; -1：降序
		// populate: 联合查询    参数: 联合字段
		Content.find().sort({_id:-1}).limit(limit).skip(skipNum).populate(['cate','user']).then((contents)=>{
			// console.log(contents);
			res.render('admin/content_index', {
				userInfo: req.userInfo,
				contents: contents,
				page: page,
				pageNum: pageNum,
				url: 'content'
			});
		});
		
	});
});

// 文章添加
router.get('/content/add',(req,res,next)=>{

	Cate.find().then((cates)=>{

		res.render('admin/content_add',{
			cates: cates
		});
		
	});

});

// 文章添加保存
router.post('/content/add', (req,res,next)=>{
	if(!req.body){
		res.sendStatus(400);
	}
	let cate = req.body.cate || '';
	let title = req.body.title || '';
	let description = req.body.description || '';
	let content = req.body.content || '';

	if(cate == ''){
		res.render('admin/error',{
			mes: '分类不能为空!',
			src: '/admin/content/add'
		});
		return;
	}
	if(title == ''){
		res.render('admin/error',{
			mes: '标题不能为空!',
			src: '/admin/content/add'
		});
		return;
	}

	if(description == ''){
		res.render('admin/error',{
			mes: '简介不能为空!',
			src: '/admin/content/add'
		});
		return;
	}

	if(content == ''){
		res.render('admin/error',{
			mes: '内容不能为空!',
			src: '/admin/content/add'
		});
		return;
	}

	let contents = new Content({
		cate: cate,
		user: req.userInfo._id.toString(),
		title: title,
		description: description,
		content: content
	});

	return contents.save().then(()=>{
			res.render('admin/success',{
				mes: '文章添加成功!',
				src: '/admin/content'
			});
		});
});

// 文章的修改
router.get('/content/edit', (req,res,next)=>{
	let id = req.query.id || '';
	Content.findOne({
		_id: id
	}).then((content)=>{
		if(!content){
			res.render('admin/error',{
				mes: '文章不存在!',
				src: '/admin/content'
			});
			return Promise.reject();
		}else{
			Cate.find().then((cates)=>{

				res.render('admin/content_edit',{
					content: content,
					cates: cates
				});
				
			});
		}
	})
});

// 文章的修改保存
router.post('/content/edit', (req,res,next)=>{
	if(!req.body){
		res.sendStatus(400);
	}
	let title = req.body.title || '';
	let id = req.query.id || '';
	let cate = req.body.cate || '';
	let description = req.body.description || '';
	let content = req.body.content || '';

	if(title == ''){
		res.render('admin/error',{
			mes: '文章标题不能为空!',
			src: '/admin/content/add'
		});
		return;
	}

	if(cate == ''){
		res.render('admin/error',{
			mes: '分类不能为空!',
			src: '/admin/content/add'
		});
		return;
	}

	if(description == ''){
		res.render('admin/error',{
			mes: '文章简介不能为空!',
			src: '/admin/content/add'
		});
		return;
	}

	if(content == ''){
		res.render('admin/error',{
			mes: '文章内容不能为空!',
			src: '/admin/content/add'
		});
		return;
	}

	Content.findOne({
		_id: id
	}).then((Info)=>{
		if(!Info){
			res.render('admin/error',{
				mes: '文章不存在!',
				src: '/admin/content/edit'
			});
			return Promise.reject();
		}else{
				Content.update({
					_id: id
				},{
					cate: cate,
					title: title,
					description: description,
					content: content
				}).then(()=>{
					res.render('admin/success',{
						mes: '修改成功!',
						src: '/admin/content'
					});
				});
		}
	});
});

// 文章的删除
router.get('/content/delete', (req,res,next)=>{
	let id = req.query.id || '';

	Content.findOne({
		_id: id
	}).then((contentInfo)=>{
		if(!contentInfo){
			res.render('admin/error',{
				mes: '文章不存在!',
				src: '/admin/content'
			});
			return Promise.reject();
		}else{
			Content.remove({
				_id: id
			}).then(()=>{
				res.render('admin/success',{
					mes: '文章删除成功!',
					src: '/admin/content'
				});
			});
		}
	});
});

module.exports = router;
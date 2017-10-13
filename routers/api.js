
let express = require('express');

let router = express.Router();

let User = require('../models/users.js');

let Content = require('../models/content.js');




// router.get('/user', (req,res,next)=>{
// 	res.send('api-user');
// });

// 统一返回格式
let responseData;

// init
router.use((req,res,next)=>{
	responseData = {
		code : 0,
		message: ''
	};

	next();
});


/**用户注册
*
*/

router.post('/user/register', (req,res,next)=>{
	if(!req.body){
		res.sendStatus(400);
	} 
	
	let username = req.body.username;
	let password = req.body.password;
	let repassword = req.body.repassword;

	if(username == ''){
		responseData.code = 1;
		responseData.message = '用户名不能为空';
		res.json(responseData);
		return;
	}

	if(password == ''){
		responseData.code = 2;
		responseData.message = '密码不能为空';
		res.json(responseData);
		return;
	}

	if(repassword != password){
		responseData.code = 3;
		responseData.message = '两次输入的密码不一致';
		res.json(responseData);
		return;
	}

	// 判断用户名是否注册
	User.findOne({
		username: username
	}).then((info)=>{
		// console.log(info);
		if(info){
			responseData.code = 4;
			responseData.message = '用户名已经被注册';
			res.json(responseData);
			return;
		}
		// 保存到数据库中
		let user = new User({
			username: username,
			password: password
		});
		return user.save();
	}).then((newInfo)=>{
		// 保存成功的回调函数
		// console.log(newInfo);
		responseData.message = '注册成功';
		res.json(responseData);
	});

	

});

// 登陆
router.post('/user/login', (req,res,next)=>{
	if(!req.body){
		res.sendStatus(400);
	} 
	
	let username = req.body.username;
	let password = req.body.password;

	if(username == ''){
		responseData.code = 1;
		responseData.message = '用户名不能为空';
		res.json(responseData);
		return;
	}

	if(password == ''){
		responseData.code = 2;
		responseData.message = '密码不能为空';
		res.json(responseData);
		return;
	}

	// 查询数据库是否存在此用户
	User.findOne({
		username: username,
		password: password
	}).then((info)=>{
		if(!info){
			responseData.code = 3;
			responseData.message = "用户名或者密码错误";
			res.json(responseData);
			return;
		}

		responseData.message = "登陆成功";
		responseData.userInfo = {
			username: info.username
		};
		// 保存用户信息
		req.cookies.set('userInfo',JSON.stringify({
			_id: info._id,
			username: info.username
		}));
		res.json(responseData);

	});

});

// 退出登陆
router.get('/user/logout', (req,res,next)=>{
	req.cookies.set('userInfo',null);
	res.json(responseData);

});

// 加载评论
router.get('/comments', (req,res,next)=>{
	let contentId = req.query.id || '';
	Content.findOne({_id: contentId}).then((content)=>{
		responseData.data = content;
		res.json(responseData);
	});
});

// 提交评论
router.post('/comments/post', (req,res,next)=>{
	let postData = {
		username: req.userInfo.username,
		time:  new Date(),
		content: req.body.comment || ''
	};

	let contentId = req.body.id || '';

	Content.findOne({_id: contentId}).then((content)=>{
		content.comments.push(postData);
		return content.save();
	}).then((contentInfo)=>{
		responseData.message = "评论成功";
		responseData.data = contentInfo;
		res.json(responseData);
	})

});

module.exports = router;
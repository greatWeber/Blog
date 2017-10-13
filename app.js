// 应用入口文件

let express = require('express');

let swig = require('swig');

//数据库模块
let mongoose = require('mongoose');

// body-parser:用来处理post过来的数据
let bodyParser = require('body-parser');

let Cookies = require('cookies');

//创建http.servers()
let app = express();

let User = require('./models/users.js');

//设置静态文件托管
app.use('/public', express.static(__dirname+'/public'));

// bodyParser设置
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// cookies设置到请求头中
app.use((req, res,next)=>{
	req.cookies = new Cookies(req,res);

	req.userInfo = {};
	// 获取到cookies
	if(req.cookies.get('userInfo')){
		try{
			req.userInfo = JSON.parse(req.cookies.get('userInfo'));

			// 判断用户是否是管理员
			User.findById(req.userInfo._id).then((userInfo)=>{
				// console.log(userInfo);
				// console.log(userInfo.isAdmin);
				req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
				next();
			});

		}catch(e){
			next();
		}
	}else{
		next();
	}
});

// 模块划分
app.use('/admin', require('./routers/admin.js')); //后台
app.use('/api', require('./routers/api.js')); //json
app.use('/', require('./routers/main.js')); //前台

// 配置模板

// 定义当前应用的模板
// 1.模板的名称，2.用于解析处理模板内容的方法
app.engine('html', swig.renderFile);

// 设置模板的位置
app.set('views', './views');

// 注册所用的模板引擎
app.set('view engine' ,'html');

// 在开发模式中，取消缓存
swig.setDefaults({cache: false});



//路由绑定

//首页
// app.get('/', (req,res,next)=>{
// 	// 输出内容
// 	// res.send();

// 	// 读取views目录下的指定文件
// 	//1.模板的文件，相对于views目录
// 	res.render('index');
// });


mongoose.connect('mongodb://localhost:27018/blog', (err)=>{
	if(err){
		console.log('数据库连接失败');
	}else{
		console.log('数据库连接成功');
		// 监听http请求
		app.listen(8888);
	}
});



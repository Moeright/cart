var express = require('express');
var router = express.Router();
// router 是专门用来配置路由的，app可以用来配置路由也可以干别的事

var User = require("../models/user");//引入user模块
var user = new User();创建一个对象

var Product = require("../models/product");//引入产品模块
var pro = new Product();//创建一个对象

/* GET home page. */
router.get('/', function(req, res, next) {

//在首页打印session
  console.log(req.session);

  //当路由里面操作比较复杂的时候，不能传入res，应该设置一个回调函数，等数据获取完成以后触发
  pro.getIndexData(function (results) {

    console.log("数据获取完成");
    console.log("商品数据：",results);

    var  data = {
      title: '网易严选',
      htmlStr:"<a href='###'>link</a>",
      logined:false,
      username:"",
      indexData:results
    };//初始化，默认未登陆

    if(req.session.user){
      //如果有用户信息说明登录过，
      data.logined = true;
      //把用户的信息传到首页
      data.username=req.session.user.username
    }
    res.render('index', data);//将传入的数据用index 来渲染

  });

});

// router.get 是get方式访问服务器
// router.post 是post方式
// router.all 包含get和post方式

/*登录页面 的路由*/
router.get('/login',function (req,res) {
  res.render('login',{});
});

router.post('/login',function (req,res) {
  // res.send("这是登录页面")
  console.log(req.body);

  user.login(req.body,res,req);
});

router.get("/reg",function (req,res) {
  res.render("reg",{"title":"注册"})
});

/*注册提交数据*/
router.post("/reg",function (req,res) {
  user.reg(req.body,res);
});
module.exports = router;

router.get("/img",function (req,res) {
  res.render("img",{"title":"注销成功"})
});

var multiparty = require('multiparty');
var fs = require('fs');
router.post('/uploadImg', function (req, res) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  var form = new multiparty.Form({uploadDir: './public/images/files'});

  form.parse(req, function(err, fields, files) {
    var filesTmp = JSON.stringify(files);
    console.log(fields)
    console.log(files)
    if(err){
      console.log('parse error: ' + err);
    } else {
      testJson = eval("(" + filesTmp+ ")");
      console.log(testJson.roompic[0].path);
      res.send(JSON.stringify({"imgSrc":testJson.roompic[0].path}))
      console.log('rename ok');
    }
  });
});



router.get('/product/getList', function(req, res, next) {
  // 输出 =>渲染 index.ejs  =>传递数据{title:'Express'}
  res.setHeader("Access-Control-Allow-Origin", "*");// 允许跨域
  pro.getList(req.query,function (results) {

    res.send(JSON.stringify(results));

  });//通过商品数据模块获取首页数据

});



router.get('/product/addPro', function(req, res, next) {
  // 输出 =>渲染 index.ejs  =>传递数据{title:'Express'}
  res.setHeader("Access-Control-Allow-Origin", "*");// 允许跨域
  console.log(req.query)
  pro.addPro(req.query,function (results) {

    res.send(JSON.stringify(results));

  });//通过商品数据模块获取首页数据


});

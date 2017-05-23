
var express = require('express');
var router = express.Router();
var Cart = require("../models/cart");
var cart = new Cart();
/* GET users listing. */
router.get('/', function(req, res, next) {

// 如果存在session  即登陆了，渲染购物车的数据
    if(req.session.user){
        //ÓÃ»§µÇÂ¼
        var uid = req.session.user.uid;
        cart.getData(uid,function (results) {
            //»ñÈ¡Êý¾Ý³É¹¦ÒÔºó£¬äÖÈ¾Ò³Ãæf
            console.log("¹ºÎï³µÊý¾Ý:", results);

            res.render("cart",{cartData:results,logined:true})
        })
    }else {
        //ÓÃ»§Ã»ÓÐµÇÂ¼
        res.render("cart",{cartData:[],logined:false})
    }

});

/*cart/add*/
router.get("/add",function (req,res) {

    //如果登陆了，获取用户的uid,pid
    if(req.session.user){
        var uid =req.session.user.uid;
        var pid =req.query.pid;
        console.log(req.query);

      // 找到对应的添加进去
        cart.addCart({uid:uid, pid:pid},function (err) {
            if(!err){
                res.send("Ìí¼Ó³É¹¦")
            }else {
                throw  err
            }
        })

    }else {
        res.send("Ìí¼ÓÊ§°Ü£¬ÇëÏÈµÇÂ¼")
    }


});

/*cart/add*/删除购物车的东西
router.get("/del",function (req,res) {

    //¿´¿´ÓÐÃ»ÓÐµÇÂ¼
    if(req.session.user){

        var cartid =req.query.cartid;
        console.log(req.query); //»ñÈ¡get·½Ê½µÄ²ÎÊý

        //Í¨¹ýcartÊý¾ÝÄ£¿éÈ¥Ìí¼ÓÊý¾Ý
        cart.del({cartid:cartid},function (err) {
            if(!err){
                res.send("É¾³ý³É¹¦")
            }else {
                throw  err
            }
        })

    }else {
        res.send("É¾³ýÊ§°Ü£¬ÇëÏÈµÇÂ¼")
    }


});


module.exports = router;

//Ìí¼Ó¹ºÎï³µ
//1¡¢ÔÚappÀïÃæÉèÖÃÂ·ÓÉ
//2¡¢mvcÂú×ã

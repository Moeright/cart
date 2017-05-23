var pool = require("./pool");
function User() {
};
User.prototype.login=function (params,res,req) {
  pool.getConnection(function (err,connection) {
    if (err)   throw err;
    connection.query("select * from user where username='"+params.username+"'",function (err,results) {
      if (err) throw err;
      console.log(results);
      if (results.length) {
        if (results[0].password==params.password) {
          req.session.user = results[0];
          res.redirect(301,'/');
          // res.send("密码一致，登录成功");
        }else {
          res.send("密码不正确");
        }
      }else {
        res.send("用户名不存在");
      }
      connection.release();
    })
  });
};


User.prototype.reg = function (params,res) {
  pool.getConnection(function (err,connection) {
    if (err) throw err;
    connection.query("select * from user where username='"+params.username+"'",function (err,results) {
      if(err) throw  err;
      if(results.length){
        res.send("用户名已被注册");
        connection.release();
      }else {
        var sqlStr = "insert into user(username,password) values('"+params.username+"','"+params.password+"')";
        connection.query(sqlStr,function (err) {
          if(err) throw err;
          res.render("reg-success");
          // res.send("注册成功")
          connection.release()
        })

      }
    })
  })
};

module.exports = User;

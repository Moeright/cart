/**
 * Created by hasee on 2017/5/17.
 */

var pool = require("./pool");


function Product() {
    
}
Product.prototype.getIndexData=function (callback) {

    //1\获取连接
    pool.getConnection(function (err,connection) {
        if(err) throw err;

        //数据库查询
        connection.query("select * from product",function (err,results) {
            if(err) throw err;
            //console.log(results);
            //数据获取完成以后，调用回调函数，传人获取的参数
            callback(results);
            //释放连接
            connection.release()

        })
        
    })
    
};


Product.prototype.getList=function (params,callback) {
    //params 要获取商品的参数（可能包含商品的分类，页码...）
    //callback 数据请求成功以后的回调函数
    //获取数据库链接
    console.log(params)
    var pageNum = params.pageNum||0; //页码
    var linenumber = params.linenumber||6;


    pool.getConnection(function (err,connection) {

        /*1、先获取商品的总数，
         * 2、获取当前页码对应的数据，
         * 3、把总数total和页码对应的数据放在obj里面传递给callback
         * */

        connection.query("select count(*) as total from product",function (err,results) {
            if(!err){
                //数据请求成功，调用回调函数，传人查询结果
                console.log(results[0].total);
                var totalNum =results[0].total; //商品的总数量
                //通过页码来控制查询的内容
                connection.query("select * from product  limit "+(linenumber*pageNum)+","+linenumber,function (err,results) {
                    console.log(results)
                    if(!err){
                        //数据请求成功，调用回调函数，传人查询结果[1,2,2,3,4]
                        //把总数量和，当前页码的数据，放在一个对象里面
                        var obj = {
                            totalNum:totalNum,
                            resultsArr:results
                        };
                        callback(obj)
                    }
                    connection.release()
                })
            }
        })
        //查找商品
    })
};
Product.prototype.addPro=function (params,callback) {
    pool.getConnection(function (err,connection) {
        if(err) throw err;
        var sqlStr = "insert into product(pname,classid,price,totalnumber,imgurl,unit) values('"+params.pname+"','"+params.classid+"','"+params.price+"','"+params.totalnumber+"','"+params.imgUrl+"','"+params.unit+"')"


        connection.query(sqlStr,function (err,results) {
            if(err) throw err;
            console.log(results);
            //获取到数据以后调用回调函数，并传递数据
            callback(results)
            //释放连接
            connection.release();
        })
    })
};



module.exports= Product;


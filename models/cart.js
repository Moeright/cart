
var pool = require('./pool');
function Cart() {
}
Cart.prototype.getData=function (uid,callback) {

    //1\��ȡ����
    pool.getConnection(function (err,connection) {
        if(err) throw err;
        //��ô�����û�id��ѯ��

        var sqlStr1 = "select * from cart where uid=2";
        //����������ѯ
        var sqlStr2 = "select * from cart,product where cart.uid=2 and cart.pid=product.pid";
        var sqlStr3 = "select * from cart join product on cart.uid="+uid+" and cart.pid=product.pid";
        connection.query(sqlStr3,function (err,results) {
            //����ģ�飬���Լ�����Ӧ�����ûص�����
            callback(results);


            connection.release()

        })

    })

};

Cart.prototype.addCart=function (params,callback) {
    var uid = params.uid;
    var pid = params.pid;
    //1\��ȡ����
    pool.getConnection(function (err,connection) {
        if(err) throw err;
        //1���Ȳ飬������û�����ӹ���ǰ����Ʒ��
        //2�����ӹ�=>��֮ǰ��������+1
        //3��û�����ӹ�=>����



        //1��������û�����ӹ�
        var sql1 = "select * from cart where pid="+pid+" and uid="+uid;
        console.log(sql1);
        connection.query(sql1,function (err,results) {
            //[{cid��1,pid:2,numer:2}]
            if(results.length){
                //2�����ӹ�
                //��ȡ������������Ȼ��+1
                var number = results[0].number+1;
                //��
                var sqlStr2 = "update cart set number="+number+" where pid="+pid+" and uid="+uid;
                connection.query(sqlStr2,function (err) {
                    //�ĳɹ��Ժ����ûص�����
                    callback(err);
                    //�ͷ�����
                    connection.release()

                })

            }else {

                //3û�����ӹ�
                /*����*/
                var sqlStr3 = "insert into cart(uid,pid,number) values("+params.uid+","+params.pid+",1)";

                connection.query(sqlStr3,function (err) {
                    //����ģ�飬���Լ�����Ӧ�����ûص�����
                    callback(err);

                    connection.release()

                })
            }

        })
    })

};
Cart.prototype.del=function (params,callback) {

    //1\��ȡ����
    pool.getConnection(function (err,connection) {
        if(err) throw err;
        //��ô�����û�id��ѯ��

        connection.query("delete from cart where cartid="+params.cartid,function (err) {
            //����ģ�飬���Լ�����Ӧ�����ûص�����
            callback(err);

            connection.release()

        })

    })

};

module.exports=Cart;

const conn=require('../../config/databse');
function packController()
{
    return{
        
        standard:function(req,res){
            const value=req.body.standard;
            let sqlQuery=`update users set subscriptionType='${value}' where id=?`;
            conn.query(sqlQuery,[res.locals.CurrentUser.id],(err,result)=>{
                if (err) throw err;
                console.log(result);
                res.send('upgraded to standard pack');
            })
        },
        premium:function(req,res){
            const value=req.body.premium;
            let sqlQuery=`update users set subscriptionType='${value}' where id=?`;
            conn.query(sqlQuery,[res.locals.CurrentUser.id],(err,result)=>{
                if (err) throw err;
                console.log(result);
                res.send('upgraded to premium pack');
            })
        }
    }
    
}

module.exports=packController;
const conn=require('../../config/databse');
function dashboardController()
{
    return{
        index:function(req,res){

            let sql='select * from musicdata';
            conn.query(sql,(err,result)=>{
                if (err) throw err;
                let musicdata=result;
                res.render('dashboard',{title:"Welcome to the World of Music",musicdata:musicdata});
            })
            
        }
    }
     
}

module.exports=dashboardController;
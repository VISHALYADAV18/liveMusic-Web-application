const conn=require('../../config/databse');
function myMusicController()
{
    return{
        index:function(req,res){
            let sqlQuery='select * from uploads where user_id = ?';
            conn.query(sqlQuery,[res.locals.CurrentUser.id],(err,result)=>{
                if (err) throw err;
                if (result.length > 0)
                {
                    res.render('myMusic',{title:"My collection",songs:result});
                }
                else
                {   
                    res.render('myMusic',{title:"My collection",songs:false});
                }
            })
            
        }
    }
     
}

module.exports=myMusicController;
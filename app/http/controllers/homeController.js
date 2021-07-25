function homeController()
{
    return{
        
        index:function(req,res){
            res.render('home',{title:"MUSIC WORLD"});
        }
    }
    
}

module.exports=homeController;
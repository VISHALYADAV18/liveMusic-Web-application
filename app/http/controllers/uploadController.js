const multer=require('multer');
const path=require('path');
const fs= require('fs');
const rootpath=require('../../../server');
const conn=require('../../config/databse');
const storage=multer.diskStorage({
    destination:rootpath+'/Uploads/',
    filename:function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
    }
})

const upload=multer({
    storage:storage,
    fileFilter:function(req,file,cb){
        checkFileType(file,cb)
    }
}).single('uploadSong');
function checkFileType(file,cb){
    if(file.mimetype === 'audio/mpeg')
    {
        return cb(null,true);
    }
    else
    {
        cb('Ooops file format doesn\'t match :(',false);
    }
}

function uploadMusic(req,res,conn)
{
    req.flash('error','File uploaded successfully!!! :)');
    let name=res.locals.CurrentUser.username;
    let id=res.locals.CurrentUser.id;
    let sqlQuery='INSERT INTO uploads values (NULL,?,?,?)'
    conn.query(sqlQuery,[name,req.file.filename,id],(err,results)=>{
        if (err) throw err;
            return res.redirect('/upload');
    })
}

function uploadController()
{
    return{
        
        index:function(req,res){
            let sqlQuery='select * from uploads';
            conn.query(sqlQuery,(err,result)=>{
                if (err) throw err;
                if (result.length > 0)
                {
                    res.render('upload',{title:"upload your music with us..",songs:result});
                }
                else
                {   
                    res.render('upload',{title:"upload your music with us..",songs:result});
                }
            })
           
        },
        
        postUpload:function(req,res){

            upload(req,res,(err)=>{ 
                if(err)
                {
                    req.flash('error',err);
                    return res.redirect('/upload');
                }
                else
                {
                    if(req.file == undefined)
                    {
                        req.flash('error','Oops you haven\'t choosen anything yet now');
                        return res.redirect('/upload');
                    }
                    else
                    {
                        let sqlQuery1="select subscriptionType from users where id=?"
                        conn.query(sqlQuery1,[res.locals.CurrentUser.id],(err,result)=>{
                            if(err) throw err;
                            let subscriptionType=(result[0].subscriptionType);
                            let sqlQuery="select count(publisher) from uploads where user_id=?";
                            conn.query(sqlQuery,[res.locals.CurrentUser.id],(err,results)=>{
                                if (err) throw err;
                                let currentCount=results[0]['count(publisher)'];
                                if(subscriptionType === 'basic')
                                {
                                    if(currentCount >= process.env.basic)
                                    {
                                        req.flash('error','Oops you have exceeded the limit of uploading :(');
                                        return res.redirect('/upload');  
                                    }
                                    else
                                    {
                                        uploadMusic(req,res,conn);
                                    }
                                }
                                if(subscriptionType === 'standard')
                                {
                                    if(currentCount >= process.env.standard)
                                    {
                                        req.flash('error','Oops you have exceeded the limit of uploading :(');
                                        return res.redirect('/upload');  
                                    }
                                    else
                                    {
                                        uploadMusic(req,res,conn);
                                    }
                                }
                                if(subscriptionType === 'premium')
                                {
                                    uploadMusic(req,res,conn);
                                }


                            });

                        })
                    }
                }
            });
        }
    }
    
}

module.exports=uploadController;
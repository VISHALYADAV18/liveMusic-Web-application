let fs=require('fs');
const homeController=require('../app/http/controllers/homeController')();
const authController=require('../app/http/controllers/authController')();
const dashboardController=require('../app/http/controllers/dashboardController')();
const {authenticate}=require('../app/http/middlewares/authenticate');
const conn = require('../app/config/databse');
const jwt = require('jsonwebtoken');
const restPswdController=require('../app/http/controllers/restPswdController')();
const uploadController=require('../app/http/controllers/uploadController')();
const myMusicController=require('../app/http/controllers/myMusicController')();
const getMusicFileController=require('../app/http/controllers/getMusicFileController')();
const packController=require('../app/http/controllers/packController')();

function allWebRoutes(app)
{

    app.get('/',homeController.index);
    app.get('/login',authController.login);
    app.get('/register',authController.register);
    app.get('/logout',authController.logout);
    app.get('/mymusic',authenticate,myMusicController.index);
    app.get('/getUploads/:songName',getMusicFileController.getUploads);
    app.get('/dashboard',authenticate,dashboardController.index);
    app.get('/upload',authenticate,uploadController.index);
    app.post('/postUpload',uploadController.postUpload);
    app.get('/forgotPassword',restPswdController.index);
    app.post('/register',authController.postRegister);
    app.post('/login',authController.checkLogin);
    app.post('/forgotPassword',restPswdController.postforgotpswd);
    app.post('/premiumPack',authenticate,packController.premium);
    app.post('/standardPack',authenticate,packController.standard);

    app.get('/resetpassword/:id/:token',(req,res)=>{
        var id=req.params.id;
        conn.query('select * from users where id=?',[id],(err,results)=>{
            if (err) throw err;
            if(results.length>0)
            {
                let user=results[0];
                jwt.verify(req.params.token,user.password,(err,decoded)=>{
                    if(err)
                    {
                        res.status(500).json({msg:'invalid link or link is expired'});
                    }
                    else
                    {
                        res.send('<form action="/resetpassword" method="POST">' +
                        '<input type="hidden" name="id" value="' + user.id + '" />' +
                        '<input type="hidden" name="token" value="' + req.params.token + '" />' +
                        '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
                        '<input type="submit" value="Reset Password" />' +
                        '</form>');
                    }
                })
            }
        })
    });
    app.post('/resetpassword',restPswdController.postresetPswd);

    app.use((req,res)=> {
        res.status(404).render('error404',{title:"Page not Found"});
     });


     

}

module.exports=allWebRoutes;
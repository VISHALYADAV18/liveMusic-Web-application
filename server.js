//For creating web application in faster way
const express=require('express');
const app=express();
const ejs=require('ejs');
const expressLayout=require('express-ejs-layouts');
const flash=require('express-flash');
const session=require('express-session');
const bodyParser=require('body-parser');
const conn=require('./app/config/databse');
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const morgan=require('morgan')
//PORT used in case of deployment/production purpose
const PORT=process.env.PORT || 3300;


// app.use(morgan("dev"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//configuration for session
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    saveUninitialized:false,
}));
app.use(flash());
app.use(cookieParser());
const f1=async(decodedToken,res,next,restrictedPath=false)=>{
    let sqlQuery="SELECT username,id from users where id=?";
    conn.query(sqlQuery,[decodedToken.id],(err,fields)=>{
            if (err) throw err;
            var CurrentUser= fields[0];
            res.locals.CurrentUser=CurrentUser;
            if (restrictedPath) return res.redirect('/');
            next();
            });
    }
//global middleware
app.use((req,res,next)=>{
    const token=req.cookies.jwt;
    if(token)
    {
        jwt.verify(token,'ThisIsMyJWTSecretCode',async(err,decodedToken)=>
        {
            if (err)
            {
                console.log(err.message);
                res.locals.CurrentUser=null;
                next();
            }
            else
            {
                if(req.path == '/login' || req.path == '/register' || req.path =='/forgotPassword') await f1(decodedToken,res,next,restrictedPath=true);
                await f1(decodedToken,res,next);

            }
        })  
    }
    else
    {
        res.locals.CurrentUser=null;
        next();
    }

});


//assets or static files..
app.use(express.static('public'));
app.use(expressLayout); 
app.set("layout password/emailSent",false);
// set the view engine to ejs
app.set('view engine', 'ejs');


var basedir=__dirname;
module.exports=basedir;
 
//All routes
require('./routes/web')(app);


//database connection 
conn.connect((err)=>{
    if (err) throw err;
    console.log("Database connected successfully");
});







//listening to specific port
app.listen(PORT,()=>{
    console.log(`server listening on ${PORT}`);
})
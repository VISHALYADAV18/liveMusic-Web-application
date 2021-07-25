const conn=require('../../config/databse');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
let hashPassword;
const createToken=async (id,username)=>{
    try {
        return jwt.sign({id,username},'ThisIsMyJWTSecretCode',{expiresIn:24*60*60*1000});
    } catch (error) {
        console.log(error);
    }
}
function authController()
{
    return{
        login:function(req,res)
        {
            res.render('auth/login',{title:"LOGIN PAGE"});
        },

        register:function(req,res)
        {
            res.render('auth/register',{title:"REGISTER PAGE"});
        },

        postRegister:function(req,res)
        {
            const { name,email,password,ConfirmPswd } =req.body;
            //validation error..
            if(!name || !email || !password || !ConfirmPswd)
            {
                req.flash('error','All fields are required');
                return res.redirect('/register');
            }
            if(name.length < 3)
            {
                req.flash('error','name is too short,atleast 3 characters');
                req.flash('name',name);
                req.flash('email',email);
                return res.redirect('/register');
            }

            //validating for email
            if(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
            {
                let sqlQuery="SELECT * from users where email=?";   
                conn.query(sqlQuery,[email],(err,results)=>{
                    if (results.length > 0)
                    {
                        req.flash('error','Email is already in use');
                        req.flash('name',name);
                        return res.redirect('/register');
                    }
                    else
                    {
                        if(password.length < 6)
                        {
                            req.flash('error','password too short,atleast 6 letters');
                            req.flash('name',name);
                            req.flash('email',email);
                            return res.redirect('/register');
                        }
                        if(password !== ConfirmPswd)
                        {
                            req.flash('error','password doesn\'t match');
                            req.flash('name',name);
                            req.flash('email',email);
                            return res.redirect('/register');
                        }
                        else
                        {
                            
                            bcrypt.genSalt(10,(err,salt)=>{
                                bcrypt.hash(password,salt,(err,hash)=>{
                                    hashPassword=hash;
                                    conn.query('INSERT INTO users values (NULL,?,?,?,DEFAULT)',[name,email,hashPassword],(err,result)=>{
                                        if (err) throw err;
                                        return res.redirect('/login');
                                    });
                                });
                            }); 
                        }            
                    }

                });
            }
            else
            
            {
                req.flash('error','Please check your email address');
                req.flash('name',name);
                req.flash('email',email);
                return res.redirect('/register');
            }


        },

        checkLogin:function(req,res)
        {
            
            try {                
                //authentication work.....
                const { email,password } =req.body;
                if(!email || !password)
                {
                    req.flash('error','Please enter your details');
                    return res.redirect('/login');
                }
                let sqlQuery="SELECT * from users where email=?";
                conn.query(sqlQuery,[email],async (err,fields)=>{
                       try {
                        if (err) throw err;
                        if(fields.length>0)
                            {
                                const dbpassword=fields[0].password;
                                const isMatch=await bcrypt.compare(password,dbpassword);
                                if(isMatch)
                                {
                                    const id=fields[0].id;
                                    const username=fields[0].username;
                                    const token=await createToken(id,username); 
                                    res.cookie('jwt',token,{maxAge:24*60*60*1000,httpOnly:true});
                                    return res.redirect('/'); 
                                }
                                else
                                {
                                    req.flash('error','Incorrect Password !!!!');
                                    return res.redirect('/login');
                                }

                            }
                        else
                            {
                                req.flash('error','Oops this email doesn\'t exist :(');
                                return res.redirect('/login');
                            }  
                       } catch (error) {
                           console.log(error);
                       }
                });
            }
             catch (error) {
               console.log(error);
            }
        },

        logout:function(req,res){
            res.cookie('jwt','',{maxAge:0});
            res.redirect('/');
        },

    }
}




module.exports=authController;
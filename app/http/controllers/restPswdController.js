const conn = require("../../config/databse");
const nodemailer =require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
const transporter=require('../../config/email');

const usePasswordHashToMakeToken = (obj) => {
    const secret = obj.password;
    const token = jwt.sign({ id:obj.id }, secret, {
      expiresIn: 2*60 // 1 hour
    })
    return token
  }

  
const getPasswordResetURL = (userObj,token) => {

    return `http://localhost:3300/resetpassword/${userObj.id}/${token}`;
  }  
function restPswdController()
{
    return{
        
        index:function(req,res){
            res.render('password/restPswd',{title:"Forgot password"});
        },
        postforgotpswd:async function(req,res){
            const resetemail =req.body.resetemail;
            try {
                if(!resetemail)
                {
                    req.flash('error','please enter your email address');
                    return res.redirect('/forgotPassword');
                }
                let sqlQuery="SELECT * from users where email=?";
                conn.query(sqlQuery,[resetemail],async (err,fields)=>{
                    if (err) throw err;
                    if(fields.length>0)
                        {
                            let user=fields[0];
                            const resettoken = usePasswordHashToMakeToken(user);
                            const URL=getPasswordResetURL(user, resettoken);
                                    var mainOptions = {
                                        from: process.env.USER_MAIL,
                                        to: user.email,
                                        subject: 'Reset your liveMusic account password',
                                        html: `<div style="text-align:center;">
                                                    <h1>liveMusic</h1>
                                                    <h3>PASSWORD RESET REQUEST</h3>
                                                    <p>DEAR,<b>${user.username}</b></p>
                                                <p>
                                                We have received your request to reset your password.Please click the link below to complete the reset instructions. 
                                                </p>
                                                <a href="${URL}" target="_blank" rel="noopener noreferrer">RESET MY PASSWORD</a>
                                                <br><br>
                                                Cheers,<br>
                                                The liveMusic Team
                                                <br><br><br><br>
                                                <p>
                                                    This email was sent to ${user.email},<br>
                                                    which is associated with the liveMusic account.
                                                </p>

                                            
                                                </div>`
                                    };
                                    transporter.sendMail(mainOptions, function (err, info) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            res.render('password/emailSent',{layout:'password/emailSent',emailadds:user.email,title:'Email sent!!!!'})
                                        } 
                                    });
                                
                            

                            // res.status(200).json({msg:URL});
                            // res.send('<a href=`${URL}`>Reset Password</a>')
                            
                        }
                        else
                        {
                            req.flash('error','We don\'t have an account for that email.');
                            return res.redirect('/forgotPassword');
                        }
                    });
            } catch (error) {
                console.log(error);
            }
  
        }
        ,
        postresetPswd:function(req,res){
          let id=req.body.id;
          conn.query('select * from users where id=?',[id],(err,results)=>{
            if (err) throw err;
            if (results.length>0)
            {
                let user=results[0];
                jwt.verify(req.body.token,user.password,(err,decoded)=>{
                    if(err)
                    {
                        res.status(500).json({msg:'invalid link or link is expired'})
                    }
                    else
                    {
                        bcrypt.genSalt(10,(err,salt)=>{
                            bcrypt.hash(req.body.password,salt,(err,hash)=>{
                                hashPassword=hash;
                                conn.query('UPDATE users SET password = ? WHERE id = ?',[hashPassword,id],(err,result)=>{
                                    if (err) throw err;
                                    return res.redirect('/login');
                                });
                            });
                        });

                    }
                })
            }
          });

        }

    }   
}

module.exports=restPswdController;
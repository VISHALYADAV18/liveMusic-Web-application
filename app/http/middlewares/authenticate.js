const jwt=require('jsonwebtoken');
const conn=('../../config/databse.js');
const authenticate=(req,res,next)=>{
    const token=req.cookies.jwt;
    if(token)
    {
        jwt.verify(token,'ThisIsMyJWTSecretCode',(err,decodedToken)=>
        {
            if (err)
            {
                console.log(err.message);
                return res.redirect('/login');
            }
            else
            {
                // console.log(decodedToken);
                next();
            }
        });
    }
    else
    {
        return res.redirect('/login');
    }
}



module.exports ={authenticate};
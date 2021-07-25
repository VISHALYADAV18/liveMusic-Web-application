require('dotenv').config();
const mysql=require('mysql');
const dotenv=require('dotenv');



const conn=mysql.createConnection({
    host:process.env.DBHost,
    user:process.env.DBUser,
    password:process.env.DBPassword,
    database:process.env.DATABASE,
});


module.exports=conn;
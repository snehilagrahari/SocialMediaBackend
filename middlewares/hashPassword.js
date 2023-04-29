const bcrypt = require('bcrypt')

require('dotenv').config()

const hashPassword = async (req,res,next)=>{
    try{
        const {password} = req.body;
        const encrypted = bcrypt.hash(password,process.env.SALT_ROUNDS);
        req.body.password = encrypted;
        next();
    }
    catch(err){
        res.send({message : err.message})
    }
}

module.exports = {
    hashPassword
}
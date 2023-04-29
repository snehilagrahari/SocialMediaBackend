const jwt = require('jsonwebtoken')

require('dotenv').config()

const verifyUserToken = async (req,res,next)=>{
    try{
        const token = req.headers.authorization;
        const userId = jwt.verify(token,process.env.JWT_SECRET);
        req.body.userId = userId;
        next();
    }
    catch(err){
        res.send({message : err.message});
    }
}

module.exports = {
    verifyUserToken
}
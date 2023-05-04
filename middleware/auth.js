const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.authenticate = async (req,res,next) => {
    try{
        const token = req.header('Authorization'); 
        const decryptToken = jwt.verify(token, process.env.SECRET_TOKEN);
        const user = await User.findByPk(decryptToken.userId);
        req.user = user;
        next();
    }catch(err){
        console.log("ERR Authentication",err);
        return res.status(404).json({success:false, message:'User not found'})
    } 
}
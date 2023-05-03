const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const sequelize = require('../utility/database');

exports.postSignup = async(req,res)=>{
    const t = await sequelize.transaction();
    try{
        const { name, phone, email, password } = req.body;
        const user = await User.findOne({ where: { email: email }});
        if(!user){
            bcrypt.hash(password, 10, async(err, hash) =>{
                if(err){
                    await t.rollback();
                    console.log('err in hash')
                }
                const userData = User.create({
                    name: name,
                    phone: phone,
                    email: email,
                    password: hash
                })
                console.log('userData is ',userData)
                await t.commit();
                return res.status(201).json({ userData: userData, message: 'User signup successful' });
            })
        }else{
            res.json({ message: 'User already exists' });
        }
    }catch(err){
        await t.rollback();
        res.status(500).json({success: false, error: err});
        throw new Error(err)
    }
}
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const sequelize = require('../utility/database');
const jwt = require('jsonwebtoken');
const {Op} = require('sequelize');


exports.postSignup = async(req,res)=>{
    const t = await sequelize.transaction();
    try{
        const { name, phone, email, password } = req.body;
        const user = await User.findOne({ where:{ [Op.or]: [{ email: email }, { phone: phone }] } });
        if(!user){
            bcrypt.hash(password, 10, async(err, hash) =>{
                if(err){
                    await t.rollback();
                    console.log('err in hash')
                }
                const userData = await User.create({
                    name: name,
                    phone: phone,
                    email: email,
                    password: hash
                },{transaction :t})
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

function generateToken(id, name){
    return jwt.sign({userId:id,userName:name},process.env.SECRET_TOKEN)
}

exports.postLogin = async (req,res) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({ where: {email: email} } );
        if(user){
            bcrypt.compare(password, user.password , (err, resp)=>{
                if(err){
                    throw new Error('Something went wrong (BCRYPT_COMPARE)',err)
                }
                if(resp === true){
                    res.status(201).json({message:'User login successful', token: generateToken(user.id, user.name)});
                }
                else{
                    res.status(401).json({success: false, message: 'Incorrect Password!Please try again'});
                }
            })
        }else{
            res.status(404).json({success:false, message: 'User not found'})
        }

    }catch(err){
        res.status(500).json({success:false, error:err})
        throw new Error('ERR POST_LOGIN',err)
    }
}
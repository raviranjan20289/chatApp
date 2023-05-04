const sequelize = require('../utility/database');
const Chat = require('../models/chat');
const {Op} = require('sequelize');

exports.postSendMessage = async (req,res) => {
    const t = await sequelize.transaction();
    try{
        const message = req.body.message;
        const user = await req.user;
        const data = await req.user.createChat({
            message: message,
            username: user.name
        },{transaction: t});
        await t.commit();
        res.status(201).json({success:true, chatData: data})
    }catch(err){
        await t.rollback();
         res.status(500).json({success:false, message:'ERR POSTSENDMSG', error:err})
         throw new Error(err)
    }
}

exports.getChats = async (req,res) => {
    try{
        let lastMessageId = req.query.lastMessageId;
        if(!lastMessageId){
            lastMessageId = -1;
        }
        const chats = await Chat.findAll({
            where: {
                id: {
                    [Op.gt]: lastMessageId
                }
            }
        })
        res.status(201).json({success:true, chatData: chats});
    }catch(err){
        return res.status(500).json({success: false, error: err})
    }
}
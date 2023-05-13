const sequelize = require('../utility/database');
const Chat = require('../models/chat');
const Member = require('../models/groupMembersModel');
const {Op} = require('sequelize');

exports.postSendMessage = async (req,res) => {
    const t = await sequelize.transaction();
    try{
        const message = req.body.message;
        const groupId = req.body.groupId;
        console.log("GRPID",groupId)
        console.log(groupId)
        const user = await req.user;
        const data = await req.user.createChat({
            message: message,
            username: user.name,
            groupId: groupId
        },{transaction: t});
        await t.commit();
        res.status(201).json({success:true, chatData: data})
    }catch(err){
        await t.rollback();
         res.status(500).json({success:false, message:'ERR POSTSENDMSG', error:err})
         console.log(err)
         throw new Error(err)
    }
}

exports.getChats = async (req,res) => {
    try{
        const user =await req.user;
        const getChat= JSON.parse(req.query.getChat);
        // const recieverId = getChat.JSON.parse(recieverId)
        console.log("this is GEtCHat",getChat)
        console.log( getChat.groupId)
        
        
        let lastMessageId =req.query.lastMessageIds;
        // console.log('thisone',lastMessageId)
        if(!lastMessageId){    
            lastMessageId = -1;
        }
        
        console.log(">>>",lastMessageId)
        if(getChat){
            console.log(">>>>>>>ahjks")
            let isAdmin=false;
            const member = await Member.findOne({where: {userId: user.id,groupId: getChat.groupId}})
            if(member){
                isAdmin=member.isAdmin;
            }
            
            const chats = await Chat.findAll({
                where:   {
                    id: {
                      [Op.gt]: lastMessageId,
                    },               
                     groupId: getChat.groupId
                    
                }
            })           
            return res.status(201).json({success:true, chatData: chats,isAdmin: isAdmin});
        }
        return res.status(201).json({success:true, chatData: []});
    }catch(err){
        console.log(err)
        return res.status(500).json({success: false, error: err})
    }
}
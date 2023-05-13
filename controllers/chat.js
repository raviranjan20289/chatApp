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

exports.getMessages=async(req,res,next)=>{
    try{
        const lastmsgId=+req.query.lastmsgId||0;
        const groupId=+req.query.groupId;
        console.log(lastmsgId);
        const  messages = await Chat.findAll({
           where:{groupId:groupId},
           offset:lastmsgId,
           limit:10
        });
             res.status(200).json({message:messages,success:true})
    }catch(err){
        console.log(">>>>>>>>>>>>>>>",err);
        res.status(500).json({message:"Something went Wrong",success:false})
    }
    }
    
    
    function uploadToS3(file){
    
        const BUCKET_NAME= process.env.AWS_BUCKET_NAME;;
        const IAM_USER_KEY= process.env.AWS_KEY_ID;
        const  IAM_USER_SECRET= process.env.AWS_SECRET_KEY;
    
        let s3bucket=new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey:IAM_USER_SECRET,
        })
         var params={
                Bucket:BUCKET_NAME,
                Key:file.name,
                Body:file.data,
                ContentType:file.mimetype,
                ACL:'public-read'
            }
           return new Promise((resolve, reject) => {
                s3bucket.upload(params,(err,s3response)=>{
                    if(err){
                        console.log("SOMETHING WENT WRONG",err)
                        reject(err);
                    } 
                    else{
                        resolve(s3response.Location)
                        }
                    })
           })      
    
    
    }
    exports.uploadFile=async(req,res,next)=>{
        try{
            const groupId=req.params.groupId;
    
            console.log(">>>>>>>",req.files.file);
            const file=req.files.file;
            const fileName=file.name;
            const fileURL= await uploadToS3(file);
            console.log(fileURL);
            const user = await req.user.createChat({username:req.user.username,message:fileURL,groupId:groupId});
            res.status(200).json({message:user,success:true})
            
            
        }catch(err){
            console.log(">>>>>>>>>>>>>>>",err);
            res.status(500).json({message:"Something went Wrong",error:err,success:false})
        }
    }
const Member = require('../models/groupMembersModel');
const Group = require('../models/groupModel');
const User = require('../models/userModel');
const sequelize = require('../utility/database');
const {Op} = require('sequelize');

exports.getGroups = async (req,res) =>{
    try{
        const user = await req.user;
        const members = await Member.findAll({where: {userId: user.id}})
        const users = await User.findAll( {where: {
                id: {
                    [Op.ne]: user.id 
                }
            }
          });

        res.status(201).json({success: true, users: users, groups: members, thisUser:user})
    }catch(err){
        res.status(500).json({success:false, error: err})
        console.log("ERROR",err)
        throw new Error('ERR GRP CNTRL GETGRP',err)
    }
}

exports.addGroup = async (req,res) =>{
    const t = await sequelize.transaction();
    try{

        const groupName = req.body.groupName;
        const user = await req.user;
        const group = await user.createGroup({
            groupName: groupName,
        },{transaction: t});
        console.log(group)
        const addMember = await group.createMember({
            groupName: groupName,
            userName: user.name,
            userId: group.userId,
            isAdmin: true
        },{transaction: t})

        await t.commit();
        res.status(201).json({success: true, message:'Group creation successful',isAdmin:addMember.isAdmin, data: group  })
    }catch(err){
        await t.rollback();
        res.status(500).json({success:false, error: err})
        console.log(err)
        throw new Error('ERR GRP CNTRL ADDGRP',err)
    }
}

exports.getMembers = async (req,res) =>{
    try{
        const user = await req.user;
        const users =  await User.findAll({where: {
            id: {
                [Op.ne]: user.id 
            }
        }
      })
        const getChat = JSON.parse(req.query.getChat);
        console.log("@)@", getChat.groupId)
        const members = await Member.findAll(
            {where: 
                {groupId: getChat.groupId,
                userId: {
                    [Op.ne]: user.id 
                }
            }})
        

        res.status(201).json({success: true,users:users, members: members,groupId: getChat.groupId, thisUser:user})
    }catch(err){
        console.log("ERROR",err)
        return res.status(500).json({success:false, error: err})
        
    }
}

exports.addMembers = async (req,res)=>{
    const t = await sequelize.transaction();
    try{
        const userId = JSON.parse(req.body.userId);
        const groupId= req.params.groupId
        const group = await Group.findOne({where: {id: groupId}})
        const isMember = await Member.findOne({where: {userId: userId,groupId: groupId}})
        if(isMember){
            res.status(201).json({success: false, message:'Already a member', data: isMember})
        }
        else{
            const user = await User.findOne({where:{id: userId}})
            console.log("USER",userId)
            const addMember = await group.createMember({
                groupName: group.groupName,
                userName: user.name,
                userId: userId,
                isAdmin: false
            },{transaction: t})
            await t.commit()
            
            res.status(201).json({success: true, message:'Added to group successfully',isAdmin: false, data: addMember})

        }
        
    }catch(err){
        await t.rollback();
        res.status(500).json({success:false, error: err})
        console.log(err)
        throw new Error('ERR GRP CNTRL ADDGRP',err)
    }
}


exports.removeMembers = async (req,res)=>{
    const t = await sequelize.transaction();
    try{
        const userId = req.params.userId;
        console.log("USRID",userId)
        const groupId= req.params.groupId
        // const group = await Group.findOne({where: {id: groupId}})
        const isMember = await Member.findOne({where: {userId: userId,groupId: groupId}})
        if(isMember){
            
            console.log("USER",userId)
            const removeMember = await Member.destroy({where:{
                groupId:groupId,
                userId: userId
            }},{transaction: t})
            
            await t.commit()
            res.status(201).json({success: true, message:'User removed successfully', data: removeMember})
        }
        else{
            
            res.status(201).json({success: false, message:'Something went wrong unable to remove member', data: isMember})

        }
        
    }catch(err){
        await t.rollback();
        res.status(500).json({success:false, error: err})
        console.log(err)
        throw new Error('ERR GRP CNTRL REM GRP',err)
    }
}

exports.addAdmin = async (req,res)=>{
    const t = await sequelize.transaction();
    try{
        const userId = req.body.userId;
        const groupId= req.params.groupId
        const isMember = await Member.findOne({where: {userId: userId,groupId: groupId}})
        
        if(isMember){
            if(isMember.isAdmin){
                return res.status(201).json({success: false, message:`${isMember.userName} is already an Admin`,isAdmin:true})
            }
            const addAdmin = await Member.update({ isAdmin: true },{where: {userId: userId, groupId: groupId}})
            await t.commit();
            
            res.status(201).json({success: true, message:`${isMember.userName} is an Admin now`,isAdmin:true, data: addAdmin})
            
        }
        else{
             
            res.status(201).json({success: false, message:'Something went wronng user not found ',isAdmin: false, data: addMember})

        }
        
    }catch(err){
        await t.rollback();
        res.status(500).json({success:false, error: err})
        console.log(err)
        throw new Error('ERR GRP CNTRL ADD ADMIN',err)
    }
}
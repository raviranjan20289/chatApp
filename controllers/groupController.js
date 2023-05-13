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
            userId: group.userId,
        },{transaction: t})

        await t.commit();
        res.status(201).json({success: true, message:'Group creation successful', data: group, admin:addMember })
    }catch(err){
        await t.rollback();
        res.status(500).json({success:false, error: err})
        console.log(err)
        throw new Error('ERR GRP CNTRL ADDGRP',err)
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
            const addMember = await group.createMember({
                groupName: group.groupName,
                userId: userId,
            },{transaction: t})
            await t.commit()
            res.status(201).json({success: true, message:'Joined group successfully', data: addMember})

        }
        
    }catch(err){
        await t.rollback();
        res.status(500).json({success:false, error: err})
        console.log(err)
        throw new Error('ERR GRP CNTRL ADDGRP',err)
    }
}
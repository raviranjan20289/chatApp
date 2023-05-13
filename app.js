require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path')
const app = express();

app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'frontend')));

const sequelize = require('./utility/database');

const userRoutes = require('./routes/signup');
const chatRoutes = require('./routes/chat');
const groupRoutes = require('./routes/groupRoutes')

app.use('/user',userRoutes);
app.use('/chats',chatRoutes);
app.use('/groups',groupRoutes);

const User = require('./models/userModel');
const Chat = require('./models/chat');
const Member = require('./models/groupMembersModel');
const Group = require('./models/groupModel');
User.hasMany(Chat);
Chat.belongsTo(User);


User.hasMany(Group);
Group.belongsTo(User);

Group.hasMany(Member);
Member.belongsTo(Group);

Group.hasMany(Chat);
Chat.belongsTo(Group);


sequelize.sync().then(()=>{
    app.listen(3000)
}).catch(err => console.log(err) );
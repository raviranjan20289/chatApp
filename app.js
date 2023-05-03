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

app.use('/user',userRoutes);

sequelize.sync().then(()=>{
    app.listen(3000)
}).catch(err => console.log(err) );
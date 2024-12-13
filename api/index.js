const express = require('express');
const cors = require('cors');
const { default: mongoose, connect } = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcrypt'); //used to ecrypt data
const app = express();
const jwt = require('jsonwebtoken'); 
const cookieParser = require('cookie-parser');

app.use(cors({credentials:true,origin:"http://localhost:3000"}));
app.use(express.json());
app.use(cookieParser());

const secret = "ncknknaidnckianckanc";
const salt = bcrypt.genSaltSync(10);
mongoose.connect('mongodb+srv://usmanali0044444:usmanali0044444@cluster0.gwosf.mongodb.net/');

app.post('/register', async (req, res) => {
        const { username, password } = req.body;
        try {
                const userDoc = await User.create({
                        username,
                        password:bcrypt.hashSync(password, salt), //used to ecrypt data
                }); 
                res.json(userDoc);
        }
        catch (e) {
                res.status(400).json(e);
        }
});

app.post('/login', async (req, res) => {
        const { username, password } = req.body;        
        const userDoc = await User.findOne({username});
        const passOk = bcrypt.compareSync(password, userDoc.password);
        
        if(passOk){
                jwt.sign({username,id:userDoc._id} , secret , {} , (err , token)=>{
                        if(err) throw err;
                        res.cookie('token' , token).json('ok');
                });
        }else{
                res.status(400).json('Wrong credentials');
        }
});

app.get('/profile' , (req,res)=>{
        res.json(req.cookies)
});
app.listen(4000, () => console.log("Server is running on port 4000"));
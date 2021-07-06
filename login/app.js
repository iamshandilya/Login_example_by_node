const express = require('express');
const http = require('http');
const bcrypt = require('bcrypt');
const path = require("path");
const users = require('./data').userDB;
const session = require("express-session");

const app = express();
const server = http.createServer(app);

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'./public')));
app.use(session({secret:"epFmNX@X%!LH6y6SC4xkADA8_ew@XH" ,resave:false ,saveUninitialized: true}));

app.get('/',(req,res) => {   
    res.sendFile(path.join(__dirname,'./public/index.html'));
        
});


app.post('/register', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (!foundUser) {
    
            let hashPassword = await bcrypt.hash(req.body.password, 10);
    
            let newUser = {
                id: Date.now(),
                username: req.body.username,
                email: req.body.email,
                password: hashPassword,
            };
            users.push(newUser);
            console.log('User list', users);
    
            res.send("<div align ='center'><h2>Registration successful</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>");
        } else {
            res.send("<div align ='center'><h2>Email already used</h2></div><br><br><div align='center'><a href='./registration.html'>Register again</a></div>");
        }
    } catch{
        res.send("Internal server error");
    }
});
app.get('/home', function(req, res){
    if(!req.session.userName){
        res.send("<div align ='center'><h2>Please Login First</h2></div><br><br><div align='center'><a href='./login.html'>login</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>");

    }
    else{
        res.send("<div align ='center'><h2>Hi There! you are already logged in</h2></div><br><br><div align='center'><a href='./login.html'>logout</a></div><br><br><div align='center'><a href='./registration.html'>Register another user</a></div>");
    }
})
app.post('/login', async (req, res) => {
    try{
        let foundUser = users.find((data) => req.body.email === data.email);
        if (foundUser) {
    
            let submittedPass = req.body.password; 
            let storedPass = foundUser.password; 
    
            const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
            if (passwordMatch) {
                let usrname = foundUser.username;
                req.session.userName = usrname;
                res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${usrname}</h3></div><br><br><div align='center'><a href='./login.html'>logout</a></div>`);
            } else {
            res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
            }
        }
        else {
    
            let fakePass = `F-SET?j66^fqZVe4DVC+H48Bj?Tzb=`;
            await bcrypt.compare(req.body.password, fakePass);
    
            res.send("<div align ='center'><h2>Invalid email or password</h2></div><br><br><div align='center'><a href='./login.html'>login again<a><div>");
        }
    } catch{
        res.send("Internal server error");
    }
});


server.listen(3000, function(){
    console.log("server is listening on port: 3000");
});

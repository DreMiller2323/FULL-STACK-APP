const express = require('express');
const models = require('../models/');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

router.get("/", function (req, res, next) {
    res.send('Welcome')
});

router.get("/deleted", function (req, res, next) {
    res.render("delete")
});
router.get("/unauthorized", function (req, res, next) {
    res.render("unauthorized");
});


router.get('/signup', function (req, res, next) {
    res.send('signup');
});

router.post('/signup', async function (req, res, next) {
    try {
        const salt = await bcrypt.genSalt(10);

        const userCreated = await
            models.users
                .findOrCreate({
                    where: {
                        Email: req.body.email
                    },
                    defaults: {
                        FirstName: req.body.firstName,
                        LastName: req.body.lastName,
                        Email: req.body.email,
                        Password: await bcrypt.hash(req.body.password, salt)
                    }
                })
        if (userCreated) {
            //  const token =  generateAccessToken({ email: req.body.email });
            res.status(201).send("User Created");

            console.log("user");
        }
    } catch (e) {
        console.log(e)
    }
});



router.get('/login', function (req, res, next) {
    res.send('login');
});
router.post('/login', async function (req, res, next) {
    try {
        models.users.findOne({
            where: {
                email: req.body.email
            }
        }).then(function (user) {
            if (!user) {
                res.redirect('/');
            } else {
                bcrypt.compare(req.body.password, user.Password, function (err, result) {
                    if (result == true) {
                        const data = ({ email: user.email })
                        const token = jwt.sign(data, process.env.JWT_SECRET)
                        res.cookie("access_token", token, {
                                httpOnly: true,
                                secure: process.env.JWT_SECRET === "production",
                                // path: '/profile',
                                maxAge: 60000
                            });
                        res.status(200).send("User Logged In");
                        console.log(token);   
                           }
                });
            }

        });
    } catch (err) {
        console.log(err)
    }
});

async function  verifyToken(req, res, next) {
try{
    const token = await req.cookies.access_token;
    if (!token) {
      return res.sendStatus(403);
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(401);
        req.data = user;
        next();
    
    })
}catch(err){
    console.log(err)
}
}

router.get('/profile', verifyToken, async function (req, res, next) {
try{
    const getEmail=  await models.users.findOne({where:{email:  req.body.email}})
if (getEmail){
    res.send(getEmail)
    next();
}
}catch(err){
    console.log(err)
}
 })


router.put("/logout", async function (req, res) {
const getEmail=  await models.users.findOne({where:{email:  req.body.email}})
jwt.sign(getEmail, process.env.JWT_SECRET,{expiresIn:1},(logout,error)=>{
if (logout){
res.send("You have been logged out")
}else{
    res.sendStatus(400);
}
});
});

module.exports = router;
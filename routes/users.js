const express = require('express');
const models = require('../models/');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { application } = require('express');
dotenv.config();

// router.get("/profile", [validateToken]);

//   function generateAccessToken(email) {
//     return jwt.sign(email,  `${process.env.JWT_Secret}`, { expiresIn: '1800s' });
//   }
router.get("/", function (req, res, next) {
    if (req.user && req.user.Admin) {
        models.users
            .findAll({ where: { Deleted: 0 } })
            .then(users => res.render("users", { users: users }));
    } else {
        res.redirect("/users/unauthorized");
    }
});



router.get("/", function (req, res, next) {
    if (req.user && req.user.Admin) {
        models.users
            .findAll({ where: { Deleted: 0 } })
            .then(users => res.render("users", { users: users }));
    } else {
        res.redirect("/users/unauthorized");
    }
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

        // const hashedPassword = await new Promise((resolve, reject) => {
        // bcrypt.hash(password, saltRounds, function(err, hash) {
        //  if (err) reject(err)
        //  resolve(hash)
        //  });
        //  })

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
router.post('/login', function (req, res, next) {
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
                    res.json({ token: token })
                    console.log(token)
                    next();
                    if (err) {
                        res.status(401).send("Error Logging in")
                    }
                } 
            });
        }

    });
});
function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user
        next();
    })
}


router.get('/profile', verifyToken, async function (req, res, next) {
    try{
        const profile = await models.users.findOne({user: req.user.id})

        if(!profile){
            res.status(400).json({ msg: 'There is no profile for this user' });
            return; // Stop execution here
        }

        res.json(profile);

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



router.get("/logout", function (req, res) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = models.users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    models.users.update({ refresh_token: null }, {
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);

});
module.exports = router;
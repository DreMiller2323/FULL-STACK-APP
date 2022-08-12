var express = require('express');
var models = require('../models/');
var router = express.Router();
var passport = require('../services/passport');
const bcrypt =require("bcrypt");
router.get("/", function (req, res, next) {
    if (req.user && req.user.Admin) {
        models.users
            .findAll({where: {Deleted: 0}})
            .then(users => res.render("users", {users: users}));
    } else {
        res.redirect("/users/unauthorized");
    }
});
router.get("/unauthorized", function (req, res, next) {
    res.render("unauthorized");
});
router.get('/register', function (req, res, next) {
  res.send('register');
});

router.post('/register', async  function (req, res, next) {
 try{
await models.users.findOrCreate({
    where: {  
    email: req.body.email,
 },
    defaults: {
        FirstName: req.body.firstName,
        LastName: req.body.lastName,
        Email: req.body.email,
        Password: req.body.password

    }
  }).then(res=>{
            res.redirect('/login');
       
        })
    }
    catch(e){
       res.json(e)
    }
   // .spread(function (result, created) {
        //     if (created) {

        //          res.redirect('login');
        //     } else {
        //         res.send('This user already exists');
        //     }
        // });
});
router.get('/login', function (req, res, next) {
    res.send('login');
});
router.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true, 
}),
  function(req, res) {
    res.redirect('profile')
  });
router.get('/profile', function (req, res, next) {
    if (req.user) {
        models.users
            .findByPk(parseInt(req.user.UserId))
            .then(user => {
                if (user.Deleted == 1) {
                    res.redirect('/users/deleted')
                }
                if (user) {
                    res.send( {
                        FirstName: user.FirstName,
                        LastName: user.LastName,
                        Email: user.Email,
                        Username: user.Username
                    });
                } else {
                    res.send('User not found');
                }
            });
    } else {
        res.redirect('/users/login');
    }
});


router.get("/logout", function (req, res) {
    req.session.destroy(function (err) {
        res.redirect("/");
    });
});
module.exports = router;

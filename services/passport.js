// // Bring in the required libraries
// var passport = require('passport');
// var LocalStrategy = require('passport-local').Strategy;
// var models = require('../models');
// const bcrypt = require('bcrypt');
// const jwt=require("jsonwebtoken");


// // Configure the login validation
// passport.use(
//     'local',
//     new LocalStrategy({usernameField: 'Email'}, async   (email, password, done)=> {
//         models.users.findOne({ where: { Email: email } , Password:password})
//         try{
//             const match = await bcrypt.compare(req.body.password, user.password);
//             const accessToken = jwt.sign(JSON.stringify(user), process.env.TOKEN_SECRET)
//             if(match){
//                 res.json({ accessToken: accessToken });
//             } else {
//                 res.json({ message: "Invalid Credentials" });
//             }
//         } catch(e) {
//             console.log(e)
//         }
    
    
    
    
    
//     })
// );

// // Stores the user id in the user session
// passport.serializeUser((user, callback) => {
//     callback(null, user.UserId);
// });

// // Queries the database for the user details and adds to the request object in the routes
// passport.deserializeUser((id, callback) => {
//     models.users
//         .findByPk(id)
//         .then(user => callback(null, user))
//         .catch(err => callback(err));
// });

// module.exports = passport;
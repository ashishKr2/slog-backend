const jwt=require('jsonwebtoken');
var User=require('../models/user');
const config=require('../config/database');
const userschema=require('../schema/userSchema');
const verifier = require('email-verify');
var token;

module.exports = {
    signup: (req, res) => {
        var newUser = new userschema({
            username: req.body.username,
            email: req.body.email,           
            password: req.body.password,
        });
        var un = new userschema({
            username: req.body.username,
        });
        User.getByUsern(un.username, function (err, user) {
            if (err) throw err;
            if (user) {
                 return res.status(501).json({ success: false, message: 'Choose another username' });
               
            }
            else {
                User.createUser(newUser, function (err, user) {
                    if (err) {
                         res.status(400).json({ success: false, message: 'user already registered with same email' });
                   
                    }
                    else {
                        
                            verifier.verify(newUser.email, function( err, info ){
                                if( info.success )  {
                                    console.log( "Success (T/F): " + info.success );
                                    console.log( "Info: " + info.info );
                                    res.status(200).json({success:true,message:'SignUp Successful'})
                                   
                                }     
                                else{
                                    res.status(400).json({success:false,message:'Email not valid'})
                                    console.log( "Success (T/F): " + info.success );
                                    console.log( "Info: " + info.info );
                                }
                              });
                       
                        
                       
                    }
                });
            }
        })


    },
    login: (req, res) => {
        var email = req.body.email;
        var password = req.body.password;

        User.getUserByEmail(email, function (err, user) {
            if (err) throw err;
            if (!user) {
                //return res.json({ success: false, message: 'no user found' });
                 return res.sendStatus(404);
            }
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    token = jwt.sign(user.toJSON(), config.secret, { expiresIn: 600000 });
                    res.json({
                        success: true, token: 'JWT ' + token,
                        user: {
                            id: user._id,
                            username: user.username,
                            email: user.email,
                            password: user.password,
                        }
                    });
                } else {
                    //return res.json({ success: false, message: 'password not match' });
                    return res.sendStatus(401);
                }
            });
        });
    }
}
const experss = require('express');
const router = experss.Router();
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const passport = require('passport');
//User model
const User = require('../models/User');

//login page
router.get('/login', (req, res) => {

    res.render('login', {auth: req.isAuthenticated()});
});

//register page
router.get('/register', (req, res) => {

    res.render('register', {auth: req.isAuthenticated()});
});

//POST request for registering
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    //Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' })
    }
    //Check if passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' })
    }
    //Check pass length
    if (password.length < 10) {
        errors.push({ msg: 'Password should be at least 10 characters' })
    }

    if (errors.length > 0) {
        console.log(errors);
        res.render('register', {
            errors, name, email
        })
    } else {
        //validation pass
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'Email is already registered' })
                    res.render('register', {
                        errors, name,
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    //hash password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            //set password to hash
                            newUser.password = hash;
                            //save the user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in');
                                    res.redirect('/users/login', {auth: req.isAuthenticated()});
                                })
                                .catch(err=>console.error(err));
                        }));
                }
            });
    }
});

//Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next)    
});

//Logout
router.get('/logout', (req,res)=>{
    req.logOut();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login', {auth: req.isAuthenticated()});
})

module.exports = router;
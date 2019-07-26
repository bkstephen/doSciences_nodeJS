const experss = require('express');
const router = experss.Router();
const {ensureAuthenticated} = require('../config/auth');

router.get('/', (req , res)=>{
    //this is how you check if the person is logged in   
    res.render('welcome', {auth: req.isAuthenticated()});        
});

router.get('/dashboard', ensureAuthenticated, (req,res)=>{
    res.render('dashboard', {name: req.user.name, auth: req.isAuthenticated()});
});

module.exports = router;
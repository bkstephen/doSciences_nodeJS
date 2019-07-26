const experss = require('express');
const router = experss.Router();
const {ensureAuthenticated} = require('../config/auth');

router.get('/', (req , res)=>{
    if (req.isAuthenticated()){ //this is how you check if the person is logged in        
        res.render('welcome', {auth: true});
    } else{
        res.render('welcome', {auth: false});
    }    
});

router.get('/createpost',  (req,res)=>{
    res.render('createpost');
});

module.exports = router;
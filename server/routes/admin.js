const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const User = require('../models/users');

// 设置admin的layout
const adminLayout = '../views/layouts/admin'

router.get('/',async (req,res) => {
    const locals = {
        title: "Admin Panel",
        description : "Simple blog create with NodeJs, express & MongoDB",
    }
    try{
        res.render('admin/index',{ locals , layout:adminLayout});
    }catch(error){
        console.log(`Error: ${error}`);
    }
});

// insert userData
// POST
router.post('/',async (req,res) => {
    try{

        const { username,password } = req.body;

        if(req.body.username === 'admin' && req.body.password === "admin") {
            res.send("You are loged in")
        } else {
            res.send("Wrong username or password")
        }

        res.redirect('/admin');
    }catch(error){
        console.log(`Error: ${error}`);
    }
});


module.exports = router;
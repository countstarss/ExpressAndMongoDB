const express = require('express');
const router = express.Router();

router.get('',(req,res) => {
    const locals = {
        title: "Express Blog",
        description : "Simple blog create with NodeJs, express & MongoDB",
        joke: "you are beautiful"
    }
    res.render('home',{ locals });
})

router.get('/about',(req,res) => {
    res.render('about');
})

router.get('/contact',(req,res) => {
    res.render('contact');
})

module.exports = router;
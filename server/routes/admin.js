const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 设置admin的layout
const adminLayout = '../views/layouts/admin'
const jwtSecret = process.env.JWT_SECRET;

/*
 * GET /
 * Admin - Login Page /
*/
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

/* 
  * POST /
  * Admin - Check Login/
*/
router.post('/',async (req,res) => {
    try{
        const { username,password } = req.body;

        const user = await User.findOne({username : username});

        if(!user) {
            // 这些返回的消息都可以改成对应的页面，并提供返回链接
            return res.status(401).json({ message:"Invilid account" });
        }

        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(!isPasswordValid) {
            // 这些返回的消息都可以改成对应的页面，并提供返回链接
            return res.status(401).json({ message:"Invilid account" });
        }
        // 如果username和password都有效，那么就保存到cokkie里面
        // 第二个参数是一个加密字符串
        const token = jwt.sign({userId: user._id}, jwtSecret);
        res.cookie('token',token, {httpOnly : true}); // 将前面写好的内容作为token
        res.redirect('/admin/dashBoard');
    }catch(error){
        console.log(`Error: ${error}`);
    }
});

/* 
  * Admin - Check Login/
*/
const authMiddleware = (req,res,next) => {
    const token = req.cookies.token;

    if(!token) {
        // 这些返回的消息都可以改成对应的页面，并提供返回链接
        return res.status(401).json({ message:'Unauthorized' });
    }

    try {
        const decode = jwt.verify(token,jwtSecret);
        req.userId = decode.userId;
        next();
    }catch(error){
        // 这些返回的消息都可以改成对应的页面，并提供返回链接
        res.status(401).json({ message:'Unauthorized' });
    }
}

/* 
  * GET /
  * Admin - DashBoard/
*/
router.get('/dashboard',authMiddleware,async (req,res) => {
    const locals = {
        title: "Admin Panel",
        description : "Simple blog create with NodeJs, express & MongoDB",
    }
    // 需要指定layout
    res.render('admin/dashBoard',{ locals , layout:adminLayout});
});
/* 
  * POST /
  * Admin - Register/
*/

router.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
  
      try {
        const user = await User.create({ username:username, password:hashedPassword });
        res.status(201).json({ message: 'User Created', user });
      } catch (error) {
        if(error.code === 11000) {
          //这种的可以弹出一个弹窗提示
          res.status(409).json({ message: 'User already in use'});
        }
        res.status(500).json({ message: 'Internal server error'})
      }
  
    } catch (error) {
      console.log(error);
    }
  });

module.exports = router;
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
router.get('/admin',async (req,res) => {
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
router.post('/admin',async (req,res) => {
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
        res.redirect('/dashBoard');
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
        res.redirect('/admin');
        return "";
        // return res.status(401).json({ message:'Unauthorized' });
        
    }

    try {
        // 验证 token 是否有效，解码其中的信息
        const decode = jwt.verify(token,jwtSecret);
        // 将解码后的用户ID存储在 req.userId 中，以便后续路由处理程序使用
        req.userId = decode.userId;
        // 调用 next() 将控制权交给下一个中间件或路由处理程序
        next();
        /* 
            `next()` 的作用是控制 Express 中间件流水线中的执行顺序，
            允许开发者按顺序定义多个中间件来处理请求，每个中间件都有机会对
            请求进行处理或转发到下一个中间件,如果不写next(),那么程序就会被挂起
        */
    }catch(error){
        // 这些返回的消息都可以改成对应的页面，并提供返回链接
        res.status(401).json({ message:'Unauthorized' });
    }
}

/* 
  * GET /
  * Admin - DashBoard/
*/
// dashboard和编辑，删除功能只有拥有权限时，才会生效
router.get('/dashboard',authMiddleware,async (req,res) => {
    try {
        const locals = {
          title: "Admin Panel",
          description : "Simple blog create with NodeJs, express & MongoDB",
        }

        let perPage = 9;
        let page = req.query.page || 1;
        // 分页设计：每页显示9条，根据创建时间排序，显示最新的5条
        // 如果后边还有,那么就显示上一页的链接，到第二页，依次增加

        // 最前面一页的数据
        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        // Count is deprecated - please use countDocuments
        // const count = await Post.count();
        const count = await Post.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
        // 最后一页一定是小于或者等于perPage，之所以用ceil是因为，就算多出一个，也要多增加一页
      // ===============
        // 需要指定layout
        res.render('admin/dashBoard',{ 
          locals,
          data,
          current: page,
          nextPage: hasNextPage ? nextPage : null,
            layout:adminLayout
          }
        );
    }catch(error) {
        return res.status(400).json({ message:'Unauthorized' });
    
    } 
});


/* 
  * GET /
  * Admin - Create new post/
*/
router.get('/add-post',authMiddleware,async (req,res) => {
    try {
        const locals = {
            title: "Add post",
            description : "Simple blog create with NodeJs, express & MongoDB",
        }

        const data = await Post.find();
        // 需要指定layout
        res.render('admin/add-post',{ 
            locals , 
            data,
            layout:adminLayout}
        );
    }catch(error) {
        return res.status(400).json({ message:'Unauthorized' });
    
    } 
});

/* 
  * POST /
  * Admin - Create new post/
*/

router.post('/add-post', authMiddleware, async (req, res) => {
    try {
        console.log(req.body);
      try {
        const newPost = new Post({
          title: req.body.title,
          body: req.body.body
        });
  
        await Post.create(newPost);
        res.redirect('/dashboard');
      } catch (error) {
        console.log(error);
      }
  
    } catch (error) {
      console.log(error);
    }
  });
  
/* 
  * GET /
  * Admin - Edit post/
*/
router.get('/edit-post/:id',authMiddleware,async (req,res) => {
    try {
        const slug = req.params.id;
        const locals = {
            title: "Edit post",
            description : "Simple blog create with NodeJs, express & MongoDB",
        }
        const data = await Post.findOne({ _id:req.params.id });
        // 需要指定layout
        res.render('admin/edit-post',{ 
            locals , 
            data,
            layout:adminLayout,
            // currentRoute: `/edit-post/${slug}`
        }
        );
    }catch(error) {
        return res.status(400).json({ message:'Unauthorized' });
    
    } 
});



/* 
  * PUT /
  * Admin - Edit post/
*/
router.put('/edit-post/:id',authMiddleware,async (req,res) => {
    try {

        await Post.findByIdAndUpdate(req.params.id,{
            title:req.body.title,
            body:req.body.body,
            updatedAt:Date.now()
        });
        // 需要指定layout
        res.redirect(`/edit-post/${req.params.id}`);
    }catch(error) {
        return res.status(400).json({ message:'Unauthorized' });
    
    } 
});

/* 
  * POST /
  * Admin - Delete post/
*/
// 注意使用的方法
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

  try {
    await Post.deleteOne( { _id: req.params.id } );
    res.redirect('/dashboard');
  } catch (error) {
    console.log(error);
  }
});

/* 
  * GET /
  * Admin - Logout/
*/
router.get('/logout',(req,res) => {
  res.clearCookie('token');
  // res.json({ message:"logout successfully" });
  res.redirect('/');
});




/* 
  * GET /
  * Admin - Register/
*/
router.get('/register',async (req,res) => {
    const locals = {
        title: "Register",
        description : "Simple blog create with NodeJs, express & MongoDB",
    }
    try{
        res.render('admin/register',{ locals , layout:adminLayout});
    }catch(error){
        console.log(`Error: ${error}`);
    }
});

/* 
  * POST /
  * Admin - Register/
*/

router.post('/register', async (req, res) => {
    try {
      
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(username);
      console.log(password);
  
      try {
        const user = await User.create({ username:username, password:hashedPassword });
        // res.status(201).json({ message: 'User Created', user });
        res.redirect('/admin/login');
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
const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const { render } = require('ejs');

// Home路由
router.get('', async (req, res) => {
    try {
      const locals = {
        title: "NodeJs Blog",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }
  
      let perPage = 6;
      let page = req.query.page || 1;
      // 分页设计：每页显示5条，根据创建时间排序，显示最新的5条
      // 如果后边还有,那么就显示上一页的链接，到第二页，依次增加
    
      // 最前面一页的数据
      const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();
  
      // Count is deprecated - please use countDocuments
      // const count = await Post.count();
      const count = await Post.countDocuments({});
      const nextPage = parseInt(page) + 1;
      const hasNextPage = nextPage <= Math.ceil(count / perPage);
       // 最后一页一定是小于或者等于perPage，之所以用ceil是因为，就算多出一个，也要多增加一页
      res.render('home', { 
        locals,
        data,
        current: page,
        nextPage: hasNextPage ? nextPage : null,
        // nextPage只是一个页码，实际上提供数据的一直是data，根据page不同，提供不同的数据
        currentRoute: '/'
      });
  
    } catch (error) {
      console.log(error);
    }
  
  });

// blog路由
router.get('/blog', async (req, res) => {
try {  
    let perPage = 7;
    let page = req.query.page || 1;
    // 分页设计：每页显示5条，根据创建时间排序，显示最新的5条
    // 如果后边还有,那么就显示上一页的链接，到第二页，依次增加

    // 最前面一页的数据
    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    // Count is deprecated - please use countDocuments
    // const count = await Post.count();
    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);
    // 最后一页一定是小于或者等于perPage，之所以用ceil是因为，就算多出一个，也要多增加一页
    res.render('blog', { 
    data,
    current: page,
    nextPage: hasNextPage ? nextPage : null,
    // nextPage只是一个页码，实际上提供数据的一直是data，根据page不同，提供不同的数据
    currentRoute: '/blog'
    });

} catch (error) {
    console.log(error);
}
});


// No pagination version
// router.get('',async (req,res) => {
//     const locals = {
//         title: "Express Blog",
//         description : "Simple blog create with NodeJs, express & MongoDB",
//         joke: "you are beautiful"
//     }
//     try{
//         const data = await Post.find();
//         res.render('home',{ locals,data });
//     }catch(error){
//         console.log(`Error: ${error}`);
//     }

//     res.render('home',{ locals });
// });


// 插入数据
// function insertPostData() {
//     Post.insertMany([
//         {
//             title:"Buliding a blog",
//             body:"this is the body text",
//         },
//         {
//             title:"Buliding a blog 2",
//             body:"this is the body text 2",
//         },
//         {
//             title:"Buliding a blog 3",
//             body:"this is the body text 3",
//         },
//     ])
// };
// insertPostData();


// function insertPostData () {
//   Post.insertMany([
//     {
//       title: "Building APIs with Node.js",
//       body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js"
//     },
//     {
//       title: "Deployment of Node.js applications",
//       body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments..."
//     },
//     {
//       title: "Authentication and Authorization in Node.js",
//       body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries."
//     },
//     {
//       title: "Understand how to work with MongoDB and Mongoose",
//       body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications."
//     },
//     {
//       title: "build real-time, event-driven applications in Node.js",
//       body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
//     },
//     {
//       title: "Discover how to use Express.js",
//       body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications."
//     },
//     {
//       title: "Asynchronous Programming with Node.js",
//       body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations."
//     },
//     {
//       title: "Learn the basics of Node.js and its architecture",
//       body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers."
//     },
//     {
//       title: "NodeJs Limiting Network Traffic",
//       body: "Learn how to limit netowrk traffic."
//     },
//     {
//       title: "Learn Morgan - HTTP Request logger for NodeJs",
//       body: "Learn Morgan."
//     },
//   ])
// }
// insertPostData();


// About路由
router.get('/about',(req,res) => {
    res.render('about');
})

// Contact
router.get('/contact',(req,res) => {
    res.render('contact');
})

module.exports = router;
require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');


const connectDB = require('./server/config/db');


const app = express();
const PORT = 1341 || process.env.PORT;

// connect to DB
connectDB();

// 使我们能够传递数据
app.use(express.urlencoded({extended :true}));
// 使我们能够通过表单传递数据
app.use(express.json());
// 
app.use(cookieParser());
// 设置session中间件
app.use(session({
    secret: 'keyboard cat',
    resave:false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl:process.env.MONGODB_URI
    }),
    // 设置cookie过期时间
    // cookie: { maxAge: new Date (Date.now() + (7200000)) }
}));
// 使用重写方法中间件
app.use(methodOverride('_method'));

// 在使用public作为网站模板的同时，设置浏览器的缓存
app.use(express.static('public'));
// app.use(express.static('public', {
//     maxAge: '1y', // 缓存时间为一年
//     etag: true,   // 启用 ETag
//     lastModified: true // 启用 Last-Modified
// }));


// 添加模板引擎
app.use(expressLayouts);
app.set('layout','layouts/main');
app.set('view engine','ejs')

// 导入路由
app.use('/',require('./server/routes/admin'));
app.use('/',require('./server/routes/main'));

app.listen(PORT,() => {
    console.log(`app listening on port ${PORT}`);
});
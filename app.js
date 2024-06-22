require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const MongoStore = require('connect-mongo')


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
}))


app.use(express.static('public'));


// 添加模板引擎
app.use(expressLayouts);
app.set('layout','layouts/main');
app.set('view engine','ejs')

// 导入路由
app.use('/',require('./server/routes/main'));
app.use('/admin',require('./server/routes/admin'));

app.listen(PORT,() => {
    console.log(`app listening on port ${PORT}`);
});
require('dotenv').config();

const express = require('express');
const expressLayouts = require('express-ejs-layouts')

const app = express();
const PORT = 9000 || process.env.PORT;

app.use(express.static('public'));


// 添加模板引擎
app.use(expressLayouts);
app.set('layout','layouts/main');
app.set('view engine','ejs')

// 导入路由
app.use('/',require('./server/routes/main'));

app.listen(PORT,() => {
    console.log(`app listening on port ${PORT}`);
});
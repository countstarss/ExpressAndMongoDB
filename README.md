# 启动项目
    npm run dev    // "nodemon app.js"
    npm start      // "run app.js"
``` json
"bcrypt": "^5.1.1",
"connect-mongo": "^5.1.0",
"cookie-parser": "^1.4.6",
"dotenv": "^16.4.5",
"ejs": "^3.1.10",
"express": "^4.19.2",
"express-ejs-layouts": "^2.5.1",
"express-session": "^1.18.0",
"jsonwebtoken": "^9.0.2",
"method-override": "^3.0.0",
"mongoose": "^8.4.3",
"nodemon": "^3.1.4",
"yarn": "^1.22.22"
```

# 共10小节

## 第一部分: commit 1
- 初始化项目，添加第三方库
- 在pachage.json中配置命令
``` js   // 自定义命令
    npm run dev    // "nodemon app.js"
    npm start      // "run app.js"
```
- 在app.js中搭建起最小的app
- 添加路由，分离到文件中，导出路由
- 在app.js中引用路由


## 第二部分: commit 2
- 添加ejs模板，了解ejs的渲染方式
    ```  js  //ejs的渲染方式
    const expressLayouts = require('express-ejs-layouts')
    // 添加模板引擎
    app.use(expressLayouts);
    app.set('layout','layouts/main');
    app.set('view engine','ejs')
    ```
  - 最外层一个views，内部有一个layouts文件夹，它的main.ejs用来控制布局
  - layouts同级有N个ejs文件，通过路由访问,
    ``` js  //通过路由访问ejs
    router.get('/about',(req,res) => {
        res.render('about'); // 指定渲染的内容
    })
    ```
  - ejs引用
    - <%- body %>           引用模板内容
    - <%= locals.title %>   引用props

- ejs组件的使用
  - 在views中新建与layouts同级的文件夹partials，里面创建组件ejs
    - 使用include找到组件位置实现引用 <%- include('../partials/header') %>   // ejsesc 是引用的快捷键
- layouts的基本结构
  - header
    - header_nav
    - header_button
  - main  各个页面的内容不同，各自写在ejs文件里
  - footer
- 搭建起home页面的基础结构
  - author
  - article


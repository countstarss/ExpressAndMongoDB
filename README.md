# 启动项目

    npm run dev    // "nodemon app.js"
    npm start      // "run app.js"

```json
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

# 共 10 小节

## 第一部分: commit 1

- 初始化项目，添加第三方库
- 在 pachage.json 中配置命令
  ```js // 自定义命令
  npm run dev    // "nodemon app.js"
  npm start      // "run app.js"
  ```
- 在 app.js 中搭建起最小的 app
- 添加路由，分离到文件中，导出路由
- 在 app.js 中引用路由

## 第二部分: commit 2

- 添加 ejs 模板，了解 ejs 的渲染方式
  ```js //ejs的渲染方式
  const expressLayouts = require("express-ejs-layouts");
  // 添加模板引擎
  app.use(expressLayouts);
  app.set("layout", "layouts/main");
  app.set("view engine", "ejs");
  ```
  - 最外层一个 views，内部有一个 layouts 文件夹，它的 main.ejs 用来控制布局
  - layouts 同级有 N 个 ejs 文件，通过路由访问,
    ```js //通过路由访问ejs
    router.get("/about", (req, res) => {
      res.render("about"); // 指定渲染的内容
    });
    ```
  - ejs 引用
    - <%- body %> 引用模板内容
    - <%= locals.title %> 引用 props
- ejs 组件的使用
  - 在 views 中新建与 layouts 同级的文件夹 partials，里面创建组件 ejs
    - 使用 include 找到组件位置实现引用 <%- include('../partials/header') %> // ejsesc 是引用的快捷键
- layouts 的基本结构
  - header
    - header_nav
    - header_button
  - main 各个页面的内容不同，各自写在 ejs 文件里
  - footer
- 搭建起 home 页面的基础结构
  - author
  - article

## 第三部分: commit 3

- 从 GoogleFont 引入字体
- 预定义 css 样式
  ```css //定义css样式
  :root {
    --black: #1c1c1c;
    --gray: #7e7e7e;
    --gray-light: #e4e4e4;
    --red: #b30000;
    --font-size-base: 1rem;
    --font-size-md: clamp(1.25rem, 0.61vw + 1.1rem, 1.58rem);
    --font-size-lg: clamp(1.56rem, 1vw + 1.31rem, 2.11rem);
    --font-size-xl: clamp(2.44rem, 2.38vw + 1.85rem, 3.75rem);
    --border-radius: 10px;
  }
  ```
  - 自定义 css 样式的使用
  ```css //var(定义的样式名字)
  color: var(--black);
  font-size: var(--font-size-base);
  ```
- 完成主页的样式

## 第四部分: commit 4

- 添加弹出的搜索框
- 在 mongoDB cloud 中添加 MongoDB 数据库

  ```shell 不同环境下使用mongoDB的connect字符串
  vscode:
  mongodb+srv://luke:ywEC1qDLyAMmYEuj@exprossblog.theaxyk.mongodb.net/

  shell:  # homebrew : brew install mongosh
  mongosh "mongodb+srv://exprossblog.theaxyk.mongodb.net/" --apiVersion 1 --username luke --password ywEC1qDLyAMmYEuj

  NodeJs:
  mongodb+srv://luke:ywEC1qDLyAMmYEuj@exprossblog.theaxyk.mongodb.net/?retryWrites=true&w=majority&appName=ExprossBlog
  ```

  最终采用 vscode 方法

- 在 server 下新建 confog 文件夹，创建 db.js
- 在 db.js 中使用 mongoose 连接 mongoDB
  - 成功链接数据库
- 在 server 下新建 models 文件夹，创建 posts.js
  - 创建并且导出模型
  ```js //创建&导出模型
  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;
  const PostSchema = new Schema({
    title: {
      type: String,
      require: true,
    },
    body: {
      type: String,
      require: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  });
  module.exports = mongoose.model("Post", PostSchema);
  ```

## 第五部分: commit 5: 获取并且渲染 posts

- 向数据库中插入数据 //使用 insertMany 方法
  ```js //插入数据
  function insertPostData() {
    Post.insertMany([
      {
        title: "Buliding a blog",
        body: "this is the body text",
      },
    ]);
  }
  ```
- 从数据库中找到数据并渲染

  ```js //获取数据
  router.get("", async (req, res) => {
    const locals = {
      title: "Express Blog",
      description: "Simple blog create with NodeJs, express & MongoDB",
      joke: "you are beautiful",
    };

    try {
      const data = await Post.find();
      res.render("home", { locals, data });
    } catch (error) {
      console.log(`Error: ${error}`);
    }

    res.render("home", { locals });
  });
  ```

- 使用 ejs 模板引擎渲染获取的数据
  ```js //渲染数据
  <% data.forEach(post => { %>
    <li>
        <a href="#">
            <%= post.title %>
            <span class="article-list_date"><%= post.createdAt.toDateString() %></span>
        </a>
    </li>
  <% }) %>
  ```

## 第六部分: commit 6: 添加搜索功能
- 在 routes/main.js 中添加 post 的路由
- 修改 home.ejs 和 blog.ejs 中a标签转向的路由地址，实现点击post功能
- 添加 search.ejs,使用 js 实现，点击按键 search 框从上方弹出
  - 主要使用visibility，transform & transition
  ```css  //动画的css部分
  .searchBar {
    visibility: hidden;
    transform: translateY(-100px);
    background-color: rgba(0,0,0,0.85);
    padding: 4px 0;
    position: absolute;
    left: 0;
    right: 0;
  }
  .searchBar.open {
    transform: translateY(0px);
    transition: transform 0.1s;
  }
  ```
  - 使用js让点击按键给标签添加class，实现效果
  ``` js  
  document.addEventListener('DOMContentLoaded', function(){
    const allButtons = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');

    for (var i = 0; i < allButtons.length; i++) {
      allButtons[i].addEventListener('click', function() {
        searchBar.style.visibility = 'visible';
        searchBar.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
        searchInput.focus();
      });
    }
    // Close按键的动作
    searchClose.addEventListener('click', function() {
      searchBar.style.visibility = 'hidden';
      searchBar.classList.remove('open');
      this.setAttribute('aria-expanded', 'false');
    });
  });
  ```
- 添加search路由
  - 根据输入的内容，在mongoDB中查找符合条件的内容
  - 查找时使用正则来规范查找内容

## 第七部分: commit 7: 添加admin登录功能
- 增加admin路由
- 添加admin的layout模板
- 设置admin的layout
- 添加admin login页面
- 创建新的model users
- 在admin.js路由文件中创建post方法用于admin登录

## 第八部分: commit 8: 用户的加密和验证

注意: post方法用来控制是否转到某页面，get方法用来渲染页面

- 添加cookie-parser,用于获取、保存登录信息
- 为app添加cookie-parser中间件
- 添加connect-mongo作为mongoStore
- 添加express-session
- 设置session中间件
- 重写register -- POST Register
  - 在admin.js中添加bcrypt
  - 在admin.js中添加jwt
- 重写login -- POST Login
  - 使用user._id 和 jwtSecret 生成token
  - 将token保存起来
  - 重定向到dashBoard，这是登录成功的标志
- 写权限的中间件 authMiddleware
  - 主要作用是验证token
  - 先看有没有，没有直接报权限错误
  - 如果有，构建jwt解码器，解码userId,因为创建token的时候就是用的userId，这个是自动生成的并且唯一。
- 把authMiddleware放到需要check地方的参数里

## 第九部分: commit 9: 创建新帖子
- 构建dashBoard
- 添加帖子
  - 每个路由都需要一个get和一个post方法
  - get用来渲染这个页面，post用来完成功能
  - get是显式的，而post的信息不会暴露出来
- 重构了一下路由，把admin路由在添加的时候写成'/',好让和home的代码风格统一，只需要在get和重定向的时候前面多写一个前缀admin。


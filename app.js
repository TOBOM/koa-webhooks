/*
 * @Author: 温岭吴彦祖 
 * @Date: 2017-08-30 10:42:14 
 * @Last Modified by: 温岭吴彦祖
 * @Last Modified time: 2017-08-31 09:40:50
 */

const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const Koabody = require('koa-body')
const config = require('./config/config.json'); // 配置文件
const hexo = require('./hexo'); // 配置文件



//默认参数
let PORT = config.PORT;
let URL_PATH = config.URL_PATH || '/';
let SECRET = config.SECRET || '';

//接收coding的webhook,暂时只支持coding
router.post(URL_PATH, async(ctx) => {
  
  if (typeof ctx.request.body.token!="undefined" && ctx.request.body.token !== '' && ctx.request.body.token == SECRET) {

    try {
      hexo.restart((err) => {
        if (err) {
          ctx.status = 500;
          ctx.body == err.message;
          console.error(err);
        }

        console.log('blog start!');
        ctx.body = ' ok! '
      });

    } catch (err) {
      console.error(err);
      ctx.body = 'update blog failed!'
      ctx.status = 400;
      
    }


  } else {
    ctx.body = {
      'error': 'check signature failed! '
    }
    ctx.status = 400;
    
  }



})

//中间件
app
  .use(Koabody())
  .use(router.routes())
  .use(router.allowedMethods())


app.listen(PORT, () => {
  console.log('webhook服务启动 端口:' + PORT)
})
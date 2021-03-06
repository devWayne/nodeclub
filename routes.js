/*!
 * nodeclub - route.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var sign = require('./controllers/sign');
var site = require('./controllers/site');
var user = require('./controllers/user');
var message = require('./controllers/message');
var topic = require('./controllers/topic');
var reply = require('./controllers/reply');
var rss = require('./controllers/rss');
var upload = require('./controllers/upload');
var assets = require('./controllers/static');
var tools = require('./controllers/tools');
var auth = require('./middlewares/auth');
var limit = require('./middlewares/limit');
var status = require('./controllers/status');
var config = require('./config');


module.exports = function (app) {
  // home page
  app.get('/', site.index);
  app.get('/home', site.index);
  


  // sign up, login, logout
  app.get('/signup', sign.showSignup);
  app.post('/signup', sign.signup);
 
  app.post('/signout', sign.signout);
  app.get('/signin', sign.showLogin);
  app.post('/signin', sign.login);
  app.get('/active_account', sign.active_account);

  // password
  app.get('/search_pass', sign.showSearchPass);
  app.post('/search_pass', sign.updateSearchPass);
  app.get('/reset_pass', sign.reset_pass);
  app.post('/reset_pass', sign.update_pass);

  // user
  app.get('/user/:name', user.index);
  app.get('/setting', user.showSetting);
  app.post('/setting', user.setting);
  app.get('/stars', user.show_stars);
  app.get('/users/top100', user.top100);
  app.get('/user/:name/tags', user.get_collect_tags);
  app.get('/user/:name/collections', user.get_collect_topics);
  app.get('/my/messages', message.index);
  app.get('/user/:name/follower', user.get_followers);
  app.get('/user/:name/following', user.get_followings);
  app.get('/user/:name/topics', user.list_topics);
  app.get('/user/:name/replies', user.list_replies);
  app.post('/user/follow', auth.userRequired, user.follow);
  app.post('/user/un_follow', user.un_follow);
  app.post('/user/set_star', user.toggle_star);
  app.post('/user/cancel_star', user.toggle_star);
  app.post('/user/:name/block', auth.adminRequired, user.block);

  // topic
  // 新建文章界面
  app.get('/topic/create', auth.signinRequired, topic.create);
  app.get('/topic/:tid', topic.index);
  app.get('/topic/:tid/top/:is_top?', topic.top);
  app.get('/topic/:tid/edit', topic.showEdit);

  // Po-Ying Chen <poying.me@gmail.com>: 當 "非" 作者的使用者在留言的地方貼上一個網址為
  // http://[domain name]/topic/[topic id]/delete 的圖片之後，只要作者一看到圖片，文章就會被刪除了，
  // 可能需要將刪除的方法改成 post 來避免此問題
  app.post('/topic/:tid/delete', topic.delete);

  // 保存新建的文章
  // TODO: 如果创建文章的过程太长，导致session过期，界面的内容会丢失
  // FIXME: 采用前端来判断，不通过跳转的形式来解决
  app.post('/topic/create', auth.signinRequired, limit.postInterval, topic.put);
  app.post('/topic/:tid/edit', topic.update);
  app.post('/topic/collect', auth.userRequired, topic.collect);
  app.post('/topic/de_collect', auth.userRequired, topic.de_collect);

  // reply
  // 回复
  app.get('/reply/:reply_id/edit', reply.showEdit);
  app.post('/:topic_id/reply', auth.userRequired, limit.postInterval, reply.add);
  app.post('/:topic_id/reply2', auth.userRequired, limit.postInterval, reply.add_reply2);
  app.post('/reply/:reply_id/edit', reply.update);
  app.post('/reply/:reply_id/delete', reply.delete);

  // upload
  app.post('/upload/image', upload.uploadImage);

  // tools
  app.get('/site_tools', tools.run_site_tools);


  // site status
  app.get('/status', status.status);


};

var express = require('express');
var router = express.Router();
var adminRouter =  require('./admin');
var blogRouter = require('./blog');


router.use('/admin',adminRouter);

router.use('/blog', blogRouter);

router.get('/', function(req, res) {
    res.render('home');
});

router.get('/chat', function(req, res) {
    res.render('chat')
})

module.exports = router;
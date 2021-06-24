var express = require('express');
var router = express.Router();

var post_md = require('../models/post');

router.get('/', function(req, res) {
    // res.render('test/test', {data: {
    //     name: 'Linh',
    //     age: 20,
    //     add: 'Hà Nội'}});

    var data= post_md.getAllPost();
    // console.log(data);
    data.then(function(posts) {
        var results = {
            posts: posts,
            error: false,
        };
        // console.log(results.posts);
        res.render('blog/index', {data: results}); 
            
        }).catch(function(err) {
            var results = {
                error: 'Could not get posts data'
            }
            res.render('blog/index', {error}); 
        })

});

router.get('/post/:id', function(req, res) {
    var data = post_md.getPostById(req.params.id);

    data.then(function(posts) {
        var post = posts[0];
        // console.log(post);
        var result = {
            post: post,
            error: false
        };
        res.render('blog/post', {data:result});
        // res.render('test/test2', {data:result});
    }).catch(function(err) {
        var result = {
            error: 'Could not get post detail'
        };
        res.render('blog/post', {data:result});
    });
});

router.get('/about', function(req, res) {
    res.render('blog/about');
})

module.exports = router;
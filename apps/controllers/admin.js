var express = require('express');
var router = express.Router();

var user_md = require('../models/user');
var post_md = require('../models/post');

var helper = require('../helpers/helper');
const { use } = require('./blog');

router.get('/', function(req, res) {
    if(req.session.user) {
        // res.send('ADMIN PAGE');
        var data = post_md.getAllPost();
        // console.log(data);
        data.then(function(posts) {
            var data = {
                posts: posts,
                error: false,
            };
            // console.log(data.posts.length);
            res.render('admin/dashboard', { data });
            // res.json(data.posts)
        }) .catch(function(err) {
            res.render('admin/dashboard', { data: {error: 'Get post data is Error' } })
        });
    } else {
        res.redirect('/admin/login');
    }
    
    
});
// router.get('/', function(req, res) {
//     // res.send('ADMIN PAGE');
//     res.render('admin/testlayout', { data: {error: false}});
// });

router.get('/signup', function(req, res) {
    res.render('signup', { data: {a: 'bc'}});
});

router.post('/signup', function(req, res) {
    var user = req.body;

    if(user.email.trim().length == 0){
        res.render('signup', {data: {error: 'Email is required'}});
    }
    if(user.passwd != user.repasswd && user.passwd.trim().length != 0){
        res.render('signup', {data: {error: 'Password is not Match'}});
    }

    // Insert to db 
    var password = helper.hash_password(user.passwd);
    user = {
        email: user.email,
        password: password,
        first_name: user.firstname,
        last_name: user.lastname,
    };

    // console.log(user.password);

    var result = user_md.addUser(user);

    result.then(function(data){
        res.redirect('/login');
    }).catch(function(err) {
        res.render('signup', {data: {error: 'error'}});
    })

    // if(!result) {
    //     res.render('admin/signup', {data: {error: 'Could not insert user data to DB'}});
    // } else {
    //     res.json({message:'Insert success'});
    // }


});

router.get('/login', function(req, res) {
    res.render('login', { data: {} });
})

router.post('/login', function(req, res) {
    var params = req.body;

    if(params.email.trim().length == 0) {
        res.render('login',{ data: {error: 'Please enter an email'} });
    } else {
        var data = user_md.getUserByEmail(params.email);
        //console.log(data[0]);
        if (data) {
            data.then(function(users) {
                var user = users[0];
                // console.log(user.password);
                var status = helper.compare_password(params.password, user.password);
                // var status = helper.compare_password(user.password,params.password);

                // console.log(status);
                if(!status) {
                    res.render('login',{ data: {error: 'Password Wrong'} });
                } else {
                    req.session.user = user;
                    // console.log(req.session.user);
                    res.redirect('/admin');
                }
            }).catch(function(err) {
                res.render('login', {data: {error: 'error'}});
            })
        } else {
            res.render('login', { data: { error: "User not exists"}});
        }
    }
});

router.get('/post/new', function(req, res) {
    if(req.session.user) {
        res.render('admin/post/new', {data: {error: false}});
    } else {
        res.redirect('/admin/login');
    }
});

router.post('/post/store', function(req, res) {
    // res.json(req.body)
    // res.render('admin/post/new', {data: {error: false}});
    var now = new Date();
    req.body.created_at = now;
    req.body.updated_at = now;

    if(req.body.title.trim().length == 0) {
        var data = {
            error: 'Please enter a title'
        };
        res.render('admin/post/new', {data: data});
        return;
    }
    // console.log(req.body);

    var params = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        created_at: req.body.created_at,
        updated_at: req.body.updated_at
    }

    var data = post_md.addPost(params);
    // console.log(result)
    data.then(function(result) {
        res.redirect('/admin');
    }) .catch( function(err) {
        var data = {
            error: 'Could not isert post'
        }
        res.render('admin/post/new' , {data: data})
    })
});

router.get('/post/edit/:id', function(req, res) {
    if(req.session.user) {
        var params = req.params;
        var id= params.id;
    
        // res.json(id)
        var data = post_md.getPostById(id);
        
        if(data) {
            data.then(function(posts) {
                var post = posts[0];
                var data = {
                    post: post,
                    error: false
                }
                res.render('admin/post/edit', {data});
                // res.json({data});
            }) .catch(function(err) {
                var data = {
                    error: 'Could not get Post by id'
                }
                res.render('admin/post/edit', {data});
            })
        } else {
            var data = {
                error: 'Could not get Post by id'
            }
            res.render('admin/post/edit', {data});
        } 
    } else {
        res.redirect('/admin/login');
    }
   
});

router.put('/post/edit', function(req, res) {
    var params = req.body;

    var data = post_md.updatePost(params);
    if(!data) {
        res.json({status_code: 500});
    } else {
        data.then(function(result) {
            res.json({status_code: 200});
            // res.redirect('/admin')
        }) .catch(function(err) {
            res.json({status_code: 500});
        })
    }
});

router.delete('/post/delete', function(req, res) {
    var post_id = req.body.id;

    var data = post_md.deletePost(post_id);

    if(!data) {
        res.json({status_code: 500});
    } else {
        data.then(function(result) {
            res.json({status_code: 200});
        }) .catch(function(err) {
            res.json({status_code:500});
        })
    }
});

router.get('/post', function(req, res) {
    if(req.session.user) {
        res.redirect('/admin');
    } else {
        res.redirect('/admin/login');
    }
    
})

router.get('/user', function(req, res) {
    if(req.session.user) {
        // res.send('user')
        var data = user_md.getAllUsers();

        data.then(function(users) {
            var data = {
                users: users,
                error: false
            };
            res.render('admin/user/user', {data});
        }) . catch(function(err) {
            res.render('admin/user/user', {data: {error: 'Get user is Error'}});
        });
    } else {
        res.redirect('/admin/login');
    }
})

module.exports = router;
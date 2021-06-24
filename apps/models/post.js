var q =  require('q');
var db= require('../common/database');

var conn = db.getConnection();

function getAllPost(){
    var defer = q.defer();

    var query = conn.query('Select * from posts', function(err, result){
        if(err) {
            defer.reject(err); 
        } else {
            defer.resolve(result);
            // console.log(result);
        }
    });
    return defer.promise;
}

function addPost(data){
    var defer = q.defer();
    if(data) {
        var query = conn.query('INSERT INTO posts SET ?', data, function(err, result) {
            if(err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
                // console.log(result);
            }
    });
    return defer.promise;
    }
    return false;
    
}

function getPostById(id) {
    var defer = q.defer();
    if(id) {
        var query = conn.query('Select * from posts where ?', {id}, function(err, result) {
            if(err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

function updatePost(params) {
    if(params) {
        var defer = q.defer();
        
        var query = conn.query('Update posts SET title = ?, content = ?, author = ?, updated_at = ? Where id = ?', [params.title, params.content, params.author, new Date(), params.id], function(err, result){
            if(err){
                defer.reject(err);
            } else{
                defer.resolve(result);
            }
        });
        return defer.promise;
    }

    return false;
}

function deletePost(id) {
    if(id) {
        var defer = q.defer();
        // var query = conn.query('Delete From posts Where id = ? ', [id], function(err, result) {
        var query = conn.query('Delete From posts Where ? ', {id}, function(err, result) {
            if(err) {
                defer.reject(err);
            } else {
                defer.resolve(result);
            }
        });
        return defer.promise;
    }
    return false;
}

module.exports = { getAllPost, addPost, getPostById, updatePost, deletePost };
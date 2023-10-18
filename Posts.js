var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    titulo:String, 
    imagem:String,
    categoria:String,
    conteudo:String,
    slug:String,
    autor:String,   
    views:Number,
    
},{collection:'posts'});


var Post = mongoose.model('Post',PostSchema);


module.exports = Post;
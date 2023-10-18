const express = require('express');
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const Posts = require('./Posts.js');

mongoose.set('strictQuery', false);



// Conexão com o banco de dados
mongoose.connect("mongodb+srv://root:i3Ic9iWBlinhDuMK@cluster0.ohmfsac.mongodb.net/dankicode?retryWrites=true&w=majority", { usenewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Conectado ao banco de dados');
    })

    .catch((err) => {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    });

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));


app.get('/', (req, res) => {

    if (req.query.search == null) {
        mongoose.Query = Posts.find({}).sort({ "_id": -1 }).exec((err, posts) => {
            if (err) {
                console.log(err);
            } else {
                console.log(posts[0]);
                posts = posts.map((val) => {
                    return {
                        titulo: val.titulo,
                        slug: val.slug,
                        conteudo: val.conteudo,
                        decricaoCurta: val.conteudo.substring(0, 100),
                        decricaoMedia: val.conteudo.substring(0, 300),
                        decricaoMuitocurta: val.conteudo.substring(0, 90),
                        imagem: val.imagem,
                        categoria: val.categoria

                    }
                })
                res.render('home', { posts: posts });
            }
        });

    } else {
        res.render('busca', {});

    }


});


app.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    console.log(slug);

    try {
        // Encontre o documento com base no slug
        const filter = { slug };
        const update = { $inc: { views: 1 } };

        const existingPost = await Posts.findOneAndUpdate(filter, update, { new: true });

        if (!existingPost) {
            console.log('Documento não encontrado');
            // Lide com o caso em que o documento não foi encontrado
            // Redirecione ou envie uma resposta apropriada
        } else {
            console.log('Documento atualizado com sucesso:', existingPost);
            res.render('single', {});
        }
    } catch (err) {
        console.error(err);
        // Lide com o erro de forma adequada
        // Envie uma resposta de erro ou redirecione, conforme necessário
    }
});







app.listen(3001, () => {
    console.log('server rodando!');
})  
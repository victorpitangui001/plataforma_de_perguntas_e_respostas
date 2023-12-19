const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require("./db/database");
const Perguntas = require('./model/Perguntas');
const Resposta = require("./model/Resposta");

connection.authenticate()
    .then(() => {
        console.log("Conexao feita com o banco de dados!")
    })
    .catch((err) => {
        console.log(err)
    });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    Perguntas.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        });
    });

});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao
    Perguntas.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/')
    });
});


app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    Perguntas.findOne({
        where: { id: id }
    }).then(pergunta => {
        if (pergunta != undefined) {
            Resposta.findAll({
                where: { perguntaId: pergunta.id },
                order: [['id', 'DESC']]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                })
            });
        } else {
            res.redirect("/");
        }
    });
});

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId)
    })
})

app.listen(3000, () => {
    console.log("App rodando com sucesso")
})

const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.send("bem vindo")
});

app.listen(3000, () => {
    console.log("App rodando com sucesso!")
});

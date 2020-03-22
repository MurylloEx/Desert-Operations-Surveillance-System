// Importações 
const express = require("express");
const mysql = require("mysql");
const app = express();
const path = require('path');
const colors = require('colors');
const serveIndex = require("serve-index");

app.use(express.json());
app.use("/", serveIndex(path.join(__dirname, "public"), {icons: true}));
app.use("/", express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    console.log("-->> -----");
    console.log("-->> -----");
    console.log("-->> ------");
    console.log(req.body);  
    next();
});

app.post('/api/secret', (req, res) => {
    console.log(req.body)
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.listen(80, ()=>{
    console.log("O server está rodando...")
});
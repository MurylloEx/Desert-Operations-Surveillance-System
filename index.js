// Importações 
const express = require("express");
const mysql = require("mysql");
const app = express();
const path = require('path');
const colors = require('colors');
const serveIndex = require("serve-index");

//Abre a conexão com o nosso banco de dados DbProject.
var mysql_connection = mysql.createConnection({
    host:       '192.168.0.107',
    port:       3306,
    user:       'muryllo',
    password:   'es2020',
    database:   'DbProject'
});

//Torna disponível o consumo de requisições do tipo JSON no servidor.
//Para ler o JSON enviado por uma requisição, basta usar req.body.
app.use(express.json());

console.log(mysql_connection);
//Função que salvará todos os dados recebidos dos jogadores sendo espionados.
function SaveSurveillanceData(data){
    console.log(data);
    //mysql_connection.query("", function(error, results, fields){    });
}


//Rota que será utilizada para enviar os dados do servidor da UPE para o mainframe (muryllo.com.br).
//Dúvidas, consultar esquema do servidor
app.post('/api/secret/:token', (req, res) => {
    console.log(`Remote host attempting to connect and send data by secret api.`.red);
    console.log(`Checking received data from proxy server upeserver.zapto.org.`.yellow);
    //Permite o acesso à api secreta se o token enviado for igual ao definido abaixo.
    if (req.params.token.toLowerCase() == "6b695447b09098d54c50610b01b06224"){
        //Permite o acesso somente se o host remoto tiver o endereço de IP 200.196.181.164.
        if (req.ip.includes("200.196.181.164", 0) == true){
            console.log(`Access granted to upeserver.zapto.org.`.green);
            SaveSurveillanceData(req.body);
            res.status(200).end();
        }
        else{
            console.log(`Access denied to remote host: ${req.ip.red}`.yellow);
            res.status(403).end();
        }
    }
    else{
        console.log(`Access denied to remote host: ${req.ip.red}`.yellow);
        res.status(403).end();
    }
});


//Exibe os dados referente a todas as conexão feitas ao servidor.
//O endereço de IP do usuário conectado, o cabeçalho de agente de usuário e
//a url sendo visualizada também são armazenados no log.
app.use((req, res, next) => {
    console.log(`-->> Client connected. Remote IP Address: ${req.ip}`.yellow);
    console.log(`-->> Header User-Agent: ${req.headers["user-agent"]}`.yellow);
    console.log(`-->> Url: ${req.url}`.red);
    next();
});


//Torna a exibição de arquivos disponível no nosso servidor NodeJS.
app.use("/", serveIndex(path.join(__dirname, "public"), {icons: true}));
app.use("/", express.static(path.join(__dirname, "public")));


//Define o diretório padrão das views e o motor de renderização, nesse caso EJS.
//EJS (Embbed JavaScript).
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


//Inicia o servidor na porta 80 (padrão http).
//Pode ser acessada usando www.muryllo.com.br
app.listen(80, () => {
    console.log(`\n\n--->> Server started and running on port 80.`.yellow);
    console.log(`--->> Go to www.muryllo.com.br and see it.`.red);
});
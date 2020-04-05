// Importações 
const express = require("express");         //Biblioteca do express para criar o servidor http.
const mariadb = require("mariadb");         //Conector do MariaDB.
const path = require('path');               //Biblioteca utilizada para realizar concateção de diretórios, etc.
const colors = require('colors');           //Biblioteca utilizada para colorir as saídas do console.log().
const serveIndex = require("serve-index");  //Biblioteca utilizada para exibir os arquivos do servidor.
const bodyParser = require('body-parser');

//Cria uma instância do Express.
const app = express();

//Cria um pool de conexões com o nosso banco de dados DbProject.
var mariadb_pool = mariadb.createPool({
     host:       'localhost',    //Endereço de IP do banco de dados (nesse caso localhost).
     port:       3306,           //Porta do banco de dados (padrão é 3306 para MySql e MariaDB).
     user:       'muryllo',      //Nome do usuário de banco de dados.
     password:   '',       //Senha do usuário de banco de dados.
     database:   'DbProject',    //Nome do banco de dados.
     connectionLimit: 16         //Número máximo de conexões simultâneas ao banco de dados.
});


//Torna disponível o consumo de requisições do tipo JSON no servidor.
//Para ler o JSON enviado por uma requisição, basta usar req.body.
app.use(express.json());


//Função que salvará todos os dados recebidos dos jogadores sendo espionados.
function SaveSurveillanceData(data){
    //Abre a conexão com o banco de dados.
    let OnConnect = function(dbConn){
        //Objeto da conexão de banco de dados.
        console.log(dbConn);

        //Dados recebidos do servidor upeserver.zapto.org
        console.log(data);

        //Fecha a conexão com o banco de dados.
        dbConn.end();
    }
    let OnError = function(dbError){
        //Imprime o erro caso não consiga conectar ao banco de dados.
        console.log(dbError);
    }
    //Obtém uma nova conexão de forma assíncrona.
    mariadb_pool.getConnection().then(OnConnect).catch(OnError);
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
            //SaveSurveillanceData é a função que armazena os dados recebidos de upeserver.zapto.org
            //no nosso banco de dados.
            SaveSurveillanceData(req.body);
            console.log(req.body)
            //Retorna status 200 que significa OK!
            res.status(200).end();
        }
        else{
            console.log(`Access denied to remote host: ${req.ip.red}`.yellow);
            //Retorna o statuys 403 que significa Forbidden ou Proibido.
            res.status(403).end();
        }
    }
    else{
        console.log(`Access denied to remote host: ${req.ip.red}`.yellow);
        //Retorna o statuys 403 que significa Forbidden ou Proibido.
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
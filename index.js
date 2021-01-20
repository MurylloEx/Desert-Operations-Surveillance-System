const colors = require('colors');
const express = require('express');
const { DesertOperations, DesertSession, DesertServer } = require('desert-operations');
const { Worker } = require('./workers');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var Jobs = [];

app.post('/api/jobs/create', (req, res) => {
  if (req.query.pass != 'P@s5w0rd')
    return res.status(403).end();
  //try{
    console.log('[+] Creating a new Worker...'.green);
    let { 
      UserHash, UserLandId, ServerCode, 
      WorldId, BeginRank, EndRank 
    } = req.body;
    let session = new DesertSession(UserHash, UserLandId);
    let server = new DesertServer(ServerCode);
    let api = new DesertOperations(session, server, WorldId);
    Jobs.push(new Worker(session, Number(BeginRank), Number(EndRank), api));
    console.log('[+] Worker running with success. Job attached to current worker stack.'.green);
    return res.status(201).end();
  //} catch(e){
  //  console.log('[!] Error while creating new Job: '.red + e.message);
  //  return res.status(500).end();
  //}
  
});

app.listen(80);
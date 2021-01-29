const router = require('express').Router();
const { DesertOperations, DesertSession, DesertServer } = require('desert-operations');
const { Worker } = require('../workers');

var Jobs = [];

router.post('/api/jobs/create', (req, res) => {
  if (req.query.pass != 'P@s5w0rd')
    return res.status(403).end();
  try{
    console.log('[+] Creating a new Worker...'.green);
    let { 
      UserHash, UserLandId, ServerCode, 
      WorldId, BeginRank, EndRank 
    } = req.body;
    let session = new DesertSession(UserHash, UserLandId);
    let server = new DesertServer(ServerCode);
    let api = new DesertOperations(session, server, WorldId);
    Jobs.push(new Worker(session, Number(BeginRank), Number(EndRank), api));
    console.log('[+] Worker with id {'.green + (Jobs.length-1) + '} running with success.'.green);
    return res.status(201).json({ worker_id: Jobs.length-1 });
  } catch(e){
    console.log('[!] Error while creating new Job: '.red + e.message);
    return res.status(500).end();
  }
});

router.delete('/api/jobs/delete/:id', (req, res) => {
  if (!Number.isInteger(req.params.id) && (req.params.id != 0))
    return res.status(400).end();
  if (!Jobs[Number(req.params.id)])
    return res.status(404).end();
  Jobs[Number(req.params.id)].kill();
  delete Jobs[Number(req.params.id)];
  console.log('[-] Worker with id {'.red + req.params.id + '} killed with success.'.red);
  return res.status(200).end();
});

module.exports = {
  WorkerRouter: router
};
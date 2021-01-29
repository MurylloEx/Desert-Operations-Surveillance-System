const { DesertPlayer } = require("desert-operations/client/new");
const colors = require('colors');
const md5 = require('md5');

class Worker {
  
  constructor(doSession, beginRank, endRank, desertApi) {
    this.Session = doSession;
    this.Limits = { Begin: beginRank, End: endRank };
    this.DesertAPI = desertApi;
    this.HashTable = {};
    this.SignalExit = false;
    this.run();
  }

  run(){
    async function task(wkPtr) {
      if (wkPtr.SignalExit){
        wkPtr.SignalExit = false;
        return;
      }
      console.time('[!] Task duration'.yellow);
      let users = await wkPtr.DesertAPI.FindUsersFromPointRanking(wkPtr.Limits.Begin, wkPtr.Limits.End);
      let players = users.map((user) => { return new DesertPlayer(user, wkPtr.Session); });
      let n = (players.length - (players.length % 10)) / 10;
      for (let k = 0; k < n; k++){
        await Promise.all(players.slice(10*k, 10*(k+1)).map((player) => { return player.load(); }));
      }
      await Promise.all(players.slice(-(players.length % 10)));
      if (wkPtr.SignalExit){
        wkPtr.SignalExit = false;
        return;
      }
      console.timeEnd('[!] Task duration'.yellow);
      wkPtr.finish(players);
      setTimeout(task, 1 * 20 * 10 ** 3, wkPtr);
    }
    task(this);
  }

  kill(){
    this.SignalExit = true;
  }
  
  /**
   * @param {DesertPlayer[]} players 
   */
  finish(players){
    let timestamp = +new Date / 1000 | 0;
    for (let k = 0; k < players.length; k++){
      let hash = md5(players[k].Name);
      if (!this.HashTable[hash]){
        this.HashTable[hash] = JSON.parse(players[k].Json);
        this.HashTable[hash].Info.Battles.List = [];
        this.HashTable[hash].Info.LastAccessTimestamp = 0;
      } else {
        let playerObj = JSON.parse(players[k].Json);
        let oldPlayerObj = this.HashTable[hash];
        if (playerObj.Status.IsOnline)
          oldPlayerObj.Info.LastAccessTimestamp = timestamp;
        playerObj.Info.LastAccessTimestamp = oldPlayerObj.Info.LastAccessTimestamp;
        playerObj.Info.Battles.List = oldPlayerObj.Info.Battles.List;
        let varVictories = Number(playerObj.Info.Battles.Victories) - Number(oldPlayerObj.Info.Battles.Victories);
        let varDefeats = Number(playerObj.Info.Battles.Defeats) - Number(oldPlayerObj.Info.Battles.Defeats);
        if ((varVictories > 0) || (varDefeats > 0)){
          playerObj.Info.Battles.List.push({
            Timestamp: timestamp,
            Victories: varVictories,
            Defeats: varDefeats,
            HasAtLeastOneVictory: varVictories > 0,
            HasAtLeastOneDefeat: varDefeats > 0
          });
        }
        this.HashTable[hash] = playerObj;
        this.action(playerObj);
      }
    }
  }

  /**
   * @param {Object} player 
   */
  action(player){
    let vulnerable = false;
    if (player.Info.Battles.List.length > 0){
      vulnerable = player.Info.Battles.List.filter((battle) => {
        return (battle.Timestamp > player.Info.LastAccessTimestamp) && battle.HasAtLeastOneDefeat && !battle.HasAtLeastOneVictory;
      }).length > 0;
    }
    if (vulnerable){
      console.log('[+] Player: ' + player.Info.Name + ' [VULNERABLE]')
      for (let k = 0; k < player.Info.Battles.List.length; k++){
        let battles = player.Info.Battles.List[k];
        console.log('      Victories: ' + battles.Victories + ' | Defeats: ' + battles.Defeats + ' Time: ' + (new Date(battles.Timestamp * 1000)).toLocaleString());
      }
    }
  }

}


module.exports = {
  Worker
};
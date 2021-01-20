const { DesertPlayer } = require("desert-operations/client/new");
const colors = require('colors');

class Worker {
  
  constructor(doSession, beginRank, endRank, desertApi) {
    this.Session = doSession;
    this.Limits = { Begin: beginRank, End: endRank };
    this.DesertAPI = desertApi;
    this.Table = [];
    this.run();
  }

  run(){
    async function task(wkPtr) {
      console.time('[!] Task duration'.yellow);
      let users = await wkPtr.DesertAPI.FindUsersFromPointRanking(wkPtr.Limits.Begin, wkPtr.Limits.End);
      let players = users.map((user) => { return new DesertPlayer(user, wkPtr.Session); });
      let n = (players.length - (players.length % 10)) / 10;
      for (let k = 0; k < n; k++){
        await Promise.all(players.slice(10*k, 10*(k+1)).map((player) => { return player.load(); }));
      }
      await Promise.all(players.slice(-(players.length % 10)));
      console.timeEnd('[!] Task duration'.yellow);
      wkPtr.finish(players);
      setTimeout(task, 1 * 20 * 10 ** 3, wkPtr);
    }
    task(this);
  }

  /**
   * @param {DesertPlayer[]} players 
   */
  finish(players){
    //TODO
    console.log(players[0].Json)
    for (let k = 0; k < players.length; k++){

    }
  }

}


module.exports = {
  Worker
};
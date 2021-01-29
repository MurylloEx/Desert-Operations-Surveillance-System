const $ = require('cheerio');
const filters = require('./lib/filters');
const requests = require('./lib/requests');
const useragent = require('random-useragent');

class DesertSession {

  constructor(thisUsersHash, thisUsersLandId) {
    this.thisUsersHash = thisUsersHash;
    this.thisUsersLandId = thisUsersLandId;
    this.userAgent = useragent.getRandom();
  }

  get UserHash() { return this.thisUsersHash; }
  get UserLandId() { return this.thisUsersLandId; }
  get UserCookies() { return `thisUsersHash=${this.thisUsersHash}; thisUsersLandId=${this.thisUsersLandId};`; }
  get UserAgent() { return this.userAgent; }

}

class DesertServer {

  constructor(serverCode){
    this.serverAddress = 'https://' + serverCode + '.gamigo.com/';
  }

  get ServerAddress(){ return this.serverAddress; }

}

class DesertOperations {

  constructor(doSession, doServer, worldId){
    this.Session = doSession;
    this.WebServer = doServer;
    this.WorldId = worldId;
  }

  async FindUsersFromPointRanking(beginRank, endRank){
    try {
      let result = await requests.GET(
        this.WebServer.ServerAddress + this.WorldId + 
        `/highscore.php?mode=1&von=${beginRank-1}&end=${endRank}`, 
        { 'Cookie': this.Session.UserCookies, 'User-Agent': this.Session.UserAgent }
      );

      if (!result.success)
        return false;
      
      let $$ = $.load(result.data);
      let rankEntries = $$('#highscore-data-table > tbody > tr');
      let players = [];

      for (let k = 0; k < rankEntries.length; k++){
        let player = $(rankEntries[k]);

        let StatusImg = $($(player.find('td')[2]).find('a > img'));
        let StatusDiv = $($(player.find('td')[2]).find('a > div'));

        let New = {
          IsOnline: StatusDiv.length > 0 ? StatusDiv.hasClass('online-status') : false,
          IsBlocked: StatusDiv.length > 0 ? StatusDiv.hasClass('lasso-i-locked') : false,
          IsHoliday: StatusImg.length > 0 ? StatusImg.attr('src').includes('weather_sun.png') : false
        };

        let Old = {
          IsOnline: StatusImg.length > 0 ? StatusImg.attr('src').includes('bullet_green.png') : false,
          IsBlocked: StatusImg.length > 0 ? StatusImg.attr('src').includes('lock.png') : false,
          IsHoliday: StatusImg.length > 0 ? StatusImg.attr('src').includes('weather_sun.png') : false
        };

        players.push({
          PointsRanking: $(player.find('td')[0]).text().trim(),
          BattlesRanking: $(player.find('td')[1]).text().trim(),
          PlayerName: $($(player.find('td')[2]).find('a')).text().trim(),
          ProfileUrl: this.WebServer.ServerAddress + this.WorldId + '/' + $($(player.find('td')[2]).find('a')).attr('href'),
          IsOnline: Old.IsOnline || New.IsOnline,
          IsBlocked: Old.IsBlocked || New.IsBlocked,
          IsHoliday: Old.IsHoliday || New.IsHoliday,
          AllyName: $(player.find('td')[3]).text().trim(),
          AllyUrl: $(player.find('td')[3]).find('a').length > 0 ? this.WebServer.ServerAddress + this.WorldId + '/' + $($(player.find('td')[3]).find('a')).attr('href') : null,
          RankPoints: $($(player.find('td')[4]).find('span')).attr('data').trim()
        });
      }

      return players;
    } catch (e) {
      return false;
    }
  }

  async FindUsersFromBattleRanking(beginRank, endRank){
    try {
      return false;
    } catch (e) {
      return false;
    }
  }

  async FindAlliesFromAllyRanking(beginRank, endRank){
    try {
      return false;
    } catch (e) {
      return false;
    }
  }

}

module.exports = {
  DesertSession,
  DesertServer,
  DesertOperations
};
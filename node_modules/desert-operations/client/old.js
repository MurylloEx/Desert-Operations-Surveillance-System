const $ = require('cheerio');
const requests = require('../lib/requests');

class DesertPlayer {

  constructor(data, doSession) {
    this.Player = data || {};
    this.Session = doSession;
  }

  async load(profileUrl) {
    try {
      let result = await requests.GET(this.Player.ProfileUrl || profileUrl, {
        'Cookie': this.Session.UserCookies,
        'User-Agent': this.Session.UserAgent
      });
      this.Player = result.data;
      this.parser = $.load(result.data);
      return result.success;
    } catch (e) {
      return false;
    }
  }

  get PointsRanking() {
    try {
      if (this.Player.PointsRanking)
        return this.Player.PointsRanking;
      return this.parser("#hsRanks > h1").text().replace(/[^0-9\-]/g, '');
    } catch (e) {
      return false;
    }
  }

  get BattlesRanking() {
    try {
      if (this.Player.BattlesRanking)
        return this.Player.BattlesRanking;
      return this.parser("#hsRanks > h2").text().replace(/[^0-9\-]/g, '');
    } catch (e) {
      return false;
    }
  }

  get Name() {
    try {
      if (this.Player.PlayerName)
        return this.Player.PlayerName;
      return this.parser('h1.main.blockHead').text().trim();
    } catch (e) {
      return false;
    }
  }

  get AllyName() {
    try {
      if (this.Player.AllyName)
        return this.Player.AllyName;
      return $($(this.parser("table.userDetails > tbody > tr")[9])
        .find('td')[1]).text().trim();
    } catch (e) {
      return false;
    }
  }

  get Email() {
    try {
      return $(this.parser("table.userDetails > tbody > tr")[1])
        .find('a').attr('href').replace('mailto:', '').trim();
    } catch (e) {
      return false;
    }
  }

  get BattlePoints() {
    try {
      let table = this.parser("table.userDetails > tbody > tr");
      let rankSection = table[table.length - 2];
      return this.parser(this.parser(rankSection).find('td > span')[1]).attr('data');
    } catch (e) {
      return false;
    }
  }

  get RankPoints() {
    try {
      if (this.Player.AllyName)
        return this.Player.AllyName;
      let table = this.parser("table.userDetails > tbody > tr");
      let rankSection = table[table.length - 2];
      return this.parser(this.parser(rankSection).find('td > span')[0]).attr('data');
    } catch (e) {
      return false;
    }
  }

  get CountryName() {
    try {
      return $($(this.parser("table.userDetails > tbody > tr")[5])
        .find('td')[1]).text().trim();
    } catch (e) {
      return false;
    }
  }

  get Coordinates() {
    try {
      return $($(this.parser("table.userDetails > tbody > tr")[6])
        .find('td')[1]).text().trim();
    } catch (e) {
      return false;
    }
  }

  get WonBattles() {
    try {
      return $($(this.parser("table.userDetails > tbody > tr")[7])
        .find('td')[1]).text().trim().split(' ')[0];
    } catch (e) {
      return false;
    }
  }

  get LostBattles() {
    try {
      return $($(this.parser("table.userDetails > tbody > tr")[8])
        .find('td')[1]).text().trim().split(' ')[0];
    } catch (e) {
      return false;
    }
  }

  get IsAttackable() {
    try {
      return this.parser('#basePanelIconSmallAttack').hasClass('active');
    } catch (e) {
      return false;
    }
  }

  get IsEspionable() {
    try {
      return this.parser('#basePanelIconSmallSpy').hasClass('active');
    } catch (e) {
      return false;
    }
  }

  get IsOnline() {
    try {
      if (this.Player.IsOnline)
        return this.Player.IsOnline;
      let img = this.parser('h1.main.blockHead > img');
      return (img.length > 0 ? img.attr('src').includes('bullet_green.png') : false);
    } catch (e) {
      return false;
    }
  }

  get IsBlocked() {
    try {
      if (this.Player.IsBlocked)
        return this.Player.IsBlocked;
      let img = this.parser('h1.main.blockHead > img');
      return (img.length > 0 ? img.attr('src').includes('lock.png') : false);
    } catch (e) {
      return false;
    }
  }

  get IsHoliday() {
    try {
      if (this.Player.IsHoliday)
        return this.Player.IsHoliday;
      let img = this.parser('h1.main.blockHead > img');
      return (img.length > 0 ? img.attr('src').includes('weather_sun.png') : false);
    } catch (e) {
      return false;
    }
  }

  get Factories() {
    try {
      return $($(this.parser("table.userDetails > tbody > tr")[12 + this.parser("table.oldUsernames").length])
        .find('td > span')).attr('data');
    } catch (e) {
      return false;
    }
  }

  get Mines() {
    try {
      return $($(this.parser("table.userDetails > tbody > tr")[13 + this.parser("table.oldUsernames").length])
        .find('td > span')).attr('data');
    } catch (e) {
      return false;
    }
  }

  get Refineries() {
    try {
      return $($(this.parser("table.userDetails > tbody > tr")[14 + this.parser("table.oldUsernames").length])
        .find('td > span')).attr('data');
    } catch (e) {
      return false;
    }
  }

  get Loot() {
    try {
      let table = this.parser("table.userDetails > tbody > tr");
      let rankSection = table[table.length - 3];
      return this.parser(this.parser(rankSection).find('td')[1]).text().trim().replace(/[^0-9]/g, '');
    } catch (e) {
      return false;
    }
  }

}

module.exports = {
  DesertPlayer: DesertPlayer
};
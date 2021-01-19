const $ = require('cheerio');
const requests = require('../lib/requests');

class DesertPlayer {

  constructor(data, doSession) {
    this.Player = data || {};
    this.Session = doSession;
  }

  async load(profileUrl) {
    let result = await requests.GET(this.Player.ProfileUrl || profileUrl, {
      'Cookie': this.Session.UserCookies,
      'User-Agent': this.Session.UserAgent
    });
    if (!result.success)
      throw new Error('Failed to get user data.');
    this.Player = result.data;
    this.parser = $.load(result.data);
  }

  get PointsRanking() {
    try {
      return this.parser("#hsRanks > h1").text().replace(/[^0-9\-]/g, '');
    } catch (e) {
      return false;
    }
  }

  get BattlesRanking() {
    try {
      return this.parser("#hsRanks > h2").text().replace(/[^0-9\-]/g, '');
    } catch (e) {
      return false;
    }
  }

  get Name() {
    try {
      return this.parser('h1.main.blockHead').text().trim();
    } catch (e) {
      return false;
    }
  }

  get AllyName() {
    try {
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
      let img = this.parser('h1.main.blockHead > img');
      return (img.length > 0 ? img.attr('src').includes('bullet_green.png') : false);
    } catch (e) {
      return false;
    }
  }

  get IsBlocked() {
    try {
      let img = this.parser('h1.main.blockHead > img');
      return (img.length > 0 ? img.attr('src').includes('lock.png') : false);
    } catch (e) {
      return false;
    }
  }

  get IsHoliday() {
    try {
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
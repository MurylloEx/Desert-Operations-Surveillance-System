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
      let UserInfoItems = this.parser("#fxc-container > div.content section.user-info-building-container > section.user-information > div.user-info > div.item");
      let HasOldNames = $(UserInfoItems[1]).hasClass('indent');
      let IdxIncOffset = 0;
      if (HasOldNames) {
        IdxIncOffset++;
        for (let k = 1; k < UserInfoItems.length; k++) {
          if (!$(UserInfoItems[k]).hasClass('indent'))
            break;
          IdxIncOffset++;
        }
      }
      this.IdxIncOffset = IdxIncOffset;
      this.EdxIncOffset = (new RegExp(/\d{1,2}\.\d{1,2}\.\d{2,4}/g)).test($($(UserInfoItems[IdxIncOffset+2]).find('span')[1]).text().trim()) ? 1 : 0;
      return result.success;
    } catch (e) {
      return false;
    }
  }

  get PointsRanking() {
    try {
      if (this.Player.PointsRanking)
        return this.Player.PointsRanking;
      return this.parser("div.sub-headline > div.rank-info > span").text().replace(/[^0-9\-]/g, '');
    } catch (e) {
      return false;
    }
  }

  get BattlesRanking() {
    try {
      if (this.Player.BattlesRanking)
        return this.Player.BattlesRanking;
      return this.parser("div.sub-headline > div.battle-rank-info > span").text().replace(/[^0-9\-]/g, '');
    } catch (e) {
      return false;
    }
  }

  get Name() {
    try {
      if (this.Player.PlayerName)
        return this.Player.PlayerName;
      return this.parser('div.sub-headline > div.user').text().trim();
    } catch (e) {
      return false;
    }
  }

  get AllyName() {
    try {
      if (this.Player.AllyName)
        return this.Player.AllyName;
      return $($(this.parser("#fxc-container > div.content section.user-info-building-container > section.user-information > div.user-info > div.item")[this.IdxIncOffset+this.EdxIncOffset+6])
      .find('span')[1]).find('a').text().trim();
    } catch (e) {
      return false;
    }
  }

  get Email() {
    try {
      return $($(this.parser("#fxc-container > div.content section.user-info-building-container > section.user-information > div.user-info > div.item")[this.IdxIncOffset+this.EdxIncOffset+4])
      .find('span')[1]).find('a').attr('href').replace('mailto:', '').trim();
    } catch (e) {
      return false;
    }
  }

  get BattlePoints() {
    try {
      return $($(this.parser("#fxc-container > div.content > section.user-info-building-container > section.building-information > div.building-info > div.item")
      .slice(-1)[0]).find('span > span')).attr('data');
    } catch (e) {
      return false;
    }
  }

  get RankPoints() {
    try {
      if (this.Player.RankPoints)
        return this.Player.RankPoints;
      return $($(this.parser("#fxc-container > div.content > section.user-info-building-container > section.building-information > div.building-info > div.item")
      .slice(-2)[0]).find('span > span')).attr('data');
    } catch (e) {
      return false;
    }
  }

  get CountryName() {
    try {
      return $($(this.parser("#fxc-container > div.content section.user-info-building-container > section.user-information > div.user-info > div.item")[this.IdxIncOffset])
      .find('span')[1]).text().trim();
    } catch (e) {
      return false;
    }
  }

  get Coordinates() {
    try {
      return $($(this.parser("#fxc-container > div.content section.user-info-building-container > section.user-information > div.user-info > div.item")[this.IdxIncOffset+1])
      .find('span')[1]).text().trim();
    } catch (e) {
      return false;
    }
  }

  get WonBattles() {
    try {
      return $($(this.parser("#fxc-container > div.content section.user-info-building-container > section.user-information > div.user-info > div.item")[this.IdxIncOffset+this.EdxIncOffset+2])
      .find('span')[1]).text().trim().split(' ')[0];
    } catch (e) {
      return false;
    }
  }

  get LostBattles() {
    try {
      return $($(this.parser("#fxc-container > div.content section.user-info-building-container > section.user-information > div.user-info > div.item")[this.IdxIncOffset+this.EdxIncOffset+3])
      .find('span')[1]).text().trim().split(' ')[0];
    } catch (e) {
      return false;
    }
  }

  get IsAttackable() {
    try {
      return !this.parser('div.sub-headline > div.action-buttons > a.basePanelIconSmallAttack').hasClass('disabled');
    } catch (e) {
      return false;
    }
  }

  get IsEspionable() {
    try {
      return !this.parser('div.sub-headline > div.action-buttons > a.basePanelIconSmallSpy').hasClass('disabled');
    } catch (e) {
      return false;
    }
  }

  get IsOnline() {
    try {
      if (this.Player.IsOnline)
        return this.Player.IsOnline;
      let StatusDiv = $(this.parser('div.sub-headline > div.user > div')[0]);
      let StatusImg = $(this.parser('div.sub-headline > div.user > img'));
      let New = {
        IsOnline: StatusDiv.length > 0 ? StatusDiv.hasClass('online-status') : false
      };
      let Old = {
        IsOnline: StatusImg.length > 0 ? StatusImg.attr('src').includes('bullet_green.png') : false
      };
      return New.IsOnline || Old.IsOnline;
    } catch (e) {
      return false;
    }
  }

  get IsBlocked() {
    try {
      if (this.Player.IsBlocked)
        return this.Player.IsBlocked;
      let StatusDiv = $(this.parser('div.sub-headline > div.user > div')[0]);
      let StatusImg = $(this.parser('div.sub-headline > div.user > img'));
      let New = {
        IsBlocked: StatusDiv.length > 0 ? StatusDiv.hasClass('lasso-i-locked') : false
      };
      let Old = {
        IsBlocked: StatusImg.length > 0 ? StatusImg.attr('src').includes('lock.png') : false
      };
      return New.IsBlocked || Old.IsBlocked;
    } catch (e) {
      return false;
    }
  }

  get IsHoliday() {
    try {
      if (this.Player.IsHoliday)
        return this.Player.IsHoliday;
      let StatusDiv = $(this.parser('div.sub-headline > div.user > div')[0]);
      let StatusImg = $(this.parser('div.sub-headline > div.user > img'));
      let New = {
        IsHoliday: StatusImg.length > 0 ? StatusImg.attr('src').includes('weather_sun.png') : false
      };
      let Old = {
        IsHoliday: StatusImg.length > 0 ? StatusImg.attr('src').includes('weather_sun.png') : false
      };
      return New.IsHoliday || Old.IsHoliday;
    } catch (e) {
      return false;
    }
  }

  get Factories() {
    try {
      return $($(this.parser("#fxc-container > div.content > section.user-info-building-container > section.building-information > div.building-info > div.item")[0]).find('span > span')).attr('data');
    } catch (e) {
      return false;
    }
  }

  get Mines() {
    try {
      return $($(this.parser("#fxc-container > div.content > section.user-info-building-container > section.building-information > div.building-info > div.item")[1]).find('span > span')).attr('data');
    } catch (e) {
      return false;
    }
  }

  get Refineries() {
    try {
      return $($(this.parser("#fxc-container > div.content > section.user-info-building-container > section.building-information > div.building-info > div.item")[2]).find('span > span')).attr('data');
    } catch (e) {
      return false;
    }
  }

  get Loot() {
    try {
      return $($(this.parser("#fxc-container > div.content > section.user-info-building-container > section.building-information > div.building-info > div.item").slice(-3)[0]).find('span')[1]).text().trim().replace(/[^0-9]/g, '');
    } catch (e) {
      return false;
    }
  }

  get Json(){
    return JSON.stringify({
      Info: {
        Name: this.Name,
        Email: this.Email,
        CountryName: this.CountryName,
        Coordinates: this.Coordinates,
        Ally: {
          Name: this.AllyName
        },
        Actions: {
          IsAttackable: this.IsAttackable,
          IsEspionable: this.IsEspionable
        },
        Battles: {
          Victories: this.WonBattles,
          Defeats: this.LostBattles
        }
      },
      Ranking: {
        BattlesRanking: this.BattlesRanking,
        BattlePoints: this.BattlePoints,
        PointsRanking: this.PointsRanking,
        RankPoints: this.RankPoints
      },
      Status: {
        IsHoliday: this.IsHoliday,
        IsOnline: this.IsOnline,
        IsBlocked: this.IsBlocked
      },
      Buildings: {
        Factories: this.Factories,
        Mines: this.Mines,
        Refineries: this.Refineries,
        Loot: this.Loot
      }
    });
  }

}

module.exports = {
  DesertPlayer: DesertPlayer
};
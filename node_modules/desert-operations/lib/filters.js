module.exports = {
  UserHash: new RegExp(/^[0-9a-fA-F]{32}$/g),
  UserLandId: new RegExp(/^\d{1,9}$/g),
  ServerCode: new RegExp(/^[a-z]{2,3}\-[a-z]{2,3}$/g),
  WorldId: new RegExp(/^world\d{1,2}/ig)
}
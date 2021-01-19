const { DesertSession, DesertServer, DesertOperations } = require('desert-operations');
const { DesertPlayer } = require('desert-operations/client/new');

(async () => {
    //User Hash Cookie: e.g.: f6d4c3682b75fb061b42c1547123190e
    //Land ID Cookie: e.g.: 443762
    let session = new DesertSession('your-user-hash', 'your-land-id');

    //Server subdomain: e.g.: br-do, ti-ti, de-de, es-es
    //Found in: *.gamigo.com
    let server = new DesertServer('your-do-server');

    //e.g.: world1, world2, world12, world8
    //Found in: *.gamigo.com/{your-world-id}
    let desertApi = new DesertOperations(session, server, 'your-world-id');

    //Will retrieve and print all players beginning at rank 1 and ending at rank 50.
    let firstfifty = await desertApi.FindUsersFromPointRanking(1, 50);

    //Will print the object array containing the first fifty players of rank.
    console.log(firstfifty);

    //If you want more detailed response.
    //The following will detail the first player.
    let player = new DesertPlayer(firstfifty[0], session);

    //Load profile data before reading details.
    await player.load();

    //Print all data of that player.
    console.log(player.Json);
})();
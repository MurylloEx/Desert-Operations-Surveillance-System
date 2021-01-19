<p align="center"><img src="https://user-images.githubusercontent.com/32225687/104828809-d9838a00-584b-11eb-944d-ebbef64bdfe0.png"/></p>
<h1 align="center">Desert Operations API</h1>
<p align="center">Esse simples wrapper para as APIs do Desert Operation ajuda você a conseguir alguns dados do jogo sem fazer um web scrap por si próprio.</p>

<p align="center">
    <img src="https://badgen.net/npm/v/desert-operations"/> 
    <img src="https://badgen.net/npm/dt/desert-operations"/>
    <img src="https://badgen.net/npm/license/desert-operations"/>
    <img src="https://badgen.net/npm/types/desert-operations"/>
    <img src="https://badgen.net/badge/author/MurylloEx/red?icon=label"/>
</p>

## Instalação

```sh
npm install desert-operations
```

## Exemplos de uso

```> INDEX.JS```
```javascript
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
```

## Metadados

Muryllo Pimenta de Oliveira – muryllo.pimenta@upe.br

Distribuído sobre a licença MIT. Veja ``LICENSE`` para mais informações.

## Contribuição

1. Fork it (<https://github.com/MurylloEx/Desert-Operations-API/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request


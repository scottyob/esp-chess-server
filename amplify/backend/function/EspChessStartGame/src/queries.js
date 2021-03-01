module.exports = {
    getPlayer: `query getPlayer($id: ID!) {
        getPlayer(id: $id) {
            id
            game {
                id
            }
        }
    }
    `,
    createGame: `mutation createGame($blackId: ID!, $whiteId: ID!) {
        createGame(input: {
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            gameBlackPlayerId: $blackId,
            gameWhitePlayerId: $whiteId
        }) {
            id
        }
    }
    `,
    linkPlayer: `mutation updatePlayer($playerId: ID!, $gameId: ID!) {
      updatePlayer(input: {id: $playerId, holding: null, playerGameId: $gameId}) {
      	id
      }
    }
    `
}

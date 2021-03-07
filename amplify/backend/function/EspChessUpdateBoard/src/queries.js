module.exports = {
  getPlayer: `query getPlayer($id: ID!) {
        getPlayer(id: $id) {
            id
            holding
            game {
              id
              fen
              pgn
              blackPlayer {
                id
              }
              whitePlayer {
                id
              }
            }
          }
        }
    `,
  updateHolding: `mutation updateHolding($id: ID!, $holding: String) {
      updatePlayer(input: {id: $id, holding: $holding}) {
        id
      }
    }
    `,
  updateFen: `mutation updateFen($id: ID!, $fen: String!, $pgn: String!) {
      updateGame(input: {id: $id, fen: $fen, pgn: $pgn}) {
        id
      }
    }
    `
}

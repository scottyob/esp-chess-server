module.exports = {
  mutation: `mutation leaveGame($id:ID!) {
      updatePlayer(input: {id: $id, playerGameId: null}) {
        id
      }
    }
    `
}

module.exports = {
  mutation: `mutation createPlayer($name:ID!) {
      createPlayer(input: {id: $name}) {
        id
      }
    }
    `
}

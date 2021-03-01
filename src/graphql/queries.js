/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const setup = /* GraphQL */ `
  query Setup {
    setup {
      thingName
      awsCertCa
      awsCertPrivate
      awsCertCrt
    }
  }
`;
export const addUser = /* GraphQL */ `
  query AddUser {
    addUser
  }
`;
export const startGame = /* GraphQL */ `
  query StartGame($opponent: String) {
    startGame(opponent: $opponent)
  }
`;
export const listGames = /* GraphQL */ `
  query ListGames(
    $filter: ModelGameFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGames(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        fen
        createdAt
        updatedAt
        blackPlayer {
          id
          holding
          createdAt
          updatedAt
        }
        whitePlayer {
          id
          holding
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
export const getGame = /* GraphQL */ `
  query GetGame($id: ID!) {
    getGame(id: $id) {
      id
      fen
      createdAt
      updatedAt
      blackPlayer {
        id
        holding
        createdAt
        updatedAt
        game {
          id
          fen
          createdAt
          updatedAt
        }
      }
      whitePlayer {
        id
        holding
        createdAt
        updatedAt
        game {
          id
          fen
          createdAt
          updatedAt
        }
      }
    }
  }
`;
export const listPlayers = /* GraphQL */ `
  query ListPlayers(
    $filter: ModelPlayerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        holding
        createdAt
        updatedAt
        game {
          id
          fen
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
export const getPlayer = /* GraphQL */ `
  query GetPlayer($id: ID!) {
    getPlayer(id: $id) {
      id
      holding
      createdAt
      updatedAt
      game {
        id
        fen
        createdAt
        updatedAt
        blackPlayer {
          id
          holding
          createdAt
          updatedAt
        }
        whitePlayer {
          id
          holding
          createdAt
          updatedAt
        }
      }
    }
  }
`;

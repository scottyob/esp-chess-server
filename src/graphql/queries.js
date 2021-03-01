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
export const getGame = /* GraphQL */ `
  query GetGame($id: ID!) {
    getGame(id: $id) {
      id
      fen
      createdAt
      updatedAt
      blackPlayer {
        id
        game {
          id
          fen
          createdAt
          updatedAt
        }
        holding
        createdAt
        updatedAt
      }
      whitePlayer {
        id
        game {
          id
          fen
          createdAt
          updatedAt
        }
        holding
        createdAt
        updatedAt
      }
    }
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
export const listPlayers = /* GraphQL */ `
  query ListPlayers(
    $filter: ModelPlayerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        game {
          id
          fen
          createdAt
          updatedAt
        }
        holding
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPlayer = /* GraphQL */ `
  query GetPlayer($id: ID!) {
    getPlayer(id: $id) {
      id
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
      holding
      createdAt
      updatedAt
    }
  }
`;

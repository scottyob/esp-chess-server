/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createGame = /* GraphQL */ `
  mutation CreateGame(
    $input: CreateGameInput!
    $condition: ModelGameConditionInput
  ) {
    createGame(input: $input, condition: $condition) {
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
export const updateGame = /* GraphQL */ `
  mutation UpdateGame(
    $input: UpdateGameInput!
    $condition: ModelGameConditionInput
  ) {
    updateGame(input: $input, condition: $condition) {
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
export const deleteGame = /* GraphQL */ `
  mutation DeleteGame(
    $input: DeleteGameInput!
    $condition: ModelGameConditionInput
  ) {
    deleteGame(input: $input, condition: $condition) {
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
export const createPlayer = /* GraphQL */ `
  mutation CreatePlayer(
    $input: CreatePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    createPlayer(input: $input, condition: $condition) {
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
export const updatePlayer = /* GraphQL */ `
  mutation UpdatePlayer(
    $input: UpdatePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    updatePlayer(input: $input, condition: $condition) {
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
export const deletePlayer = /* GraphQL */ `
  mutation DeletePlayer(
    $input: DeletePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    deletePlayer(input: $input, condition: $condition) {
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

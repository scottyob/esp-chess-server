/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateGame = /* GraphQL */ `
  subscription OnCreateGame {
    onCreateGame {
      id
      fen
      pgn
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
          pgn
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
          pgn
          createdAt
          updatedAt
        }
      }
    }
  }
`;
export const onUpdateGame = /* GraphQL */ `
  subscription OnUpdateGame {
    onUpdateGame {
      id
      fen
      pgn
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
          pgn
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
          pgn
          createdAt
          updatedAt
        }
      }
    }
  }
`;
export const onDeleteGame = /* GraphQL */ `
  subscription OnDeleteGame {
    onDeleteGame {
      id
      fen
      pgn
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
          pgn
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
          pgn
          createdAt
          updatedAt
        }
      }
    }
  }
`;
export const onCreatePlayer = /* GraphQL */ `
  subscription OnCreatePlayer {
    onCreatePlayer {
      id
      holding
      createdAt
      updatedAt
      game {
        id
        fen
        pgn
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
export const onUpdatePlayer = /* GraphQL */ `
  subscription OnUpdatePlayer {
    onUpdatePlayer {
      id
      holding
      createdAt
      updatedAt
      game {
        id
        fen
        pgn
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
export const onDeletePlayer = /* GraphQL */ `
  subscription OnDeletePlayer {
    onDeletePlayer {
      id
      holding
      createdAt
      updatedAt
      game {
        id
        fen
        pgn
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

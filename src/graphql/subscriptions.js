/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateGame = /* GraphQL */ `
  subscription OnCreateGame {
    onCreateGame {
      id
      blackPlayer {
        id
        game {
          id
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      whitePlayer {
        id
        game {
          id
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateGame = /* GraphQL */ `
  subscription OnUpdateGame {
    onUpdateGame {
      id
      blackPlayer {
        id
        game {
          id
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      whitePlayer {
        id
        game {
          id
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteGame = /* GraphQL */ `
  subscription OnDeleteGame {
    onDeleteGame {
      id
      blackPlayer {
        id
        game {
          id
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      whitePlayer {
        id
        game {
          id
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePlayer = /* GraphQL */ `
  subscription OnCreatePlayer {
    onCreatePlayer {
      id
      game {
        id
        blackPlayer {
          id
          createdAt
          updatedAt
        }
        whitePlayer {
          id
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePlayer = /* GraphQL */ `
  subscription OnUpdatePlayer {
    onUpdatePlayer {
      id
      game {
        id
        blackPlayer {
          id
          createdAt
          updatedAt
        }
        whitePlayer {
          id
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePlayer = /* GraphQL */ `
  subscription OnDeletePlayer {
    onDeletePlayer {
      id
      game {
        id
        blackPlayer {
          id
          createdAt
          updatedAt
        }
        whitePlayer {
          id
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;

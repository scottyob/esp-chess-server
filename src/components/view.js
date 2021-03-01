/**
 * Components to view a game of chess
 */
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import Chessboard from "chessboardjsx";
import React, { useEffect, useState } from 'react'
import Loader from "react-loader-spinner";
import { getGame } from '../graphql/queries';

/**
 * Views a game
 */
const GameViewer = (args) => {
    // Load up the game from database
    const [game, setGame] = useState();
    useEffect(async() => {
        var result = await API.graphql(graphqlOperation(getGame, { id: args.id }));
        setGame(result.data.getGame);
    }, [])

    if (game == null) {
        return <div className="viewer-container"><Loader type="Grid" /></div>;
    }

    var squareStyles = {
        "a1": { boxShadow: "inset 0 0 1px 8px rgb(255, 0, 0)" },
        "c1": {
            background: "radial-gradient(circle, #fffc00 10%, transparent 100%)",
            borderRadius: "90%"
        },
    }

    return (
        <div className="viewer-container">
            <div>{game.blackPlayer.id} vs {game.whitePlayer.id}</div>
            <div>
                <Chessboard
                    position={game.fen} 
                    draggable={false}
                    squareStyles={squareStyles}
                    />
                            </div>
        </div>);
}

export { GameViewer }

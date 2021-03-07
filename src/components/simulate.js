/**
 * Components to view a game of chess
 */
import Amplify, { Auth, API, graphqlOperation, PubSub } from 'aws-amplify';
import Chessboard from "chessboardjsx";
import React, { useEffect, useState } from 'react'
import Loader from "react-loader-spinner";
import { getGame } from '../graphql/queries';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import * as subscriptions from '../graphql/subscriptions';


// Apply plugin with configuration
Amplify.addPluggable(new AWSIoTProvider({
    aws_pubsub_region: 'us-west-2',
    aws_pubsub_endpoint: 'wss://a37u0bfoinvf2q-ats.iot.us-west-2.amazonaws.com/mqtt',
}));

// Board colors map
const COLORMAP = {
    1: "red",
    2: "green",
    3: "blue",
    4: "orange",
    5: "lightgreen",
    6: "gold",
}
const OFF = 0;
const RED = 1;
const GREEN = 2;
const BLUE = 3;
const ORAGE = 4;
const LIGHTGREEN = 5;
const GOLD = 6;


/**
 * Views a game
 */
const SimulateViewer = (args) => {
    // Load up the Cognito identity ID to show in simulation info below.
    const [identityId, setIdentityId] = useState();

    // Subscribe to events
    const [pubsubStatus, setPubsubStatus] = useState('ok');

    // Board colors
    const [boardColors, setBoardColors] = useState();
    useEffect(() => {
        // Set the auth
        Auth.currentCredentials().then((info) => {
            const cognitoIdentityId = info.identityId;
            var cmd = "aws iot attach-principal-policy --policy-name 'simulatorIotPolicy' --principal '" + cognitoIdentityId + "'";
            setIdentityId(cmd);
        });

        // Setup pub-sub environment
        PubSub.subscribe('state/devtwo-espchess-scottyob').subscribe({
            next: data => {
                console.log("Got data: ");
                console.log(data.value);
                setBoardColors(data.value.state)
            },
            error: error => {
                console.error(error);
                setPubsubStatus("PubSub error.  Please check attached IoT policy");
            },
            close: () => { setPubsubStatus("Closed") },
        });
    }, []);

    // Load up the game from database
    const [game, setGame] = useState();
    useEffect(async() => {
        var result = await API.graphql(graphqlOperation(getGame, { id: args.id }));
        setGame(result.data.getGame);

        // Subscribe to game updates
        const subscription = API.graphql(
            graphqlOperation(subscriptions.onUpdateGame)
        ).subscribe({
            next: async({ provider, value }) => {
                result = await API.graphql(graphqlOperation(getGame, { id: args.id }));
                setGame(result.data.getGame);
            }
        })
    }, [])

    // Setup the local board state
    const [boardState, setBoardState] = useState([
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
    ]);

    if (game == null) {
        return <div className="viewer-container"><Loader type="Grid" /></div>;
    }

    // Update the chessboard overlays with the board state
    var squareStyles = {};
    if (boardState) {
        // console.log(x, String.fromCharCode('A'.charCodeAt(0) + x));
        for (const y of Array(8).keys()) {
            for (const x of Array(8).keys()) {
                const letter = String.fromCharCode('a'.charCodeAt(0) + x)
                const key = letter + (8 - y);
                squareStyles[key] = {};
                if (boardState[y][x]) {
                    squareStyles[key] = {
                        background: "radial-gradient(circle, #fffc00 10%, transparent 100%)",
                        borderRadius: "90%"
                    };
                }
                if (boardColors != null && boardColors[y][x]) {
                    squareStyles[key]["boxShadow"] = "inset 0 0 1px 8px " + COLORMAP[boardColors[y][x]];
                }
            }
        }
    }

    // Update local board state when we click a square
    const squareClicked = async square => {
        if (boardState == null) {
            return;
        }

        var x = square[0].charCodeAt() - 'a'.charCodeAt();
        var y = 8 - parseInt(square[1]);
        var newState = JSON.parse(JSON.stringify(boardState));
        newState[y][x] = newState[y][x] ? 0 : 1;
        setBoardState(newState);
        //TODO:  Don't hardcode devtwo or username
        console.log({
            "topic": 'update/board/devtwo/devtwo-espchess-scottyob',
            "data": { state: newState }
        });
        await PubSub.publish('update/board/devtwo/devtwo-espchess-scottyob', { state: newState });
    }

    var whitePlayer = "computer";
    var blackPlayer = "computer";
    if (game.whitePlayer) {
        whitePlayer = game.whitePlayer.id;
    }
    if (game.blackPlayer) {
        blackPlayer = game.blackPlayer.id;
    }

    // Render
    return (
        <div className="viewer-container">
            <h1>{whitePlayer} VS {blackPlayer}</h1>
            <div className="board-container">
                <Chessboard
                    position={game.fen} 
                    draggable={false}
                    squareStyles={squareStyles}
                    onSquareClick={squareClicked}
                    />
            </div>
            <div>
                <h2>Simulation Information</h2>
                <div><strong>Identity ID Cmd: </strong>{identityId}</div>
                <div><strong>PubSub Status: </strong>{pubsubStatus}</div>
                <div><strong>FEN: </strong>{game.fen}</div>
                <div><strong>PGN: </strong>{game.pgn}</div>
                <div><strong>ID: </strong>{game.id}</div>
            </div>
        </div>);
}

export { SimulateViewer }

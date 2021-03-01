/**
 * Components to view a game of chess
 */
import Amplify, { Auth, API, graphqlOperation, PubSub } from 'aws-amplify';
import Chessboard from "chessboardjsx";
import React, { useEffect, useState } from 'react'
import Loader from "react-loader-spinner";
import { getGame } from '../graphql/queries';
import { AWSIoTProvider } from '@aws-amplify/pubsub';

// Apply plugin with configuration
Amplify.addPluggable(new AWSIoTProvider({
    aws_pubsub_region: 'us-west-2',
    aws_pubsub_endpoint: 'wss://a37u0bfoinvf2q-ats.iot.us-west-2.amazonaws.com/mqtt',
}));


/**
 * Views a game
 */
const GameViewer = (args) => {
    // Load up the Cognito identity ID to show in simulation info below.
    const [identityId, setIdentityId] = useState();

    // Subscribe to events
    const [pubsubStatus, setPubsubStatus] = useState('ok');
    useEffect(() => {
        // Set the auth
        Auth.currentCredentials().then((info) => {
            const cognitoIdentityId = info.identityId;
            var cmd = "aws iot attach-principal-policy --policy-name 'simulatorIotPolicy' --principal '" + cognitoIdentityId + "'";
            setIdentityId(cmd);
        });

        // Setup pub-sub environment
        PubSub.subscribe('#').subscribe({
            next: data => console.log('Message received', data),
            error: error => {
                console.error(error);
                setPubsubStatus("PubSub error.  Please check attached IoT policy");
            },
            close: () => console.log('Done'),
        });
    }, []);

    // Load up the game from database
    const [game, setGame] = useState();
    useEffect(async() => {
        var result = await API.graphql(graphqlOperation(getGame, { id: args.id }));
        setGame(result.data.getGame);
    }, [])

    if (game == null) {
        return <div className="viewer-container"><Loader type="Grid" /></div>;
    }

    // Setup the game overlay based on game status
    var squareStyles = {
        "a1": { boxShadow: "inset 0 0 1px 8px rgb(255, 0, 0)" },
        "c1": {
            background: "radial-gradient(circle, #fffc00 10%, transparent 100%)",
            borderRadius: "90%",
            boxShadow: "inset 0 0 1px 8px rgb(255, 0, 0)"
        },
    };
    // squareStyles = {};


    // Render
    return (
        <div className="viewer-container">
            <h1>{game.blackPlayer.id} VS {game.whitePlayer.id}</h1>
            <div className="board-container">
                <Chessboard
                    position={game.fen} 
                    draggable={false}
                    squareStyles={squareStyles}
                    />
            </div>
            <div>
                <h2>Simulation Information</h2>
                <div><strong>Identity ID Cmd: </strong>{identityId}</div>
                <div><strong>PubSub Status: </strong>{pubsubStatus}</div>
            </div>
        </div>);
}

export { GameViewer }
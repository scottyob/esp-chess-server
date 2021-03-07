import { API, graphqlOperation } from 'aws-amplify';
import Chessboard from "chessboardjsx";
import { useEffect, useState } from 'react';
import Loader from "react-loader-spinner";
import { getGame } from '../graphql/queries';
import * as subscriptions from '../graphql/subscriptions';
import * as queries from '../graphql/queries';
const Chess = require("chess.js");

const GameViewer = (args) => {

    // Load up the game from database
    const [game, setGame] = useState();
    useEffect(() => {
        async function fetchGame(id) {
            var result = await API.graphql(graphqlOperation(getGame, { id: id }));
            setGame(result.data.getGame);
        }
        fetchGame(args.id);

        // Subscribe to game updates
        API.graphql(
            graphqlOperation(subscriptions.onUpdateGame)
        ).subscribe({
            next: async({ provider, value }) => {
                var result = await API.graphql(graphqlOperation(getGame, { id: args.id }));
                setGame(result.data.getGame);
            }
        });
    }, [args.id]);


    var chessBoard = <Loader type="ThreeDots" color="#00BFFF" height={80} width={80} />;
    var white = "computer";
    var black = "computer";
    var status = <div />;
    var leaveButton = <div />;
    var history = "";


    const leave = () => {
        API.graphql({ query: queries.leaveGame }).then((result) => {
            window.location.replace("/");
        });
    };


    if (game) {
        chessBoard = <Chessboard
                    position={game.fen} 
                    draggable={false}
                    />;

        history = <pre><code>{game.pgn}</code></pre>;

        if (game.whitePlayer) {
            white = game.whitePlayer.id;
        }

        if (game.blackPlayer) {
            black = game.blackPlayer.id;
        }

        // Load up the game and determine the status
        var chess = new Chess(game.fen);
        if (chess.game_over()) {
            status = "Game Over - ";
            if (chess.in_checkmate()) {
                status += "Checkmate";
            }
            else if (chess.in_stalemate()) {
                status += "Stalemate";
            }
        }

        if (
            args.player.game && game.id === args.player.game.id
        ) {
            leaveButton = <button type="button" onClick={leave} class="btn btn-outline-danger">Leave Game</button>;
        }
    }

    return (<main>
      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">{white} <strong>vs</strong> {black}</h1>
          </div>
        </div>
      </section>
      
    <div class="bg-light album">
        <div class="container">
            <div class="row">
                <div class="col-sm">
                    {chessBoard}
                </div>
                <div class="col-sm">
                    <h3>Game History</h3>
                    <div>
                        {history}
                        <div>{status}</div>
                    </div>
                </div>
                <div class="col-sm">
                    <h3>Game Controls</h3>
                    <a href="/list" class="btn btn-outline-info" >View games</a>
                    <br /><br />
                    {leaveButton}
                </div>

            </div>
        </div>
    </div>
      
    </main>);

};

export { GameViewer };

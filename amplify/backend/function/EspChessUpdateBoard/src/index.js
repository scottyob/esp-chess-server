/* Amplify Params - DO NOT EDIT
	API_ESPCHESSSERVER_GRAPHQLAPIENDPOINTOUTPUT
	API_ESPCHESSSERVER_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

var AWS = require('aws-sdk')
const https = require('https');
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_ESPCHESSSERVER_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const queries = require('./queries.js');
const apiKey = process.env.API_ESPCHESSSERVER_GRAPHQLAPIKEYOUTPUT;
const { Chess } = require('chess.js')

var iotdata = new AWS.IotData({ endpoint: 'a37u0bfoinvf2q-ats.iot.us-west-2.amazonaws.com' })


// Color effects
const OFF = 0;
const RED = 1;
const GREEN = 2;
const BLUE = 3;
const ORANGE = 4;
const LIGHTGREEN = 5;
const GOLD = 6;
const WHITE = 7;
const GRAY = 8;

async function doQuery(query, operationName, args) {
    const req = new AWS.HttpRequest(appsyncUrl, region);

    req.method = "POST";
    req.path = "/graphql";
    req.headers.host = endpoint;
    req.headers["Content-Type"] = "application/json";
    req.body = JSON.stringify({
        query: query,
        operationName: operationName,
        variables: args
    });

    if (apiKey) {
        req.headers["x-api-key"] = apiKey;
    }
    else {
        const signer = new AWS.Signers.V4(req, "appsync", true);
        signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
    }

    const data = await new Promise((resolve, reject) => {
        const httpRequest = https.request({ ...req, host: endpoint }, (result) => {
            result.on('data', (data) => {
                resolve(JSON.parse(data.toString()));
            });
        });

        httpRequest.write(req.body);
        httpRequest.end();
    });

    return data;
}

// Modifies a coordinate to a square.
function CoordToSquare(x, y) {
    const col = {
        0: 'a',
        1: 'b',
        2: 'c',
        3: 'd',
        4: 'e',
        5: 'f',
        6: 'g',
        7: 'h',
    }[x];
    return col + (8 - y);
}

// Returns coordinate for square
function SquareToCoord(square) {
    const colMap = {
        'a': 0,
        'b': 1,
        'c': 2,
        'd': 3,
        'e': 4,
        'f': 5,
        'g': 6,
        'h': 7,
    };
    var [col, row] = square;
    return [colMap[col], 8 - parseInt(row)];
}

function BlankGrid() {
    return [
        [OFF, OFF, OFF, OFF, OFF, OFF, OFF, OFF],
        [OFF, OFF, OFF, OFF, OFF, OFF, OFF, OFF],
        [OFF, OFF, OFF, OFF, OFF, OFF, OFF, OFF],
        [OFF, OFF, OFF, OFF, OFF, OFF, OFF, OFF],
        [OFF, OFF, OFF, OFF, OFF, OFF, OFF, OFF],
        [OFF, OFF, OFF, OFF, OFF, OFF, OFF, OFF],
        [OFF, OFF, OFF, OFF, OFF, OFF, OFF, OFF],
        [OFF, OFF, OFF, OFF, OFF, OFF, OFF, OFF],
    ];
}

function GameOverColors(game) {
    var ret = BlankGrid();
    var rows = [0];
    if (game.in_checkmate()) {
        // If black is checkmate, white should be gold
        if (game.turn() == 'b') {
            rows = [7];
        }
    }
    if (game.in_draw()) {
        rows = [0, 7];
    }

    for (const x of Array(8).keys()) {
        rows.forEach(y => {
            ret[y][x] = GOLD;
        })
    }

    // Draw the last move that was made.
    const moves = game.history({ verbose: true });
    const lastMove = moves[moves.length - 1];
    var [x, y] = SquareToCoord(lastMove.from);
    ret[y][x] = GREEN;
    [x, y] = SquareToCoord(lastMove.to);
    ret[y][x] = ORANGE;
    return ret;
}

// Finds the deltas in local, vs remote game state
function FindDeltasColors(state, game) {
    ret = BlankGrid();

    // Check the board state for the previous move. 
    var lastMoveGame = Chess();
    lastMoveGame.load_pgn(game.pgn());
    var lastMove = lastMoveGame.undo();

    if (lastMove !== null && FindDeltas(state, lastMoveGame).length == 0) {
        // Board has not been updated since last move.  Show the move
        var [x, y] = SquareToCoord(lastMove.from);
        ret[y][x] = GREEN;
        [x, y] = SquareToCoord(lastMove.to);
        ret[y][x] = LIGHTGREEN;
        return ret;
    }


    var ret = Array(8)
    for (const y of Array(8).keys()) {
        ret[y] = Array(8)
        for (const x of Array(8).keys()) {
            const coord = CoordToSquare(x, y);
            var boardPopulated = game.get(coord) ? 1 : 0
            ret[y][x] = boardPopulated == state[y][x] ? OFF : RED;
        }
    }
    return ret
}

function FindDeltas(state, game) {
    var deltas = [];
    for (const y of Array(8).keys()) {
        for (const x of Array(8).keys()) {
            const coord = CoordToSquare(x, y);
            var boardPopulated = game.get(coord) ? 1 : 0
            if (boardPopulated != state[y][x]) {
                deltas.push(coord);
            }
        }
    }
    return deltas
}

// Finds the single difference in square between the game state, and local state.
// Throws an exception if there's more than one difference
function FindDeltaSquare(state, game, ignore) {
    var deltaSquare = null;
    for (const y of Array(8).keys()) {
        for (const x of Array(8).keys()) {
            const coord = CoordToSquare(x, y);
            var boardPopulated = game.get(coord) ? 1 : 0
            var statePopulated = state[y][x] ? 1 : 0

            if (coord != ignore && boardPopulated != statePopulated) {
                if (deltaSquare) {
                    throw "Two squares populated: " + coord + ", " + deltaSquare;
                }
                deltaSquare = coord;
            }
        }
    }

    return deltaSquare;
}

async function DoMove(game, player, state) {
    // Show differences in game state
    var deltaColors = FindDeltasColors(state, game);
    const deltas = FindDeltas(state, game);

    // Check if this player is white or black
    var localPlayer = 'w';
    if (!(player.game.whitePlayer.id == player.id)) {
        localPlayer = 'b';
    }

    var ret = BlankGrid(); // Build a blank square to return.

    //ToDo:  Update logic
    if (game.turn() != localPlayer) {
        return deltaColors;
    }

    if (player.holding == null) {
        // Get the square difference
        var deltaSquare = null;
        var holding = player.holding;
        try {
            deltaSquare = FindDeltaSquare(state, game, holding);
            console.log("Delta square is: " + deltaSquare);
        }
        catch (err) {
            console.log(err);
            return deltaColors;
        }


        // No change on board state
        if (deltaSquare == null) {
            return deltaColors;
        }

        //Player has selected a piece they wish to move.
        var possibleMoves = game.moves({ square: deltaSquare, verbose: true });
        console.log("Possible moves are: " + JSON.stringify(possibleMoves))
        if (possibleMoves === undefined || possibleMoves.length == 0) {
            // No possible moves to be made here.  Just highlight some red.
            console.log("No possible moves");
            return deltaColors;
        }

        // Piece we're holding should be green, possible options light green
        holding = deltaSquare;
        var [x, y] = SquareToCoord(holding);
        ret[y][x] = GREEN;
        possibleMoves.forEach(coord => {
            coord = coord.to;
            [x, y] = SquareToCoord(coord)
            ret[y][x] = LIGHTGREEN;
        })

        // Update to flag we're holding a piece.
        var result = await doQuery(queries.updateHolding, "updateHolding", { id: player.id, holding: holding });
        console.log("Holding updated:")
        console.log(result);
        return ret;
    }
    else {
        // Holding a piece.
        var result = await doQuery(queries.updateHolding, "updateHolding", { id: player.id, holding: null });
        console.log("Request to no longer hold: ")
        console.log(result);

        if (deltas.length != 2) {
            // More pieces held than expected
            return deltaColors;
        }
        var otherCoords = deltas.filter(x => x != player.holding);
        if (otherCoords.length != 1) {
            return deltaColors;
        }
        var otherCoord = otherCoords[0];
        game.move({ from: player.holding, to: otherCoord, promotion: 'q' });

        console.log("Debug Players: ");
        console.log(player.game.blackPlayer);
        console.log(player.game.whitePlayer);

        if (player.game.blackPlayer === null || player.game.whitePlayer === null) {
            // TODO:  Remove me, moves for the other player.
            var moves = game.moves();
            const move = moves[Math.floor(Math.random() * moves.length)]
            game.move(move)
        }

        // Log the move
        result = await doQuery(
            queries.updateFen,
            "updateFen", {
                id: player.game.id,
                fen: game.fen(),
                pgn: game.pgn({ max_width: 1 })
            });
        console.log("Update FEN result: ")
        console.log(result);

        deltaColors = FindDeltasColors(state, game);
        return deltaColors;
    }

}

const VERSION = "1.0"
const IMAGE_HOST = "scottyob-pub.s3-us-west-2.amazonaws.com"
const IMAGE_FILENAME = "/espchess-1.0.bin"

exports.handler = async(event, context) => {
    // Find the local players name
    const nameSplit = event.devName.split("-")
    const playerName = nameSplit[nameSplit.length - 1]

    console.log(event);

    // Check if OTA required
    if(event.version != VERSION) {
        return iotdata.publish({
            topic: "state/" + event.devName + "/ota",
            payload: JSON.stringify({
                version: VERSION,
                host: IMAGE_HOST,
                filename: IMAGE_FILENAME
            })
        }).promise();
    }

    // Load up the chess board state
    const responseTopic = 'state/' + event.devName + "/state";
    const player = (await doQuery(queries.getPlayer, "getPlayer", { id: playerName })).data.getPlayer;
    
    if(player.game == null) {
        return iotdata.publish({
            topic: responseTopic,
            payload: JSON.stringify({
                state: [
                    // Treeees
                    [BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, GREEN, BLUE],
                    [BLUE, WHITE, GRAY, BLUE, BLUE, GREEN, LIGHTGREEN, LIGHTGREEN],                    
                    [BLUE, BLUE, BLUE, BLUE, LIGHTGREEN, LIGHTGREEN, GREEN, GREEN],                    
                    [BLUE, BLUE, BLUE, BLUE, GREEN, GREEN, LIGHTGREEN, LIGHTGREEN],                    
                    [BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, GOLD, BLUE],
                    [BLUE, BLUE, BLUE, BLUE, BLUE, BLUE, GOLD, BLUE],
                    [LIGHTGREEN, GREEN, LIGHTGREEN, GREEN, LIGHTGREEN, GREEN, ORANGE, GREEN],
                    [GREEN, LIGHTGREEN, GREEN, LIGHTGREEN, GREEN, LIGHTGREEN, GREEN, LIGHTGREEN],
                    // Default
                    // [OFF,OFF,OFF,OFF,OFF,OFF,OFF,OFF],
                    // [OFF,OFF,OFF,OFF,OFF,OFF,OFF,OFF],
                    // [OFF,OFF,OFF,OFF,OFF,OFF,OFF,OFF],
                    // [OFF,OFF,OFF,OFF,OFF,OFF,OFF,OFF],
                    // [OFF,OFF,OFF,OFF,OFF,OFF,OFF,OFF],
                    // [OFF,OFF,OFF,OFF,OFF,OFF,OFF,OFF],
                    // [OFF,OFF,OFF,OFF,OFF,OFF,OFF,OFF],
                    // [OFF,OFF,OFF,OFF,OFF,OFF,OFF,OFF],
                ],
                message: "\n\n   In\n    Lobby",
                brightness: 255,
                mirror: false
            })
        }).promise();
    }
    
    var game = Chess();
    game.load_pgn(player.game.pgn);

    // Generate the color state to send back
    var state = await DoMove(game, player, event.state);
    
    // Generate the latest game message
    var message = "";
    if(game.turn() == 'w') {
        message += "->";
    } else {
        message += "  ";
    }
    if(player.game.whitePlayer) {
        message += player.game.whitePlayer.id += "\n";
    } else {
        message += "computer\n"
    }
    
    if(game.turn() == 'b') {
        message += "->";
    } else {
        message += "  ";
    }
    if(player.game.blackPlayer) {
        message += player.game.blackPlayer.id += "\n";
    } else {
        message += "computer\n"
    }
    message += "...\n";
    //message += game.history(
    //    { verbose: true }
    //).slice(-4).map(item => item["from"] + " -> " + item["to"]).join("\n");
    message += game.pgn({ max_width: 1 }).split("\n").slice(-4).join("\n");
    
    if (game.game_over()) {
        state = GameOverColors(game);
    }

    // write the response back to the game client.
    var params = {
        topic: responseTopic,
        payload: JSON.stringify(
            {
                state: state,
                message: message,
            }
        ), // Simple echo at the moment
        qos: 0,
    };

    return iotdata.publish(params).promise();
};

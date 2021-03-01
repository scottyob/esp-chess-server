/* Amplify Params - DO NOT EDIT
	API_ESPCHESSSERVER_GRAPHQLAPIENDPOINTOUTPUT
	API_ESPCHESSSERVER_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const https = require('https');
const AWS = require("aws-sdk");
const urlParse = require("url").URL;
const appsyncUrl = process.env.API_ESPCHESSSERVER_GRAPHQLAPIENDPOINTOUTPUT;
const region = process.env.REGION;
const endpoint = new urlParse(appsyncUrl).hostname.toString();
const queries = require('./queries.js');
const apiKey = process.env.API_ESPCHESSSERVER_GRAPHQLAPIKEYOUTPUT;


/**
 * Lambda responsible for setting up a game between a local player and an
 * opponent
 */

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

exports.handler = async(event) => {
	console.log("starting...");
	// Get the local player
	const player = await doQuery(queries.getPlayer, "getPlayer", { id: event.identity.username });
	console.log(JSON.stringify(player));
	if (player.data.getPlayer == null) {
		throw "player not found";
	}
	if (player.data.getPlayer.game != null) {
		throw "player already in game";
	}
	const playerId = player.data.getPlayer.id;

	// Get the opponent player
	const opponent = await doQuery(queries.getPlayer, "getPlayer", { id: event.arguments.opponent });
	console.log(JSON.stringify(opponent));
	if (opponent.data.getPlayer == null) {
		throw "opponent not found";
	}
	if (opponent.data.getPlayer.game != null) {
		throw "opponent already in game";
	}
	const opponentId = opponent.data.getPlayer.id;

	// Create a new game of chess with fresh state
	const game = await doQuery(queries.createGame, "createGame", {
		blackId: opponentId,
		whiteId: playerId,
	});
	const gameId = game.data.createGame.id;
	console.log("Game is: " + JSON.stringify(game));

	// Link both local and opponent player to this game, clearing their
	// local state
	console.log("Linking...");
	console.log(JSON.stringify(await doQuery(queries.linkPlayer, "updatePlayer", { playerId: playerId, gameId: gameId })));
	console.log(JSON.stringify(await doQuery(queries.linkPlayer, "updatePlayer", { playerId: opponentId, gameId: gameId })));

	// Return the ID of the game created
	return game.data.createGame.id;

};

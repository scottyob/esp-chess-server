# ESP-Chess Server

This is the server component for the [ESP Chess](https://github.com/scottyob/esp-chess) project.  The board is designed to be super light weight and palm off all of the processing to this server side service.

ESP-Chess server is written on [Amplify](https://aws.amazon.com/amplify/) and makes use of AWS serverless components to provide the interface.

If you want to develop on the project, quickest way is to setup this [Cloud9 container](https://hub.docker.com/r/linuxserver/cloud9) and run setup.sh.

## Schema
**Game** Represents a game between two players.  If no player is set, that is considered an AI player

**Player** holds the game that player is currently playing, as well as current local state that deviates that board from that stored in the game.  For example.  If the player has picked up a piece, that piece will be stored in "holding".  If the player is in a "holding" state, we can determine where they're moving that piece too, or what piece they're taking if another piece is removed from the board.

## Technology
The game board is stored in [chess.js](https://github.com/jhlywa/chess.js)

## Interfacing AWS IoT
AWS IoT is used for providing an MQTT interface for a Players chess board, and the game they're playing.  AWS IoT does need to be setup with the appropirate permissions and events to feed back into this server component.

At some point I'll get around to documenting how to setup the AWS IoT stack to interface with this game service.
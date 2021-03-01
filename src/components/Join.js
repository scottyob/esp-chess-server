import { Auth, API, graphqlOperation } from 'aws-amplify'
import { listPlayers, getPlayer, addUser } from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';
import React, { useEffect, useState } from 'react'
import Loader from "react-loader-spinner";
import { PlayerSelect } from './playerSelect.js'


const Join = () => {
  // Store the local user
  const [player, setPlayer] = useState();
  const [players, setPlayers] = useState(<Loader type="Grid" />);

  useEffect(() => {
    Auth.currentUserInfo().then(async user => {
      // Attempt to look up the current player
      var dbPlayer = await API.graphql(graphqlOperation(getPlayer, { id: user.username }));
      if (!dbPlayer.data.getPlayer) {
        // Player is not yet setup.  Better set it up.
        await API.graphql({ query: queries.addUser })

        // Re-Fetch player
        dbPlayer = await API.graphql(graphqlOperation(getPlayer, { id: user.username }));
      }
      setPlayer(dbPlayer);

      // Load the players list.
      const dbPlayers = await API.graphql(graphqlOperation(listPlayers));
      const playersList = dbPlayers.data.listPlayers.items.map(p => <PlayerSelect key={p.id} player={p} localPlayer={dbPlayer} />)
      setPlayers(
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          {playersList}
        </div>
      );
    })
  }, []);


  return (
    <main>

  <section class="py-5 text-center container">
    <div class="row py-lg-5">
      <div class="col-lg-6 col-md-8 mx-auto">
        <h1 class="fw-light">Start Game</h1>
        <p class="lead text-muted">You are not yet currently in a game.  You may select a player below to start a game with, or perhaps an AI character if that is more your style.  Happy Chessing</p>
      </div>
    </div>
  </section>


  <div class="album py-5 bg-light">
    <div class="container">
      {players}
    </div>
  </div>


  <div class="album py-5 bg-light">
    <div class="container">
      <h3>AI Players</h3>
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        <div class="col">
          <div class="card shadow-sm">
            <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Avatar" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">Avatar</text></svg>
            <div class="card-body">
              <p class="card-text"><strong>Rando:</strong>  A random AI character that has no skill, but does know the rules of the game!  Rando's wins are pure luck</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" class="btn btn-sm btn-outline-secondary">Play</button>
                </div>
                <small class="text-muted">Online</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


</main>)

}

export { Join }

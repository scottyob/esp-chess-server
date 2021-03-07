import { Auth, API, graphqlOperation } from 'aws-amplify'
import { listPlayers, getPlayer, addUser } from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import * as queries from '../graphql/queries';
import React, { useEffect, useState } from 'react'
import Loader from "react-loader-spinner";
import { PlayerSelect } from './playerSelect.js'
import { startGame } from '../graphql/queries';


async function beginAI(remoteId) {
  const id = await API.graphql(graphqlOperation(startGame, { opponent: null }))
  console.log("Started game: ");
  console.log(id);

  // Redirect to home
  window.location.assign("/");
}


const ListGames = (args) => {
  // Store the local user
  const [players, setPlayers] = useState(<Loader type="Grid" />);

  useEffect(() => {
    Auth.currentUserInfo().then(async user => {
      // Load the players list.
      const dbPlayers = await API.graphql(graphqlOperation(listPlayers));
      const playersList = dbPlayers.data.listPlayers.items.map(p => <PlayerSelect key={p.id} player={p} localPlayer={args.player} />)
      setPlayers(
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          {playersList}
        </div>
      );
    })
  }, []);


  return (
    <main>

  <section className="py-5 text-center container">
    <div className="row py-lg-5">
      <div className="col-lg-6 col-md-8 mx-auto">
        <h1 className="fw-light">Start Game</h1>
        <p className="lead text-muted">You are not yet currently in a game.  You may select a player below to start a game with, or perhaps an AI character if that is more your style.  Happy Chessing</p>
      </div>
    </div>
  </section>


  <div className="album py-5 bg-light">
    <div className="container">
      {players}
    </div>
  </div>


  <div className="album py-5 bg-light">
    <div className="container">
      <h3>AI Players</h3>
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
        <div className="col">
          <div className="card shadow-sm">
            <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Avatar" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">Avatar</text></svg>
            <div className="card-body">
              <p className="card-text"><strong>Rando:</strong>  A random AI character that has no skill, but does know the rules of the game!  Rando's wins are pure luck</p>
              <div className="d-flex justify-content-between align-items-center">
                <div className="btn-group">
                  <button type="button" onClick={beginAI} className="btn btn-sm btn-outline-secondary">Play</button>
                </div>
                <small className="text-muted">Online</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


</main>)

}

export { ListGames }

import logo from './logo.svg';
import './App.css';
import { withAuthenticator } from '@aws-amplify/ui-react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
}
from "react-router-dom";

import * as queries from './graphql/queries';
import { ListGames } from './components/listGames.js';
import { GameViewer } from './components/view.js';
import React, { useEffect, useState } from 'react'
import { getPlayer } from './graphql/queries';
import Loader from "react-loader-spinner";

import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';

const axios = require('axios')

Amplify.configure(awsconfig);

async function logout(e) {
  await Auth.signOut();
}


function App() {
  const [player, setPlayer] = useState();

  useEffect(() => {
    Auth.currentUserInfo().then(async user => {
      var dbPlayer = await API.graphql(graphqlOperation(getPlayer, { id: user.username }));
      if (!dbPlayer.data.getPlayer) {
        // Player is not yet setup.  Better set it up.
        await API.graphql({ query: queries.addUser })

        // Re-Fetch player
        dbPlayer = await API.graphql(graphqlOperation(getPlayer, { id: user.username }));
      }
      setPlayer(dbPlayer.data.getPlayer);
    });

  }, []);

  console.log("Player:");
  console.log(player);

  // Show loading
  if (player == null) {
    return (<div className="centerContainer">
      <div className="centered">
        <Loader type="Grid" />
      </div>
    </div>);
  }

  var content = null;
  // If not in a game, show the join game
  const listGames = <ListGames player={player}/>;
  if (player.game == null) {
    content = listGames;
  }
  else {
    content = <GameViewer id={player.game.id} />;
  }


  return (<div className="App full-height">
      <Router>
        <Switch>
          <Route path="/setup/:ip">
            <Setup />
          </Route>
          <Route path="/list">
            {listGames}
          </Route>
          <Route path="/">
            {content}
          </Route>
        </Switch>
      </Router>
    
    <a href="/" onClick={logout}>Logout</a>
    
  </div>);
}


function Setup() {
  let { ip } = useParams();

  const [status, setStatus] = useState([]);

  useEffect(() => {
    status.push(<p key="hostname">Getting Certs... </p>);
    setStatus([...status]);

    // API call to generate new sets of keys.
    API.graphql({ query: queries.setup }).then((result) => {
      var args = '?device_name=' + encodeURIComponent(result.data.setup.thingName);
      args += "&" + "aws_cert_ca=" + encodeURIComponent(result.data.setup.awsCertCa);
      args += "&" + "aws_cert_crt=" + encodeURIComponent(result.data.setup.awsCertCrt);
      args += "&" + "aws_cert_private=" + encodeURIComponent(result.data.setup.awsCertPrivate);

      setStatus([...status, <p key="link"><a href={'http://' + ip + '/setup' + args}>Click HERE to push cert to device</a></p>])
    });
  }, []);

  return (
    <div>
      <h2>Device Setup</h2>
      {status}
    </div>
  );
}

export default withAuthenticator(App);

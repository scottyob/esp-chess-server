import logo from './logo.svg';
import './App.css';
import { withAuthenticator } from '@aws-amplify/ui-react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

import * as queries from './graphql/queries';
import { API } from 'aws-amplify';
import React, { useEffect, useState } from 'react'

import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

function App() {
  return (<div className="App">
    <header className="App-header">
      <Router>
        <Switch>
          <Route path="/setup/:ip">
            <Setup />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    
    </header>
  </div>);
}



const Home = () => {

  const [msg, setMsg] = useState("");
  useEffect(() => {
    fetchMsg()
  }, [])
  
  async function fetchMsg() {
    // const result = await API.graphql({query: queries.setup, variables: { msg: 'from client'}});
    const result = await API.graphql({query: queries.setup});
    debugger;
    // var data = JSON.parse(result.data.echo);
    setMsg(JSON.stringify(result.data));
  }
  
  return (<div><h2>Home sweet home - {msg}</h2></div>);
}

function Setup() {
  let { ip } = useParams();
  
  return <h2>Setup Callback {ip}</h2>;
}

export default withAuthenticator(App);

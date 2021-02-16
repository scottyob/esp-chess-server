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
import { API } from 'aws-amplify';
import React, { useEffect, useState } from 'react'

import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';

const axios = require('axios')

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

    // const result = await API.graphql({query: queries.setup});
    // debugger;
    // // var data = JSON.parse(result.data.echo);
    // setMsg(JSON.stringify(result.data));
  }

  return (<div><h2>Home sweet home - {msg}</h2></div>);
}

function Setup() {
  let { ip } = useParams();

  const [status, setStatus] = useState([]);

  useEffect(() => {
    status.push(<p key="hostname">Getting Certs... </p>);
    setStatus([...status]);
    
    // API call to generate new sets of keys.
    API.graphql({query: queries.setup}).then((result) => {
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

  return <h2>Setup Callback {ip}</h2>;
}

export default withAuthenticator(App);
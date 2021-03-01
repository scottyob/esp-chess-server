import * as queries from '../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import { startGame } from '../graphql/queries';

async function beginGame(remoteId) {
  const id = await API.graphql(graphqlOperation(startGame, { opponent: remoteId }))
  console.log("Started game: ");
  console.log(id);

  // Redirect to home
  window.location.assign("/");
}


const PlayerSelect = (args) => {

  var btn = null;
  if (args.player.game) {
    btn = <button type="button" className="btn btn-sm btn-outline-secondary">Watch</button>;
  }
  else {
    btn = <button onClick={() => beginGame(args.player.id)} type="button" className="btn btn-sm btn-outline-secondary">Play</button>;
  }

  return (
    <div className="col">
          <div className="card shadow-sm">
            <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Avatar" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">Avatar</text></svg>
            <div className="card-body">
              <p className="card-text">{args.player.id}</p>
              <div className="d-flex justify-content-between align-items-center">
                <div className="btn-group">
                  {btn}
                </div>
                <small className="text-muted"><strong>Last Seen:</strong> Unknown</small>
              </div>
            </div>
          </div>
        </div>
  );
}

export { PlayerSelect }

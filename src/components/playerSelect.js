const PlayerSelect = (args) => {

  return (
    <div class="col">
          <div class="card shadow-sm">
            <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Avatar" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em">Avatar</text></svg>
            <div class="card-body">
              <p class="card-text">{args.player.id}</p>
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group">
                  <button type="button" class="btn btn-sm btn-outline-secondary">Play</button>
                </div>
                <small class="text-muted"><strong>Last Seen:</strong> Unknown</small>
              </div>
            </div>
          </div>
        </div>
  );
}

export { PlayerSelect }

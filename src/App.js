import './App.css';
import { useState } from 'react';

function App() {
  const [tracks, setTracks] = useState([]);

  const getTracks = async () => {
    try {
      const response = await fetch(
        "https://v1.nocodeapi.com/anjalisinggh/spotify/nBAzDKrrccuAcVSe/search?q=arjit&type=track"
      );
      const data = await response.json();

      console.log("Full Response:", data);

      const trackItems = data?.tracks?.items || [];
      setTracks(trackItems);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Vibra</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <button className="btn btn-primary mb-4" onClick={getTracks}>
          Get My Top Tracks
        </button>

        <div className="row">
          {tracks.map((track) => (
            <div className="col-md-4 mb-4" key={track.id}>
              <div className="card h-100">
                <img
                  src={track.album?.images?.[0]?.url}
                  className="card-img-top"
                  alt={track.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{track.name}</h5>
                  <p className="card-text">
                    {track.artists?.[0]?.name || "Unknown Artist"}
                  </p>
                  {track.external_urls?.spotify && (
                    <a
                      href={track.external_urls.spotify}
                      className="btn btn-success"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Listen on Spotify
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;

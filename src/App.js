import './App.css';
import { useState, useRef } from 'react';

function App() {
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const audioRefs = useRef({});

  const fetchTracks = async (query = 'arjit') => {
    try {
      const response = await fetch(
        `https://v1.nocodeapi.com/anjalisinggh/spotify/nBAzDKrrccuAcVSe/search?q=${query}&type=track`
      );
      const data = await response.json();
      const trackItems = data?.tracks?.items || [];
      setTracks(trackItems);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTracks(searchQuery);
  };

  const handleOpenModal = (track) => {
    setCurrentTrack(track);
    setShowModal(true);
  };

  const handleSubmitMessage = () => {
    console.log(`Anonymous message for ${currentTrack.name}: ${message}`);
    setMessage('');
    setShowModal(false);
  };

  const handlePlay = (id) => {
    Object.keys(audioRefs.current).forEach((key) => {
      if (key !== id && audioRefs.current[key]) {
        audioRefs.current[key].pause();
      }
    });
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
            <form className="d-flex py-2 w-100" role="search" onSubmit={handleSearchSubmit}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="container-fluid mt-4">
        <button className="btn btn-primary mb-4" onClick={() => fetchTracks()}>
          Get My Top Tracks
        </button>

        <div className="row">
          {tracks.map((track) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4" key={track.id}>
              <div className="card h-100 shadow-sm" style={{ borderRadius: '12px' }}>
                <img
                  src={track.album?.images?.[0]?.url}
                  className="card-img-top"
                  alt={track.name}
                  style={{ height: '180px', objectFit: 'cover', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
                />
                <div className="card-body p-3">
                  <h5 className="card-title" style={{ fontSize: '1rem' }}>{track.name}</h5>
                  <p className="card-text" style={{ fontSize: '0.9rem' }}>{track.artists?.[0]?.name || 'Unknown Artist'}</p>
                  {track.preview_url ? (
                    <audio
                      controls
                      src={track.preview_url}
                      className="w-100 mb-2"
                      ref={(el) => (audioRefs.current[track.id] = el)}
                      onPlay={() => handlePlay(track.id)}
                    />
                  ) : (
                    <p className="text-muted">No preview available</p>
                  )}
                  <button
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => handleOpenModal(track)}
                  >
                    Leave Anonymous Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Message for: {currentTrack.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your anonymous message..."
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmitMessage}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;

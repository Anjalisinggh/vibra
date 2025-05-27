import './App.css';
import { useState, useRef, useEffect } from 'react';

function App() {
  const [tracks, setTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isGrid, setIsGrid] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const audioRefs = useRef({});

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

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
      <nav className={`navbar navbar-expand-lg ${darkMode ? 'bg-dark navbar-dark' : 'bg-light'}`}>
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Vibra</a>
          <div className="d-flex align-items-center gap-2 ms-auto">
            <button className="btn btn-outline-secondary" onClick={() => setIsGrid(!isGrid)}>
              {isGrid ? 'List View' : 'Grid View'}
            </button>
            <button className="btn btn-outline-secondary" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <form className="d-flex mb-3" onSubmit={handleSearchSubmit}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-secondary" type="submit">Search</button>
        </form>

        <button className="btn btn-secondary mb-4" onClick={() => fetchTracks()}>
          Get My Top Tracks
        </button>

        <div className={`row ${isGrid ? 'grid-view' : 'list-view'}`}>
          {tracks.map((track) => (
            <div className={`col-md-${isGrid ? 4 : 12} mb-4`} key={track.id}>
              <div className="card h-100 track-card p-2">
                <img
                  src={track.album?.images?.[0]?.url}
                  className="card-img-top"
                  alt={track.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{track.name}</h5>
                  <p className="card-text">{track.artists?.[0]?.name || 'Unknown Artist'}</p>
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
                  <button className="btn btn-outline-dark" onClick={() => handleOpenModal(track)}>
                    Leave Anonymous Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Message for: {currentTrack.name}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
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
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSubmitMessage}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;

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

  useEffect(() => {
    fetchTracks(); // Load default tracks
  }, []);

  const fetchTracks = async (query = 'arijit') => {
    try {
      const res = await fetch(`https://saavn.dev/api/search/songs?query=${query}`);
      const data = await res.json();
      const songs = data.data?.results || [];
      setTracks(songs);
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
          <img src="/vibra-note.svg" alt="Logo" className="navbar-brand-logo" />
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
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-secondary" type="submit">Search</button>
        </form>

        <div className={`row ${isGrid ? 'grid-view' : 'list-view'}`}>
          {tracks.map((track, index) => {
            const audioUrl = track.downloadUrl?.at(-1)?.url; // pick highest quality
            const imageUrl = track.image?.[2]?.url || track.image?.[0]?.url;
            const trackId = track.id || `track-${index}`;

            return (
              <div className={`col-md-${isGrid ? 4 : 12} mb-4`} key={trackId}>
                <div className="card h-100 track-card p-2">
                  <img src={imageUrl} className="card-img-top" alt={track.name} />
                  <div className="card-body">
                    <h5 className="card-title">{track.name}</h5>
                    <p className="card-text">{track.primaryArtists}</p>
                    {audioUrl ? (
                      <audio
                        controls
                        src={audioUrl}
                        className="w-100 mb-2"
                        ref={(el) => (audioRefs.current[trackId] = el)}
                        onPlay={() => handlePlay(trackId)}
                      />
                    ) : (
                      <iframe
                        src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(track.name + ' ' + track.primaryArtists)}`}
                        width="100%"
                        height="200"
                        frameBorder="0"
                        allow="autoplay"
                        title={track.name}
                      />
                    )}
                    <button className="btn btn-outline-dark mt-2" onClick={() => handleOpenModal(track)}>
                      Leave Anonymous Message
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && currentTrack && (
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

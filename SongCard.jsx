// SongCard.jsx
import { useState } from "react";
import axios from "axios";

const SongCard = ({ song }) => {
  const [message, setMessage] = useState("");
  const [submittedMsg, setSubmittedMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/messages", {
      songId: song.id,
      message,
    });
    setSubmittedMsg(res.data.message);
    setMessage("");
  };

  return (
    <div className="track-card card p-4 mb-4">
      <h3>{song.title}</h3>
      <audio src={song.audioUrl} controls />
      
      <form onSubmit={handleSubmit} className="mt-3">
        <textarea
          placeholder="Drop an anonymous message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="anonymous-box w-full"
        />
        <button type="submit" className="btn mt-2">Send</button>
      </form>

      {submittedMsg && (
        <div className="anonymous-box mt-3">
          <strong>Anonymous:</strong> {submittedMsg}
        </div>
      )}
    </div>
  );
};

export default SongCard;

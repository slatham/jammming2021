import React from "react";
import "./Playlist.css";
import TrackList from "../TrackList/TrackList";

const PlayList = ({
  playlistTracks,
  playlistName,
  onRemove,
  onNameChange,
  onSave,
}) => {
  const handleNameChange = (e) => {
    onNameChange(e.target.value);
  };

  return (
    <div className="Playlist">
      <input value={playlistName} onChange={handleNameChange} />

      <TrackList tracks={playlistTracks} onRemove={onRemove} isRemoval={true} />
      <button onClick={onSave} className="Playlist-save">
        SAVE TO SPOTIFY
      </button>
    </div>
  );
};

export default PlayList;

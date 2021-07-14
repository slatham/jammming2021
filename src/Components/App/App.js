import "./App.css";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import { useState, useEffect } from "react";
import Spotify from "../../util/Spotify";

function App() {
  // get the access token
  useEffect(() => {
    Spotify.getAccessToken();
  });

  // set the initial track list - used for testing
  const tracks = [];

  // give an initial playlist name
  const initialPlaylistName = "My Super Playlist";

  // populate the playlist with initial tracks - used for testing
  const initialPlaylistTracks = [];

  // set up state using hooks
  const [searchResults, setSearchResults] = useState(tracks);
  const [playlistName, setPlaylistName] = useState(initialPlaylistName);
  const [playlistTracks, setPlaylistTracks] = useState(initialPlaylistTracks);

  // add a track to the playlist
  const addTrack = (track) => {
    // check if the track is already in the playlist
    if (playlistTracks.find((savedTrack) => track.id === savedTrack.id)) {
      return; //aka do nothing!
    }
    setPlaylistTracks((prev) => [track, ...prev]);
  };

  // remove a track from the playlist
  const removeTrack = (track) => {
    setPlaylistTracks((prev) =>
      prev.filter((prevTrack) => prevTrack.id !== track.id)
    );
  };

  // change the playlist name
  const updatePlaylistName = (name) => {
    setPlaylistName(name);
  };

  const savePlaylist = async () => {
    const trackURIs = playlistTracks.map((track) => track.uri);
    await Spotify.savePlaylist(playlistName, trackURIs);
    setPlaylistTracks([]);
    setPlaylistName("New Playlist");
  };

  const search = async (term) => {
    const results = await Spotify.search(term);
    setSearchResults(results);
    console.log(results);
  };

  return (
    <div>
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <div className="App">
        <SearchBar onSearch={search} />
        <div className="App-playlist">
          <SearchResults searchResults={searchResults} onAdd={addTrack} />
          <Playlist
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onRemove={removeTrack}
            onNameChange={updatePlaylistName}
            onSave={savePlaylist}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

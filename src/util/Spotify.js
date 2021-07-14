// set up some global variables for auth
const CLIENT_ID = "ed83349d78694bff9f22f484e2adb1be";
const REDIRECT_URI = "http://localhost:3000/";

// set up access token and expiry time global variables
let accessToken;

const Spotify = {
  // get an access token from spotify
  getAccessToken: function () {
    // check if the access token is already set
    if (accessToken) {
      console.log(`Access token already set to ${accessToken}`);
      return accessToken;
    } else {
      console.log("Access token not set");
      // pull the access token from the URL
      const accessTokenInURL =
        window.location.href.match(/access_token=([^&]*)/);
      const expiresInURL = window.location.href.match(/expires_in=([^&]*)/);
      // set the access token global variable
      if (accessTokenInURL && expiresInURL) {
        accessToken = accessTokenInURL[1];
        const expiresIn = expiresInURL[1];
        console.log(
          `Access token found in URL and is ${accessToken} the expires in ${expiresIn}`
        );
        // set a timer to wipe out the access token when it has expired
        window.setTimeout(() => {
          console.log("Expired Access token");
          accessToken = "";
        }, expiresIn * 1000);
        window.history.pushState("Access Token", null, "/");
      } else {
        // redirect to have the user authenticate
        console.log("Access token not set and not found in URL");
        window.location = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
      }
    }
  },
  // search for a track
  search: async function (term) {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?type=track&q=${term}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.ok) {
        const results = await response.json();
        const items = results.tracks.items;
        const tracks = items.map((track) => {
          return {
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
          };
        });
        return tracks;
      }
      throw new Error("Request Failed");
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  },
  // pull the authenticated user's ID from spotify
  getUserID: async function () {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        console.log("got response");
        const jsonResponse = await response.json();

        return jsonResponse.id;
      }
    } catch (error) {
      console.log(`Error fetching: ${error}`);
    }
  },
  savePlaylist: async function (playlistName, trackURIs) {
    if (!playlistName || trackURIs.length === 0) {
      console.log(
        "You need a valid playlist name and some tracks in the playlist"
      );
      return;
    }
    // get userID from spotify
    const userID = await this.getUserID();
    // save playlist and use the returned playlist id
    try {
      const data = { name: playlistName };
      const result = await fetch(
        `https://api.spotify.com/v1/users/${userID}/playlists`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (result.ok) {
        const jsonResponse = await result.json();
        const playlistID = jsonResponse.id;
        // add tracks to the playlist
        try {
          const data = { uris: trackURIs };
          console.log(data);
          const result = await fetch(
            `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`,
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify(data),
            }
          );
          if (result.ok) {
            const jsonResponse = await result.json();
            console.log(jsonResponse);
          }
        } catch (e) {
          console.log(`Error adding tracks to playlist: ${e}`);
        }
      }
      throw new Error("Request to save playlist failed.");
    } catch (e) {
      console.log(`Error saving playlist: ${e}`);
    }
  },
};

export default Spotify;

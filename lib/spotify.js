// import spotify api
import SpotifyWebApi from "spotify-web-api-node";

// rule for spotify api use
const scopes = [
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-read-email",
    "streaming",
    "user-read-private",
    "user-library-read",
    "user-top-read",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-follow-read",
].join(',');

//store all scopes to one variable
const params = {
    scope:scopes,
};

// this is the string which is all scopes joining using comma.
const queryParamString = new URLSearchParams(params);

//setting login url for spotify login
const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;

//creating instance of spotify object
const spotifyAPI = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,  
    clientSecret:process.env.NEXT_PUBLIC_CLIENT_SECRET,
})

// grab without {} anywhere
export default spotifyAPI;
//grab using {}
export {LOGIN_URL};

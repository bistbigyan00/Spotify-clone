import { useEffect } from "react";
import { signIn, useSession } from 'next-auth/react';
import SpotifyWebApi from "spotify-web-api-node";

//creating instance of spotify object
const spotifyAPI = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,  
    clientSecret:process.env.NEXT_PUBLIC_CLIENT_SECRET,
})

function useSpotify() {
    const { data: session, status } = useSession();

    // useeffect when session changes
    useEffect(()=>{
        if(session){
            // if by anychance, session is broken, then send to login page 
            if(session.error === 'RefreshAccessTokenError'){
                signIn();
            }
            
            // importing spotifyAPI from spotify.js which has all the secret code
            spotifyAPI.setAccessToken(session.user.accessToken);
        }
    },[session]);

    // this will have setAccess Token with it
    return spotifyAPI;
}

export default useSpotify
